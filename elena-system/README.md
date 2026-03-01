# Elena System — Rise & Ferment Content Generator

Sistem de generare prompturi pentru conținut vizual cu Elena, brand ambassador-ul Rise & Ferment.

## Ce face

Transformi o descriere simplă în română/engleză într-un set de prompturi gata de folosit:

- **Midjourney Web UI** — prompt text, paste după ce activezi Omni Reference
- **Midjourney Discord** — prompt complet cu `--oref` și `--ow 100`
- **Google Veo 3.1** — prompt adaptat pentru video generation

## Quick Start

```bash
cd elena-system
python elena_prompt_gen.py "Elena feeding her starter on a quiet Sunday morning"
```

Output-ul apare în terminal ȘI se salvează automat în `prompts/`.

## Comenzi

```bash
# Cu scenario explicit
python elena_prompt_gen.py "Elena holding bread" --scenario triumph

# Doar print, fără salvare
python elena_prompt_gen.py "Elena teaching" --scenario teaching --no-save

# Scenariile disponibile:
#   feeding_ritual   — hrănire dimineață
#   troubleshooting  — examinează o problemă
#   teaching         — explică la cameră
#   triumph          — ține pâinea finisată
#   real_life        — coace în viața reală
```

## Workflow pentru Midjourney Web UI

1. Deschide midjourney.com
2. Drag imaginea de referință Elena în **Omni Reference**
3. Click pe **lock icon** (menține referința pentru sesiune)
4. Paste promptul generat (secțiunea "MIDJOURNEY WEB UI")
5. Generate!

## Fișiere

| Fișier | Ce face |
|--------|---------|
| `elena-dna.json` | Definirea completă a personajului Elena |
| `elena_prompt_gen.py` | Scriptul de generare (zero dependențe, doar Python) |
| `prompts/` | Toate prompturile generate, organizate per dată |

## Referința Elena (Omni Reference)

Imaginea de bază: `elena-dna.json` → `character.oref_url`

Aceasta este imaginea pe care o tragi în Omni Reference în MJ Web UI sau o folosești cu `--oref` în Discord.

## Dependențe

Zero. Doar Python 3.7+.
