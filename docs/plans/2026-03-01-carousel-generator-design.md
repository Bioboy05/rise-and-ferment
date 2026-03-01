# Carousel Generator — Design Doc

## What
Python script that generates Instagram carousel images (1080x1350 PNG) from JSON input.

## Style
Minimal & clean — warm cream background, Caveat headings, Nunito body text, brand accent color.

## Input
JSON with title, slides array (heading + body), and CTA text.

## Output
Numbered PNG files in `output/<slug>/` folder, ready to post.

## Dependencies
Pillow (PIL) + bundled .ttf fonts (Caveat, Nunito).

## Location
`elena-system/carousel_gen.py`
