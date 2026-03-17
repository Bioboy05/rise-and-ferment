# Theme Reference — Rise & Ferment

## CSS Variables (defined in globals.css)

### Light Theme (default)
```css
:root {
  --bg-primary: #FFFBF5;
  --bg-secondary: #FFF8F0;
  --bg-card: #FFFFFF;
  --text-primary: #3D2914;
  --text-secondary: #6B5744;
  --text-muted: #9B8B7A;
  --accent: #8B5A2B;
  --accent-light: #D4A574;
  --border: #E8DDD0;
  --shadow: rgba(139, 90, 43, 0.1);
}
```

### Dark Theme
```css
[data-theme="dark"] {
  --bg-primary: #1A1612;
  --bg-secondary: #241F1A;
  --bg-card: #2A2420;
  --text-primary: #F5EBE0;
  --text-secondary: #C4B5A5;
  --text-muted: #8B7D6E;
  --accent: #D4A574;
  --accent-light: #8B5A2B;
  --border: #3D352D;
  --shadow: rgba(0, 0, 0, 0.3);
}
```

## Glassmorphism Pattern
```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 4px 16px var(--shadow);
}
```

## Typography
- **Headings:** font-family: 'Caveat', cursive
- **Body:** font-family: 'Nunito', sans-serif
- **Sizes:** Use Tailwind scale (text-sm, text-base, text-lg, text-xl, text-2xl)

## Usage Rules
- Always use CSS variables for colors, never Tailwind color classes
- Tailwind is fine for: spacing, layout, borders, radius, shadows, responsive
- Toggle via `data-theme="dark"` attribute on `<html>` element
- Test both themes after any visual change
