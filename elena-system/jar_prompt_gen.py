#!/usr/bin/env python3
"""
Jar Prompt Generator — Rise & Ferment Content System

Transforms a topic ID (or topic details) from jar-dna.json into a fully
formatted Gemini prompt ready to paste into Google Gemini for image generation.

Usage:
  python jar_prompt_gen.py --list                         # List all topics
  python jar_prompt_gen.py --id ready-check               # Generate prompt for a topic
  python jar_prompt_gen.py --id float-test-myth --no-save  # Print without saving
  python jar_prompt_gen.py --custom "Sourdough Hydration Guide" --format step_by_step

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
DNA_PATH = SCRIPT_DIR / "jar-dna.json"
PROMPTS_DIR = SCRIPT_DIR / "prompts" / "jar"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_dna():
    """Load Jar character DNA from JSON."""
    if not DNA_PATH.exists():
        print(f"ERROR: jar-dna.json not found at {DNA_PATH}")
        sys.exit(1)
    with open(DNA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def slugify(text, max_len=50):
    """Convert text to a filesystem-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text[:max_len].rstrip("-")


def get_expression(dna, expression_name):
    """Get the expression description from DNA."""
    return dna["expressions"].get(expression_name, "neutral expression")


# ---------------------------------------------------------------------------
# Format-specific prompt builders
# ---------------------------------------------------------------------------


def build_two_panel(dna, topic):
    """Build a Gemini prompt for a two-panel comparison post."""
    style = dna["style"]
    tmpl = dna["prompt_template"]
    panels = topic["panels"]
    left = panels["left"]
    right = panels["right"]

    left_expr = get_expression(dna, left["jar_expression"])
    right_expr = get_expression(dna, right["jar_expression"])

    prompt = f"""Create a two-panel infographic illustration (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- Two side-by-side panels below the title, divided by a decorative red folk art divider

LEFT PANEL — "{left['label']}":
- A friendly glass jar character (transparent, rounded edges) with kawaii-style eyes
- The jar has {left_expr}
- Inside the jar: {left['contents']}
- Red rubber band level marker on the outside
- Text box below with red folk-art border explaining the state

RIGHT PANEL — "{right['label']}":
- The same glass jar character with kawaii-style eyes
- The jar has {right_expr}
- Inside the jar: {right['contents']}
- Red rubber band level marker on the outside
- Text box below with red folk-art border explaining the state

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


def build_step_by_step(dna, topic):
    """Build a Gemini prompt for a step-by-step post."""
    steps = topic["steps"]

    steps_text = ""
    for i, step in enumerate(steps, 1):
        expr = get_expression(dna, step["jar_expression"])
        label = step.get("temp") or step.get("flour") or f"Step {i}"
        steps_text += f"""
PANEL {i} — "{label}":
- Glass jar character with {expr}
- Note: "{step['note']}"
"""

    prompt = f"""Create a step-by-step infographic illustration (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- {len(steps)} numbered panels flowing top-to-bottom with red folk art arrows between them
{steps_text}
Each panel has the friendly glass jar character (transparent, rounded edges, kawaii-style eyes) showing a different emotion. A red rubber band level marker on each jar.

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold. Each panel has a text box with red folk-art border.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


def build_single_tip(dna, topic):
    """Build a Gemini prompt for a single tip post."""
    expr = get_expression(dna, topic["jar_expression"])

    prompt = f"""Create a single-illustration infographic (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- Large central illustration of the friendly glass jar character (transparent, rounded edges, kawaii-style eyes)
- The jar has {expr}
- Visual scene: {topic['visual']}
- Below: text box with red folk-art border containing the explanation:
  "{topic['explanation']}"

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. The jar has a speech bubble. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


def build_myth_vs_fact(dna, topic):
    """Build a Gemini prompt for a myth vs fact post."""
    myth = topic["myth"]
    fact = topic["fact"]
    myth_expr = get_expression(dna, myth["jar_expression"])
    fact_expr = get_expression(dna, fact["jar_expression"])

    myth_visual = f"\n- Visual: {myth['visual']}" if "visual" in myth else ""
    fact_visual = f"\n- Visual: {fact['visual']}" if "visual" in fact else ""

    prompt = f"""Create a myth-vs-fact infographic illustration (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- Two sections stacked vertically:

TOP SECTION — MYTH (with a large red X):
- Red-tinted background area
- The friendly glass jar character with {myth_expr}
- Text: "{myth['text']}"{myth_visual}

BOTTOM SECTION — FACT (with a large green checkmark):
- Green-tinted background area
- The same glass jar character with {fact_expr}
- Text: "{fact['text']}"{fact_visual}

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold. "MYTH" label in red, "FACT" label in green.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


def build_checklist(dna, topic):
    """Build a Gemini prompt for a checklist post."""
    items = topic["items"]

    items_text = ""
    for item in items:
        expr = get_expression(dna, item["jar_expression"])
        items_text += f'- Checkbox item: "{item["item"]}" — small jar icon with {expr}\n'

    prompt = f"""Create a checklist infographic illustration (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- A vertical checklist with {len(items)} items, each with a hand-drawn checkbox (checked):
{items_text}
- On the right side, a larger friendly glass jar character (transparent, rounded edges, kawaii-style eyes) with a teacher expression (glasses, confident smile) looking at the checklist

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold. Each checklist item has a red folk-art checkbox.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


def build_timeline(dna, topic):
    """Build a Gemini prompt for a timeline post."""
    stages = topic["stages"]

    stages_text = ""
    for stage in stages:
        expr = get_expression(dna, stage["jar_expression"])
        stages_text += f"""
STAGE — "{stage['day']}":
- Jar character with {expr}
- Contents: {stage['contents']}
- Label: "{stage['note']}"
"""

    prompt = f"""Create a timeline infographic illustration (1080x1350 pixels, Instagram portrait format).

STYLE: Warm, rustic kitchen aesthetic with red folk art motifs (decorative borders, arrows, dividers) on a beige/cream parchment background. Hand-drawn feel, educational but cozy.

LAYOUT:
- Bold red title at the top: "{topic['title']}"
- A vertical timeline with red folk art connectors (arrows/dots) between stages:
{stages_text}
Each stage shows the friendly glass jar character (transparent, rounded edges, kawaii-style eyes) at a different emotional state and fill level. Red rubber band level marker on each jar.

TEXT STYLE: All text in English. Title in bold red. Body text in dark brown. Key terms in red bold. Each stage has a text box with red folk-art border.

CRITICAL: The jar character has NO arms, NO legs — all emotion is conveyed through the eyes and mouth expressions only. Beige/cream parchment background is mandatory. Red folk art decorative elements throughout."""

    return prompt


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

FORMAT_BUILDERS = {
    "two_panel_comparison": build_two_panel,
    "step_by_step": build_step_by_step,
    "single_tip": build_single_tip,
    "myth_vs_fact": build_myth_vs_fact,
    "checklist": build_checklist,
    "timeline": build_timeline,
}


def build_prompt(dna, topic):
    """Route to the correct format builder."""
    fmt = topic["format"]
    builder = FORMAT_BUILDERS.get(fmt)
    if not builder:
        print(f"ERROR: Unknown format '{fmt}'. Available: {list(FORMAT_BUILDERS.keys())}")
        sys.exit(1)
    return builder(dna, topic)


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------


def save_prompt(topic_id, prompt_text):
    """Save generated prompt to a dated file."""
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"{date_str}-jar-{topic_id}.txt"
    filepath = PROMPTS_DIR / filename

    counter = 2
    while filepath.exists():
        filename = f"{date_str}-jar-{topic_id}-{counter}.txt"
        filepath = PROMPTS_DIR / filename
        counter += 1

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(prompt_text)

    return filepath


def copy_to_clipboard(text):
    """Copy text to clipboard (Windows)."""
    try:
        import subprocess
        process = subprocess.Popen(
            ["powershell", "-Command", "Set-Clipboard", "-Value", "$input"],
            stdin=subprocess.PIPE,
        )
        process.communicate(input=text.encode("utf-8"))
        return True
    except Exception:
        return False


def list_topics(dna):
    """Print all available topics."""
    topics = dna.get("content_topics", [])
    sep = "=" * 60

    print(f"\n{sep}")
    print("  JAR CONTENT TOPICS")
    print(f"{sep}\n")

    for t in topics:
        status = f" [{t['status']}]" if "status" in t else ""
        print(f"  {t['id']:<25} {t['format']:<25}{status}")
        print(f"    > {t['title']}")
        print()

    print(f"  Total: {len(topics)} topics")
    print(f"{sep}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Generate Gemini prompts for Jar character posts (Rise & Ferment)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python jar_prompt_gen.py --list
  python jar_prompt_gen.py --id ready-check
  python jar_prompt_gen.py --id float-test-myth --no-save
  python jar_prompt_gen.py --id temperature-zones --clipboard

Available formats: two_panel_comparison, step_by_step, single_tip,
                   myth_vs_fact, checklist, timeline
        """,
    )

    parser.add_argument("--list", action="store_true", help="List all available topics")
    parser.add_argument("--id", type=str, help="Topic ID from jar-dna.json")
    parser.add_argument("--no-save", action="store_true", help="Print without saving to file")
    parser.add_argument("--clipboard", "-c", action="store_true", help="Copy prompt to clipboard")

    args = parser.parse_args()
    dna = load_dna()

    if args.list:
        list_topics(dna)
        return

    if not args.id:
        parser.print_help()
        return

    # Find topic by ID
    topics = dna.get("content_topics", [])
    topic = next((t for t in topics if t["id"] == args.id), None)

    if not topic:
        print(f"ERROR: Topic '{args.id}' not found.")
        print(f"Available: {[t['id'] for t in topics]}")
        sys.exit(1)

    # Build the prompt
    prompt = build_prompt(dna, topic)

    # Output
    sep = "=" * 70
    print(f"\n{sep}")
    print(f"  JAR PROMPT GENERATOR — Gemini")
    print(f"{sep}")
    print(f"\n  Topic:  {topic['title']}")
    print(f"  Format: {topic['format']}")
    print(f"  ID:     {topic['id']}")
    print()

    print("--- GEMINI PROMPT (paste into Google Gemini) ---\n")
    print(prompt)

    saved_path = None
    if not args.no_save:
        saved_path = save_prompt(args.id, prompt)
        print(f"\n--- Saved to: {saved_path} ---")

    if args.clipboard:
        if copy_to_clipboard(prompt):
            print("--- Copied to clipboard! ---")
        else:
            print("--- Clipboard copy failed (manual copy needed) ---")

    print(f"\n{sep}\n")


if __name__ == "__main__":
    main()
