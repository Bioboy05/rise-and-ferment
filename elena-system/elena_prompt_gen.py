#!/usr/bin/env python3
"""
Elena Prompt Generator — Rise & Ferment Content System

Transforms a simple concept description into formatted prompts for:
  - Midjourney Web UI (text only, no parameters)
  - Midjourney Discord (with --oref and --ow)
  - Google Veo 3.1 (video prompt)

Usage:
  python elena_prompt_gen.py "Elena feeding her starter on a quiet Sunday morning"
  python elena_prompt_gen.py "Elena holding bread" --scenario triumph
  python elena_prompt_gen.py "Elena teaching" --scenario teaching --no-save

Zero dependencies — uses only Python standard library.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
DNA_PATH = SCRIPT_DIR / "elena-dna.json"
PROMPTS_DIR = SCRIPT_DIR / "prompts"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_dna():
    """Load Elena's character DNA from JSON."""
    if not DNA_PATH.exists():
        print(f"ERROR: elena-dna.json not found at {DNA_PATH}")
        sys.exit(1)
    with open(DNA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def slugify(text, max_len=40):
    """Convert text to a filesystem-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text[:max_len].rstrip("-")


def get_scenario_context(dna, scenario_name):
    """Get mood/setting/expression hints from a named scenario."""
    scenarios = dna.get("scenarios", {})
    if scenario_name and scenario_name in scenarios:
        return scenarios[scenario_name]
    return None


# ---------------------------------------------------------------------------
# Prompt builders
# ---------------------------------------------------------------------------


def build_web_prompt(dna, concept, scenario=None):
    """Build a Midjourney Web UI prompt (text only, no parameters).

    The Web UI uses Omni Reference (drag & drop the reference image),
    so we don't include --oref here — just the scene description
    merged with Elena's visual DNA.
    """
    char = dna["character"]
    seed = char["seed_prompt"]

    # Start with character foundation, then layer the concept
    parts = []

    # Scene description from user concept
    parts.append(concept.rstrip(".") + ".")

    # Character anchors (subset — the full seed is for initial generation,
    # subsequent images only need key identifiers + the oref lock)
    parts.append(
        "Woman in her early 30s, warm brown eyes, "
        "shoulder-length wavy ombre hair (dark brown roots to warm caramel tips), "
        "side-swept bangs, olive skin with subtle freckles."
    )

    # Outfit (default unless concept overrides)
    if "wearing" not in concept.lower() and "dress" not in concept.lower():
        parts.append("Wearing a white cotton t-shirt under a cream linen apron.")

    # Scenario-specific mood
    sc = get_scenario_context(dna, scenario)
    if sc:
        parts.append(f"Mood: {sc['mood']}. Expression: {sc['expression']}.")
        if "kitchen" not in concept.lower():
            parts.append(f"Setting: {sc['setting']}.")

    # Photography style
    parts.append(
        "Warm natural morning window light, shot on Canon 85mm f/1.4, "
        "shallow depth of field, warm color palette. "
        "Photorealistic, editorial quality."
    )

    return " ".join(parts)


def build_discord_prompt(dna, web_prompt):
    """Wrap the web prompt with Discord-specific MJ parameters."""
    oref_url = dna["character"]["oref_url"]
    return f"{web_prompt} --oref {oref_url} --ow 100"


def build_veo_prompt(dna, concept, scenario=None):
    """Build a Google Veo 3.1 video prompt.

    Veo prompts are more cinematic and describe motion/action,
    not static photography parameters.
    """
    veo = dna.get("veo_defaults", {})
    sc = get_scenario_context(dna, scenario)

    parts = []

    # Scene
    parts.append(concept.rstrip(".") + ".")

    # Character (shorter for video — Veo doesn't do oref)
    parts.append(
        "Young woman in her early 30s with warm brown eyes and "
        "shoulder-length wavy ombre hair, wearing a cream linen apron "
        "over a white t-shirt."
    )

    # Mood & motion
    if sc:
        parts.append(f"She looks {sc['expression']}.")
    parts.append(
        f"{veo.get('style', 'Cinematic, handheld, natural light').capitalize()} style. "
        f"Subtle, realistic movements. "
        f"Duration: {veo.get('duration', '5-8 seconds')}."
    )

    # Kitchen ambient
    parts.append("Bright kitchen with wooden countertops, warm morning light.")

    return " ".join(parts)


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------


def save_prompt(concept, scenario, web, discord, veo):
    """Save generated prompts to a dated JSON file in prompts/."""
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now().strftime("%Y-%m-%d")
    slug = slugify(concept)
    filename = f"{date_str}-{slug}.json"
    filepath = PROMPTS_DIR / filename

    # Handle duplicate filenames
    counter = 2
    while filepath.exists():
        filename = f"{date_str}-{slug}-{counter}.json"
        filepath = PROMPTS_DIR / filename
        counter += 1

    data = {
        "concept": concept,
        "scenario": scenario,
        "generated_at": datetime.now().isoformat(),
        "prompts": {
            "midjourney_web": web,
            "midjourney_discord": discord,
            "veo_video": veo,
        },
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return filepath


def print_prompts(concept, scenario, web, discord, veo, saved_path=None):
    """Pretty-print the generated prompts to stdout."""
    sep = "=" * 70

    print(f"\n{sep}")
    print(f"  ELENA PROMPT GENERATOR")
    print(f"{sep}")
    print(f"\n  Concept:  {concept}")
    if scenario:
        print(f"  Scenario: {scenario}")
    print()

    print(f"--- MIDJOURNEY WEB UI (paste after locking Omni Reference) ---\n")
    print(web)

    print(f"\n--- MIDJOURNEY DISCORD (complete command) ---\n")
    print(discord)

    print(f"\n--- VEO 3.1 VIDEO PROMPT ---\n")
    print(veo)

    if saved_path:
        print(f"\n--- Saved to: {saved_path} ---")

    print(f"\n{sep}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Generate Midjourney & Veo prompts for Elena (Rise & Ferment)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python elena_prompt_gen.py "Elena feeding her starter on a quiet Sunday morning"
  python elena_prompt_gen.py "Elena holding bread" --scenario triumph
  python elena_prompt_gen.py "Elena teaching" --scenario teaching --no-save

Available scenarios:
  feeding_ritual   — morning feeding, concentrated but relaxed
  troubleshooting  — examining a problem, empathetic not panicked
  teaching         — explaining to camera, warm not condescending
  triumph          — holding finished loaf, quiet pride
  real_life        — baking while life happens
        """,
    )

    parser.add_argument(
        "concept",
        help='Simple description of the scene, e.g. "Elena feeding her starter"',
    )
    parser.add_argument(
        "--scenario",
        "-s",
        choices=["feeding_ritual", "troubleshooting", "teaching", "triumph", "real_life"],
        default=None,
        help="Use a predefined scenario for mood/expression hints",
    )
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="Print prompts without saving to file",
    )

    args = parser.parse_args()

    # Auto-detect scenario from concept keywords if not specified
    if not args.scenario:
        concept_lower = args.concept.lower()
        if any(w in concept_lower for w in ["feeding", "feed", "starter", "jar"]):
            args.scenario = "feeding_ritual"
        elif any(w in concept_lower for w in ["flat", "problem", "wrong", "puzzled", "examining"]):
            args.scenario = "troubleshooting"
        elif any(w in concept_lower for w in ["teaching", "explaining", "camera", "showing"]):
            args.scenario = "teaching"
        elif any(w in concept_lower for w in ["holding", "finished", "loaf", "pride", "triumph"]):
            args.scenario = "triumph"
        elif any(w in concept_lower for w in ["real", "life", "messy", "chaos", "kids"]):
            args.scenario = "real_life"

    dna = load_dna()

    web = build_web_prompt(dna, args.concept, args.scenario)
    discord = build_discord_prompt(dna, web)
    veo = build_veo_prompt(dna, args.concept, args.scenario)

    saved_path = None
    if not args.no_save:
        saved_path = save_prompt(args.concept, args.scenario, web, discord, veo)

    print_prompts(args.concept, args.scenario, web, discord, veo, saved_path)


if __name__ == "__main__":
    main()
