#!/usr/bin/env python3
"""
Rise & Ferment — Content Pipeline

Single command from idea to ready-to-post carousel + caption.

Usage:
  python pipeline.py "starter signals"          # search content library
  python pipeline.py "feeding ratios"            # fuzzy match by tags/title
  python pipeline.py --list                      # show all available topics
  python pipeline.py --random                    # pick a random carousel
  python pipeline.py --id scoring-guide          # exact ID match

What it does:
  1. Finds matching content in the library (25+ pre-written carousels)
  2. Generates all carousel PNG images (1080x1350)
  3. Copies the Instagram caption to clipboard (if pyperclip available)
  4. Prints everything ready to post

Zero API dependencies. All content pre-written from the ebook.
"""

import argparse
import json
import os
import random
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
LIBRARY_PATH = SCRIPT_DIR / "content_library.json"
CAROUSEL_SCRIPT = SCRIPT_DIR / "carousel_gen.py"

# ---------------------------------------------------------------------------
# Content library
# ---------------------------------------------------------------------------


def load_library():
    """Load the pre-written content library."""
    if not LIBRARY_PATH.exists():
        print("ERROR: content_library.json not found")
        sys.exit(1)
    with open(LIBRARY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def search_library(library, query):
    """Fuzzy search the library by query string against titles, tags, and IDs."""
    query_lower = query.lower().strip()
    query_words = set(query_lower.split())

    scored = []
    for entry in library:
        score = 0
        title_lower = entry["title"].lower()
        id_lower = entry["id"].lower()
        tags = [t.lower() for t in entry.get("tags", [])]

        # Exact ID match
        if query_lower == id_lower or query_lower == id_lower.replace("-", " "):
            score += 100

        # Title contains query
        if query_lower in title_lower:
            score += 50

        # Query words in title
        for word in query_words:
            if word in title_lower:
                score += 20

        # Query words in tags
        for word in query_words:
            if word in tags:
                score += 15
            for tag in tags:
                if word in tag:
                    score += 5

        # Query words in ID
        for word in query_words:
            if word in id_lower:
                score += 10

        if score > 0:
            scored.append((score, entry))

    scored.sort(key=lambda x: -x[0])
    return scored


def print_library_list(library):
    """Print all available carousel topics."""
    print(f"\n{'='*60}")
    print(f"  CONTENT LIBRARY — {len(library)} carousels available")
    print(f"{'='*60}\n")
    for i, entry in enumerate(library, 1):
        tags = ", ".join(entry.get("tags", [])[:4])
        print(f"  {i:2d}. [{entry['id']}]")
        print(f"      {entry['title']}")
        print(f"      Tags: {tags}\n")


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------


def generate_carousel(entry):
    """Generate carousel images from a library entry."""
    # Write temporary JSON
    temp_path = SCRIPT_DIR / f"_temp_carousel_{entry['id']}.json"
    carousel_data = {
        "title": entry["title"],
        "slides": entry["slides"],
        "cta": entry.get("cta", "Save this for later!"),
    }
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(carousel_data, f, indent=2, ensure_ascii=False)

    # Run carousel_gen.py
    result = subprocess.run(
        [sys.executable, str(CAROUSEL_SCRIPT), str(temp_path)],
        capture_output=True,
        text=True,
    )

    # Clean up temp file
    temp_path.unlink(missing_ok=True)

    if result.returncode != 0:
        print(f"ERROR generating carousel: {result.stderr}")
        return None

    print(result.stdout)

    # Find output directory
    slug = re.sub(r"[^a-z0-9\s-]", "", entry["title"].lower())
    slug = re.sub(r"[\s-]+", "-", slug)[:50].rstrip("-")
    output_dir = SCRIPT_DIR / "output" / f"carousel-{slug}"

    return output_dir


def try_copy_to_clipboard(text):
    """Try to copy text to clipboard. Silent fail if not available."""
    try:
        import pyperclip
        pyperclip.copy(text)
        return True
    except ImportError:
        pass

    # Try native Windows clipboard
    try:
        process = subprocess.Popen(
            ["clip"], stdin=subprocess.PIPE, shell=True
        )
        process.communicate(text.encode("utf-16-le"))
        return True
    except Exception:
        pass

    return False


def print_results(entry, output_dir):
    """Print the final results with caption ready to copy."""
    sep = "=" * 60

    print(f"\n{sep}")
    print(f"  CAROUSEL READY TO POST")
    print(f"{sep}")

    # Images
    if output_dir and output_dir.exists():
        images = sorted(output_dir.glob("*.png"))
        print(f"\n  Images ({len(images)} slides):")
        for img in images:
            print(f"    {img}")

    # Caption
    caption = entry.get("caption", "")
    alt_caption = entry.get("alt_caption", "")

    print(f"\n{sep}")
    print(f"  CAPTION (copy and paste to Instagram):")
    print(f"{sep}\n")
    print(caption)

    if alt_caption:
        print(f"\n{sep}")
        print(f"  ALTERNATIVE CAPTION:")
        print(f"{sep}\n")
        print(alt_caption)

    # Try clipboard
    if caption:
        copied = try_copy_to_clipboard(caption)
        if copied:
            print(f"\n  >> Caption copied to clipboard!")

    print(f"\n{sep}")
    print(f"  POSTING CHECKLIST:")
    print(f"{sep}")
    print(f"  [ ] Open Instagram app or web")
    print(f"  [ ] Create new post > Carousel")
    print(f"  [ ] Upload all {len(list(output_dir.glob('*.png'))) if output_dir else '?'} slides in order")
    print(f"  [ ] Paste caption")
    print(f"  [ ] Add location (optional)")
    print(f"  [ ] Post!")
    print(f"\n{sep}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Rise & Ferment Content Pipeline — prompt to Instagram-ready carousel",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python pipeline.py "starter signals"     # search and generate
  python pipeline.py "feeding ratios"      # fuzzy match
  python pipeline.py --list                # see all topics
  python pipeline.py --random              # surprise me
  python pipeline.py --id scoring-guide    # exact match
        """,
    )

    parser.add_argument(
        "query",
        nargs="?",
        help="Search query to find a carousel topic",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List all available carousel topics",
    )
    parser.add_argument(
        "--random", "-r",
        action="store_true",
        help="Generate a random carousel",
    )
    parser.add_argument(
        "--id",
        help="Generate by exact carousel ID",
    )
    parser.add_argument(
        "--caption-only",
        action="store_true",
        help="Print caption without generating images",
    )

    args = parser.parse_args()
    library = load_library()

    # --- Find the entry ---
    entry = None

    if args.list:
        print_library_list(library)
        return

    if args.random:
        entry = random.choice(library)
        print(f"\n  Random pick: {entry['title']}\n")

    elif args.id:
        for e in library:
            if e["id"] == args.id:
                entry = e
                break
        if not entry:
            print(f"ERROR: No carousel with ID '{args.id}'")
            print("Use --list to see available IDs")
            sys.exit(1)

    elif args.query:
        results = search_library(library, args.query)
        if not results:
            print(f"\nNo match for '{args.query}'. Try --list to see available topics.")
            sys.exit(1)

        if len(results) == 1 or results[0][0] >= 50:
            # Clear winner
            entry = results[0][1]
            print(f"\n  Match: {entry['title']}\n")
        else:
            # Multiple matches — show top 5
            print(f"\n  Multiple matches for '{args.query}':\n")
            for i, (score, e) in enumerate(results[:5], 1):
                print(f"    {i}. {e['title']} [{e['id']}]")
            print(f"\n  Use --id <id> to pick one, e.g.: python pipeline.py --id {results[0][1]['id']}")
            return

    else:
        parser.error("Provide a search query, --random, --id, or --list")

    # --- Generate ---
    if args.caption_only:
        print(f"\n  Caption for: {entry['title']}\n")
        print(entry.get("caption", "No caption available."))
        return

    print(f"\n  Generating: {entry['title']}")
    print(f"  Slides: {len(entry['slides'])} + cover + CTA\n")

    output_dir = generate_carousel(entry)
    print_results(entry, output_dir)


if __name__ == "__main__":
    main()
