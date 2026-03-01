#!/usr/bin/env python3
"""
Instagram Carousel Generator — Rise & Ferment

Generates a set of 1080x1350 PNG slides from a JSON content file.
Minimal & clean style matching the Rise & Ferment brand.

Usage:
  python carousel_gen.py content.json
  python carousel_gen.py content.json --output ./my-carousels
  python carousel_gen.py --example              # print example JSON

Requires: Pillow (pip install Pillow)
"""

import argparse
import json
import math
import re
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
FONTS_DIR = SCRIPT_DIR / "fonts"
DEFAULT_OUTPUT = SCRIPT_DIR / "output"

# Instagram optimal: 1080x1350 (4:5 portrait)
WIDTH = 1080
HEIGHT = 1350

# Brand colors
CREAM_BG = (255, 251, 245)       # #FFFBF5
ACCENT = (139, 90, 43)           # #8B5A2B
TEXT_DARK = (61, 41, 20)         # #3D2914
TEXT_MUTED = (139, 120, 100)     # muted brown
ACCENT_LIGHT = (245, 235, 224)   # #F5EBE0 — subtle accent bg

# Layout
MARGIN = 80
CONTENT_WIDTH = WIDTH - MARGIN * 2

# ---------------------------------------------------------------------------
# Font loading
# ---------------------------------------------------------------------------


def load_font(name, size):
    """Load a .ttf font from the fonts directory."""
    path = FONTS_DIR / f"{name}.ttf"
    if not path.exists():
        print(f"WARNING: Font {path} not found, using default")
        return ImageFont.load_default()
    try:
        return ImageFont.truetype(str(path), size)
    except Exception:
        return ImageFont.load_default()


def get_fonts():
    """Load all font variants used in carousel slides."""
    return {
        "title_large": load_font("Caveat", 96),
        "title_medium": load_font("Caveat", 72),
        "heading": load_font("Nunito", 52),
        "body": load_font("Nunito", 38),
        "body_small": load_font("Nunito", 32),
        "number": load_font("Caveat", 120),
        "watermark": load_font("Nunito", 28),
        "cta_title": load_font("Caveat", 80),
        "cta_body": load_font("Nunito", 40),
        "swipe": load_font("Nunito", 36),
    }


# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------


def draw_watermark(draw, fonts):
    """Draw @riseandferment watermark at the bottom of each slide."""
    text = "@riseandferment"
    font = fonts["watermark"]
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (WIDTH - tw) // 2
    y = HEIGHT - MARGIN + 10
    draw.text((x, y), text, fill=TEXT_MUTED, font=font)


def draw_accent_line(draw, y, width=200):
    """Draw a short horizontal accent line."""
    x_start = (WIDTH - width) // 2
    draw.line([(x_start, y), (x_start + width, y)], fill=ACCENT, width=3)


def wrap_text(text, font, draw, max_width):
    """Word-wrap text to fit within max_width pixels."""
    words = text.split()
    lines = []
    current_line = ""

    for word in words:
        test_line = f"{current_line} {word}".strip()
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word

    if current_line:
        lines.append(current_line)

    return lines


def draw_wrapped_text(draw, text, font, x, y, max_width, fill, line_spacing=1.3):
    """Draw word-wrapped text. Returns the y position after the last line."""
    lines = wrap_text(text, font, draw, max_width)
    for line in lines:
        draw.text((x, y), line, fill=fill, font=font)
        bbox = draw.textbbox((0, 0), line, font=font)
        line_height = bbox[3] - bbox[1]
        y += int(line_height * line_spacing)
    return y


def draw_centered_wrapped(draw, text, font, y, max_width, fill, line_spacing=1.3):
    """Draw centered word-wrapped text. Returns y after last line."""
    lines = wrap_text(text, font, draw, max_width)
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        lh = bbox[3] - bbox[1]
        x = (WIDTH - tw) // 2
        draw.text((x, y), line, fill=fill, font=font)
        y += int(lh * line_spacing)
    return y


# ---------------------------------------------------------------------------
# Slide generators
# ---------------------------------------------------------------------------


def create_cover_slide(title, fonts):
    """Create the first slide (cover) with title and swipe indicator."""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM_BG)
    draw = ImageDraw.Draw(img)

    # Decorative circle at top
    circle_y = 280
    circle_r = 60
    draw.ellipse(
        [(WIDTH // 2 - circle_r, circle_y - circle_r),
         (WIDTH // 2 + circle_r, circle_y + circle_r)],
        outline=ACCENT, width=3
    )
    # Wheat/bread icon (simple lines inside circle)
    cx, cy = WIDTH // 2, circle_y
    draw.line([(cx, cy - 30), (cx, cy + 30)], fill=ACCENT, width=3)
    draw.line([(cx - 15, cy - 15), (cx, cy - 30)], fill=ACCENT, width=2)
    draw.line([(cx + 15, cy - 15), (cx, cy - 30)], fill=ACCENT, width=2)
    draw.line([(cx - 12, cy), (cx, cy - 12)], fill=ACCENT, width=2)
    draw.line([(cx + 12, cy), (cx, cy - 12)], fill=ACCENT, width=2)

    # Title — centered, large
    title_y = circle_y + circle_r + 100
    title_y = draw_centered_wrapped(
        draw, title, fonts["title_large"], title_y,
        CONTENT_WIDTH, TEXT_DARK, line_spacing=1.2
    )

    # Accent line
    draw_accent_line(draw, title_y + 40, width=150)

    # "Swipe to learn →"
    swipe_text = "Swipe to learn  \u2192"
    font = fonts["swipe"]
    bbox = draw.textbbox((0, 0), swipe_text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - tw) // 2, title_y + 80),
        swipe_text, fill=ACCENT, font=font
    )

    draw_watermark(draw, fonts)
    return img


def create_content_slide(index, heading, body, total, fonts):
    """Create a content slide with number, heading, and body text."""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM_BG)
    draw = ImageDraw.Draw(img)

    # Big number in accent color
    number_text = str(index)
    number_font = fonts["number"]
    bbox = draw.textbbox((0, 0), number_text, font=number_font)
    nw = bbox[2] - bbox[0]
    nh = bbox[3] - bbox[1]
    number_x = (WIDTH - nw) // 2
    number_y = 200
    draw.text((number_x, number_y), number_text, fill=ACCENT, font=number_font)

    # Accent line under number
    line_y = number_y + nh + 40
    draw_accent_line(draw, line_y, width=100)

    # Heading
    heading_y = line_y + 60
    heading_y = draw_centered_wrapped(
        draw, heading, fonts["heading"], heading_y,
        CONTENT_WIDTH, TEXT_DARK, line_spacing=1.3
    )

    # Body text
    body_y = heading_y + 30
    draw_centered_wrapped(
        draw, body, fonts["body"], body_y,
        CONTENT_WIDTH - 40, TEXT_MUTED, line_spacing=1.4
    )

    # Progress dots at bottom
    dot_y = HEIGHT - MARGIN - 40
    dot_spacing = 24
    total_dots_width = (total - 1) * dot_spacing
    start_x = (WIDTH - total_dots_width) // 2
    for i in range(total):
        x = start_x + i * dot_spacing
        r = 6 if i == index - 1 else 4
        color = ACCENT if i == index - 1 else ACCENT_LIGHT
        draw.ellipse([(x - r, dot_y - r), (x + r, dot_y + r)], fill=color)

    draw_watermark(draw, fonts)
    return img


def create_cta_slide(cta_text, fonts):
    """Create the final CTA slide."""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM_BG)
    draw = ImageDraw.Draw(img)

    # CTA title
    cta_y = 400
    cta_y = draw_centered_wrapped(
        draw, cta_text, fonts["cta_title"], cta_y,
        CONTENT_WIDTH, ACCENT, line_spacing=1.2
    )

    # Accent line
    draw_accent_line(draw, cta_y + 40, width=200)

    # Follow text
    follow_y = cta_y + 100
    follow_text = "Follow for daily sourdough tips"
    draw_centered_wrapped(
        draw, follow_text, fonts["cta_body"], follow_y,
        CONTENT_WIDTH, TEXT_MUTED
    )

    # Handle
    handle_y = follow_y + 80
    handle = "@riseandferment"
    bbox = draw.textbbox((0, 0), handle, font=fonts["cta_body"])
    tw = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - tw) // 2, handle_y),
        handle, fill=TEXT_DARK, font=fonts["cta_body"]
    )

    draw_watermark(draw, fonts)
    return img


# ---------------------------------------------------------------------------
# Main generation
# ---------------------------------------------------------------------------


def slugify(text, max_len=50):
    """Convert text to filesystem-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text[:max_len].rstrip("-")


def generate_carousel(data, output_dir=None):
    """Generate all carousel slides from a content dict."""
    title = data["title"]
    slides = data["slides"]
    cta = data.get("cta", "Save this for later!")

    # Output directory
    slug = slugify(title)
    if output_dir is None:
        output_dir = DEFAULT_OUTPUT
    out_path = Path(output_dir) / f"carousel-{slug}"
    out_path.mkdir(parents=True, exist_ok=True)

    fonts = get_fonts()
    total_slides = len(slides) + 2  # cover + content + CTA
    generated = []

    # Cover
    cover = create_cover_slide(title, fonts)
    cover_path = out_path / "slide-01-cover.png"
    cover.save(str(cover_path), "PNG")
    generated.append(cover_path)
    print(f"  [1/{total_slides}] Cover: {cover_path.name}")

    # Content slides
    for i, slide in enumerate(slides, start=1):
        heading = slide.get("heading", slide.get("title", f"Point {i}"))
        body = slide.get("body", slide.get("text", ""))
        img = create_content_slide(i, heading, body, len(slides), fonts)
        fname = f"slide-{i + 1:02d}.png"
        img_path = out_path / fname
        img.save(str(img_path), "PNG")
        generated.append(img_path)
        print(f"  [{i + 1}/{total_slides}] Content: {fname}")

    # CTA slide
    cta_img = create_cta_slide(cta, fonts)
    cta_path = out_path / f"slide-{total_slides:02d}-cta.png"
    cta_img.save(str(cta_path), "PNG")
    generated.append(cta_path)
    print(f"  [{total_slides}/{total_slides}] CTA: {cta_path.name}")

    return out_path, generated


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

EXAMPLE_JSON = """{
  "title": "5 Signs Your Starter Is Ready to Bake",
  "slides": [
    {
      "heading": "It doubles in size",
      "body": "After feeding, a healthy starter should double within 4-6 hours. Mark the jar to track growth."
    },
    {
      "heading": "Consistent bubbles",
      "body": "Look for lots of small, even bubbles throughout — not just on top. This means active fermentation."
    },
    {
      "heading": "Pleasant tangy smell",
      "body": "It should smell like yogurt or mild vinegar. If it smells like nail polish, it needs more frequent feeding."
    },
    {
      "heading": "Passes the float test",
      "body": "Drop a spoonful in water. If it floats, the yeast is producing enough gas. Ready to bake!"
    },
    {
      "heading": "Predictable timing",
      "body": "You know exactly when it peaks after feeding. Consistency is the ultimate sign of readiness."
    }
  ],
  "cta": "Save this for later!"
}"""


def main():
    parser = argparse.ArgumentParser(
        description="Generate Instagram carousel images from JSON content",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python carousel_gen.py content.json
  python carousel_gen.py content.json --output ./my-carousels
  python carousel_gen.py --example     # print example JSON to stdout
        """,
    )

    parser.add_argument(
        "input_file",
        nargs="?",
        help="Path to JSON file with carousel content",
    )
    parser.add_argument(
        "--output", "-o",
        default=None,
        help=f"Output directory (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--example",
        action="store_true",
        help="Print example JSON to stdout and exit",
    )

    args = parser.parse_args()

    if args.example:
        print(EXAMPLE_JSON)
        return

    if not args.input_file:
        parser.error("Please provide a JSON file, or use --example to see the format")

    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"ERROR: File not found: {input_path}")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Validate
    if "title" not in data:
        print("ERROR: JSON must have a 'title' field")
        sys.exit(1)
    if "slides" not in data or not data["slides"]:
        print("ERROR: JSON must have a non-empty 'slides' array")
        sys.exit(1)

    print(f"\nGenerating carousel: {data['title']}")
    print(f"  Slides: {len(data['slides'])} content + cover + CTA\n")

    out_path, generated = generate_carousel(data, args.output)

    print(f"\nDone! {len(generated)} slides saved to: {out_path}")
    print("Ready to post on Instagram!\n")


if __name__ == "__main__":
    main()
