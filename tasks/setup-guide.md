# Rise & Ferment — Setup Guide (Monetizare)

> Ghid step-by-step pentru activarea completă a infrastructurii de monetizare.
> Fiecare placeholder din cod are instrucțiuni exacte aici: fișier + linie + ce înlocuiești.
> Estimare timp total: ~3-4 ore (împărțite în sesiuni).

---

## Cuprins

1. [Amazon Associates](#1-amazon-associates)
2. [Google Analytics 4](#2-google-analytics-4)
3. [MailerLite (Email Automation)](#3-mailerlite-email-automation)
4. [Amazon OneLink (Multi-Country)](#4-amazon-onelink-multi-country)
5. [Wise (Primirea Banilor)](#5-wise-primirea-banilor)
6. [Social Media](#6-social-media)
7. [Legal Pages](#7-legal-pages)
8. [Elena — Personajul AI](#8-elena--personajul-ai)
9. [Taxe România](#9-taxe-romania)
10. [Verificare Finală](#10-verificare-finala)

---

## 1. Amazon Associates

**Timp estimat:** 15 minute
**Link:** https://affiliate-program.amazon.com

### Pași

- [ ] Mergi la https://affiliate-program.amazon.com → Sign Up
- [ ] Completează profilul cu:
  - Website: `https://riseandferment.com`
  - Descriere: "Sourdough starter tracking app with equipment recommendations"
  - Categorie: Food & Drink / Cooking
- [ ] Primești tag-ul tău (ex: `riseandferment-20`)
- [ ] Înlocuiește `YOURTAG-20` cu tag-ul tău real:

#### Fișier: `public/_redirects` (liniile 2-11)

Deschide fișierul și fă **Find & Replace**:
- Find: `YOURTAG-20`
- Replace: `riseandferment-20` *(tag-ul tău real)*

Sunt 10 apariții — toate trebuie înlocuite:

```
/go/dutch-oven    → tag=TAGUL-TAU 301
/go/scale         → tag=TAGUL-TAU 301
/go/banneton      → tag=TAGUL-TAU 301
/go/lame          → tag=TAGUL-TAU 301
/go/kitchenaid    → tag=TAGUL-TAU 301
/go/le-creuset    → tag=TAGUL-TAU 301
/go/proofing-box  → tag=TAGUL-TAU 301
/go/thermapen     → tag=TAGUL-TAU 301
/go/breville      → tag=TAGUL-TAU 301
/go/fwsy-book     → tag=TAGUL-TAU 301
```

- [ ] Commit + push:
  ```bash
  git add public/_redirects
  git commit -m "config: add Amazon Associates tag"
  git push
  ```

### Note
- Amazon acceptă afiliați din orice țară, inclusiv România
- Primele 180 zile: trebuie să faci minim 3 vânzări ca să-ți aprobe contul definitiv
- Comision standard: 4% (Home & Kitchen), 4.5% (Kitchen Appliances)
- Payout minim: $10 (transfer bancar) sau $10 (gift card)

---

## 2. Google Analytics 4

**Timp estimat:** 10 minute
**Link:** https://analytics.google.com

### Pași

- [ ] Mergi la https://analytics.google.com → "Start measuring"
- [ ] Creează Property:
  - Name: `Rise & Ferment`
  - Time zone: `Romania (EET)`
  - Currency: `Euro (EUR)` sau `US Dollar (USD)`
- [ ] Alege Web platform → Enter URL: `riseandferment.com`
- [ ] Copiază **Measurement ID** (format: `G-XXXXXXXXXX`)
- [ ] Înlocuiește placeholder-ul în **2 fișiere**:

#### Fișier 1: `index.html` (linia 10)

```
Caută:  window.GA_ID='G-XXXXXXXXXX'
Înlocuiește cu:  window.GA_ID='G-ID-UL-TAU'
```

#### Fișier 2: `app.html` (linia 27)

```
Caută:  window.GA_ID='G-XXXXXXXXXX'
Înlocuiește cu:  window.GA_ID='G-ID-UL-TAU'
```

- [ ] Commit + push:
  ```bash
  git add index.html app.html
  git commit -m "config: add GA4 measurement ID"
  git push
  ```

### Verificare
- Deschide site-ul → Accept cookies (banner jos)
- În GA4 dashboard → Realtime → ar trebui să vezi 1 utilizator activ
- Custom events implementate: `lead_magnet_download`, `newsletter_signup`, `affiliate_click`

### Note
- GA4 se încarcă DOAR după ce vizitatorul apasă "Accept" pe cookie banner (GDPR compliant)
- Cookie consent se salvează în `localStorage` key: `rf_cookie_consent`
- Vizitatorii care dau "Decline" NU sunt tracked — și asta e OK

---

## 3. MailerLite (Email Automation)

**Timp estimat:** 20 minute
**Link:** https://www.mailerlite.com

### Pași

- [ ] Mergi la https://www.mailerlite.com → Sign Up Free
  - Planul gratuit: 1,000 subscribers, 12,000 emails/lună
- [ ] Verifică email-ul și completează profilul
- [ ] Creează 2 grupuri:
  - Mergi la Subscribers → Groups → Create Group
  - Grup 1: `Guide Subscribers` (pentru lead magnet)
  - Grup 2: `Newsletter` (pentru newsletter)
- [ ] Ia API Key:
  - Settings → Integrations → Developer API
  - Creează un nou API token
  - Copiază token-ul (se afișează o singură dată!)
- [ ] Ia Group IDs:
  - Subscribers → Groups → click pe fiecare grup
  - URL-ul conține ID-ul: `app.mailerlite.com/subscribers/group/XXXXXXXX`
  - Sau folosește API: `curl -H "Authorization: Bearer API_KEY" https://connect.mailerlite.com/api/groups`

#### Fișier: `index.html` — handleLead (linia 987)

Decomentează linia (șterge `//` de la început) și înlocuiește:

```javascript
// ÎNAINTE (comentat):
// fetch('https://connect.mailerlite.com/api/subscribers',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer YOUR_MAILERLITE_API_KEY'},body:JSON.stringify({email:email,groups:['YOUR_GUIDE_GROUP_ID']})}).catch(()=>{});

// DUPĂ (decomentant + valori reale):
fetch('https://connect.mailerlite.com/api/subscribers',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer ml-CHEIA-TA-REALA'},body:JSON.stringify({email:email,groups:['ID-GRUP-GUIDE']})}).catch(()=>{});
```

#### Fișier: `index.html` — handleNL (linia 1002)

Aceeași operație:

```javascript
// DUPĂ (decomentant + valori reale):
fetch('https://connect.mailerlite.com/api/subscribers',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer ml-CHEIA-TA-REALA'},body:JSON.stringify({email:email,groups:['ID-GRUP-NEWSLETTER']})}).catch(()=>{});
```

- [ ] Commit + push:
  ```bash
  git add index.html
  git commit -m "config: activate MailerLite email capture"
  git push
  ```

### Welcome Email Sequence (opțional, din dashboard-ul MailerLite)

Configurezi din MailerLite → Automations → Create:

| Email | Când | Subiect | Conținut |
|-------|------|---------|----------|
| #1 | Imediat | "Your 7-Day Sourdough Guide is here!" | Link PDF + intro Rise & Ferment |
| #2 | Ziua 2 | "Day 1 tip: The flour matters" | Sfat + link la app |
| #3 | Ziua 5 | "Day 3 panic? Don't worry" | Troubleshooting + link banneton |
| #4 | Ziua 8 | "Ready for your first loaf?" | Rețetă + link Dutch oven + KitchenAid |
| #5 | Ziua 14 | "You did it! What's next?" | Newsletter invite + premium tools |

### Note despre securitate

> **IMPORTANT**: API key-ul MailerLite este vizibil în codul sursă al paginii (client-side JavaScript).
> Asta e OK pentru MailerLite deoarece:
> - API-ul lor de subscribers permite doar ADĂUGARE (nu citire/ștergere)
> - Riscul e minim: cineva ar putea adăuga emailuri spam în lista ta
> - Pentru protecție extra: în MailerLite → Settings → activează double opt-in
>
> Alternativă mai sigură (viitor): mutarea API call-urilor pe o Netlify Function serverless.

---

## 4. Amazon OneLink (Multi-Country)

**Timp estimat:** 30 minute (dar necesită conturi aprobate)
**Link:** https://affiliate-program.amazon.com → Tools → OneLink

### Ce face OneLink?
Detectează automat locația vizitatorului (IP) și îl redirecționează de pe amazon.com la Amazon-ul local (amazon.de, amazon.fr, etc.) cu tag-ul tău de affiliate din acea țară. **Zero modificări de cod necesare.**

### Pași

- [ ] Contul Amazon.com Associates trebuie aprobat mai întâi (vezi Secțiunea 1)
- [ ] Din Associates dashboard → "Manage Account" → "OneLink"
- [ ] Aplică pentru programe adiționale:
  - [ ] amazon.co.uk (Associates UK)
  - [ ] amazon.de (Associates Germany)
  - [ ] amazon.fr (Associates France)
  - [ ] amazon.it (Associates Italy)
  - [ ] amazon.es (Associates Spain)
- [ ] Fiecare necesită înregistrare separată dar poți aplica direct din OneLink
- [ ] Primești tag separat per țară (ex: `riseandferment-21` pentru UK)
- [ ] Activează OneLink: selectează toate țările pentru care ai conturi → Save

### Rezultat

| Vizitator din | Redirecționat la | Tag folosit |
|---------------|-----------------|-------------|
| SUA | amazon.com | tag US |
| Germania | amazon.de | tag DE |
| Franța | amazon.fr | tag FR |
| Italia | amazon.it | tag IT |
| Spania | amazon.es | tag ES |
| UK | amazon.co.uk | tag UK |
| România | amazon.de (cel mai aproape) | tag DE |

### Note
- OneLink suportă: US, UK, FR, DE, IT, ES, NL, PL, SE, CA, AU, JP
- România NU are Amazon.ro — românii comandă de pe amazon.de sau amazon.com
- Link-urile din `public/_redirects` rămân ca fallback (amazon.com) — OneLink le interceptează automat
- Nu e nevoie de nicio modificare în cod

---

## 5. Wise (Primirea Banilor)

**Timp estimat:** 20 minute
**Link:** https://wise.com

### De ce Wise?
- IBAN-uri locale în EUR, USD, GBP — Amazon plătește ca și cum ar fi cont local
- Curs de schimb real (nu curs bancar cu 2-3% markup)
- Comisioane mici: ~0.5% la conversie EUR→RON

### Pași

- [ ] Mergi la https://wise.com → Sign Up
- [ ] Verifică identitatea (buletin/pașaport + selfie)
- [ ] Activează conturi multi-currency:
  - [ ] EUR balance → primești IBAN european
  - [ ] USD balance → primești routing number + account number US
  - [ ] GBP balance → primești sort code + account number UK
- [ ] Configurează ca metodă de plată în Amazon Associates:
  - Amazon.com → Payment method → Bank transfer → IBAN-ul USD de la Wise
  - Amazon.de → Payment method → Bank transfer → IBAN-ul EUR de la Wise
  - (la fel pentru FR, IT, ES, UK)

### Note
- Minimum payout Amazon: ~$10 (US), ~€25 (EU) — variază per program
- Amazon plătește la 60 zile după luna în care s-a făcut vânzarea
- Wise te anunță prin notificare când primești bani

---

## 6. Social Media

**Timp estimat:** 15 minute (setup), ongoing (content)

### Pași

- [ ] Creează cont Instagram: `@riseandferment`
  - Bio: "Your 7-day journey to sourdough mastery 🍞 Free guide ↓"
  - Link in bio: `https://riseandferment.com`
- [ ] Creează cont TikTok: `@riseandferment`
  - Bio similar
- [ ] (Opțional) Creează canal YouTube: `Rise & Ferment`

### Actualizare Link-uri în Cod

#### Fișier: `index.html` (linia 425)

Caută link-urile `href="#"` din footer și înlocuiește cu URL-urile reale:

```
Caută:    <a href="#" class="ft__slink" aria-label="Instagram">
Înlocuiește cu:    <a href="https://instagram.com/riseandferment" class="ft__slink" aria-label="Instagram" target="_blank" rel="noopener">
```

```
Caută:    <a href="#" class="ft__slink" aria-label="TikTok">
Înlocuiește cu:    <a href="https://tiktok.com/@riseandferment" class="ft__slink" aria-label="TikTok" target="_blank" rel="noopener">
```

#### Fișier: `index.html` (linia 428) — Connect section

```
Caută:    <a href="#" class="ft__link">Instagram</a>
Înlocuiește cu:    <a href="https://instagram.com/riseandferment" class="ft__link" target="_blank" rel="noopener">Instagram</a>
```

```
Caută:    <a href="#" class="ft__link">TikTok</a>
Înlocuiește cu:    <a href="https://tiktok.com/@riseandferment" class="ft__link" target="_blank" rel="noopener">TikTok</a>
```

```
Caută:    <a href="#" class="ft__link">YouTube</a>
Înlocuiește cu:    <a href="https://youtube.com/@riseandferment" class="ft__link" target="_blank" rel="noopener">YouTube</a>
```

- [ ] Commit + push:
  ```bash
  git add index.html
  git commit -m "config: add social media links"
  git push
  ```

### Plan Content 7 Zile

| Zi | Platformă | Tip | Conținut | Hook |
|----|-----------|-----|----------|------|
| Luni | IG Feed | Foto+caption | "Meet Elena" — intro + brand story | "I killed 3 starters before getting it right." |
| Marți | IG Stories | Poll+Quiz | "Ever tried sourdough?" + quiz temperatură | "90% of beginners get this wrong..." |
| Miercuri | IG Carousel | 7 slides | "7 Days to Your First Starter" | "Day 3 is when most people quit. Don't." |
| Joi | TikTok | Video 15-30s | "#1 reason your starter failed" | "If it smells like nail polish, DON'T throw it away" |
| Vineri | IG Reel | Video 30s | "Day 3 Panic is NORMAL" | "Your starter just 'died'? Actually, it's evolving." |
| Sâmbătă | IG Feed | Foto+caption | First loaf beauty shot + recipe | "This loaf took 14 days. Worth every one." |
| Duminică | TikTok | Video 15s | Timelapse: starter rising 8 ore | "8 hours in 15 seconds. This is alive." |

### Hashtag-uri

```
#sourdough #sourdoughstarter #sourdoughbread #homemadebread
#artisanbread #breadmaking #sourdoughjourney #bakingathome
#realbread #fermentation #riseandferment
```

---

## 7. Legal Pages

**Timp estimat:** 30 minute (poți folosi generatoare online)

Footer-ul are 3 link-uri care încă sunt `href="#"` (linia 430 din `index.html`):

- [ ] **Privacy Policy** — Obligatorie GDPR
  - Generator gratuit: https://www.privacypolicygenerator.info
  - Menționează: cookies (GA4), email collection (Netlify + MailerLite), affiliate links
  - Creează fișier `privacy.html` în root sau o pagină pe Notion/Google Docs
  - Actualizează `href="#"` → `href="/privacy.html"` sau URL extern

- [ ] **Terms of Service**
  - Generator: https://www.termsofservicegenerator.net
  - Creează `terms.html`
  - Actualizează `href="#"` → `href="/terms.html"`

- [ ] **Affiliate Disclosure** — Obligatorie FTC (US) + EU
  - Text recomandat:
    > "Some links on this site are affiliate links. If you purchase through these links, we earn a small commission at no extra cost to you. We only recommend products we genuinely believe in."
  - Creează `affiliate-disclosure.html`
  - Actualizează `href="#"` → `href="/affiliate-disclosure.html"`

- [ ] Commit + push după creare

### Note
- Privacy Policy e OBLIGATORIE dacă ai GA4 + cookie consent + email collection
- Affiliate Disclosure e OBLIGATORIE pentru Amazon Associates (condiție din TOS)
- Fără acestea riști: amenzi GDPR + suspendare cont Amazon Associates

---

## 8. Elena — Personajul AI

**Instrumente:** Midjourney (imagini), Kling AI/Hedra (video), ElevenLabs (voce), CapCut (editare)

### Prompt Base Midjourney (copiază exact)

```
A warm, natural-looking Eastern European woman, early 30s, light brown
wavy hair pulled back loosely, minimal makeup, wearing a cream linen
apron over a simple earth-tone top, standing in a bright rustic kitchen
with wooden countertops and natural light from a large window. She has
warm brown eyes, a genuine smile, flour-dusted hands. Soft warm color
palette. Shot on Canon EOS R5, 85mm f/1.4, natural window light.
Photorealistic, editorial photography style. --ar 4:5 --v 6.1 --style raw
```

### Variante

1. **Close-up cu borcanul:**
   ```
   [base prompt], holding a glass jar with active sourdough starter at
   eye level, examining bubbles with curiosity and delight --ar 4:5
   ```

2. **Teaching pose:**
   ```
   [base prompt], gesturing toward a glass jar on the counter, explaining
   something with an engaged expression, slight head tilt --ar 4:5
   ```

3. **Disappointed/concerned:**
   ```
   [base prompt], looking at a flat sourdough starter in a jar with a
   slightly worried but hopeful expression, one hand on hip --ar 4:5
   ```

4. **Celebrating:**
   ```
   [base prompt], holding up a beautiful round sourdough loaf with a
   scored ear, beaming with pride, golden crust visible --ar 4:5
   ```

5. **Kitchen action:**
   ```
   [base prompt], mixing flour and water in a glass bowl, overhead angle
   showing her hands and ingredients, lifestyle photography --ar 1:1
   ```

6. **Kneading:**
   ```
   [base prompt], kneading dough on a floured wooden surface, captured
   mid-action, flour particles in the air, dynamic shot --ar 16:9
   ```

### Workflow Video

1. Generează imagine Elena cu Midjourney (prompturi de mai sus)
2. Importă imaginea în **Kling AI** (kling.kuaishou.com) sau **Hedra** (hedra.com)
3. Adaugă voce cu **ElevenLabs** (elevenlabs.io) — voce feminină caldă
4. Editare finală în **CapCut** (gratuit) — subtitle-uri automate, tranziții

### Alternative Video AI
- **Kling AI** — cel mai bun lip-sync realist
- **Hedra** — specializat pe talking head
- **Dreamina** (dreamina.com) — image-to-video
- **Runway Gen-3** — calitate cinematică (mai scump)

---

## 9. Taxe Romania

### Etapa 1: Declarația Unică (venit mic)

**Când:** Imediat ce primești primele comisioane
**Condiție:** Venit sub 12 salarii minime/an (~24,300 lei / ~4,860 EUR)

- Impozit: **10%** pe venitul net
- Completezi **Declarația Unică (formularul 212)** anual
- Termen: 25 mai anul următor
- Depui online pe https://www.anaf.ro → Spațiul Privat Virtual

### Etapa 2: PFA (venit constant)

**Când:** Depășești ~2,000 lei/lună constant (~400 EUR)
**CAEN:** `6312` (Activități ale portalurilor web) sau `7311` (Publicitate)

- Impozit pe venit: **10%** pe venitul net
- CAS (pensie): 25% din 12 salarii minime dacă venit > 48,600 lei/an
- CASS (sănătate): 10% din 6 salarii minime dacă venit > 24,300 lei/an
- Total taxe la venit mic: ~10% (doar impozitul)
- Total taxe la venit mare: ~30-35%

### Etapa 3: SRL Micro (scale)

**Când:** Depășești ~8,000 lei/lună constant (~1,600 EUR)

- Impozit pe venit SRL: **1%** (micro cu angajat) sau **3%** (fără angajat)
- Impozit pe dividende: **8%**
- Necesită contabil (~200-300 lei/lună)

### TVA

- **NU** te înregistrezi la TVA dacă veniturile sunt sub 395,000 lei/an (~79,000 EUR)
- Comisioanele affiliate = prestare servicii, exonerate sub prag

### Recomandare

```
$0 - $400/lună  →  Declarația Unică (cel mai simplu)
$400 - $1,600/lună  →  PFA
$1,600+/lună  →  SRL Micro
```

---

## 10. Verificare Finala

Checklist final după ce ai completat toți pașii:

### Funcțional
- [ ] Deschide https://riseandferment.com
- [ ] Acceptă cookies → verifică în GA4 Realtime că apari
- [ ] Completează email în lead magnet → verifică Netlify Forms dashboard
- [ ] Verifică că PDF-ul se deschide după submit
- [ ] Completează email în newsletter → verifică Netlify Forms dashboard
- [ ] Verifică MailerLite dashboard — subscriberii apar în grupurile corecte
- [ ] Click pe un produs affiliate → deschide Amazon cu tag-ul tău
- [ ] Verifică exit-intent popup (mișcă mouse-ul spre browser close)
- [ ] Verifică sticky CTA bar (scroll jos pe pagină)

### Multi-Country (după OneLink)
- [ ] Folosește VPN pe Germania → click affiliate → verifică amazon.de
- [ ] Folosește VPN pe Franța → click affiliate → verifică amazon.fr
- [ ] Fără VPN (România) → verifică amazon.com sau amazon.de

### Social
- [ ] Link-urile Instagram/TikTok/YouTube din footer funcționează
- [ ] Prima postare Instagram publicată

### Legal
- [ ] Privacy Policy accesibilă din footer
- [ ] Terms accesibil din footer
- [ ] Affiliate Disclosure accesibil din footer

---

## Programe Affiliate Suplimentare (Viitor)

Comisioane mai mari decât Amazon (4%):

| Program | Comision | Cookie | Link Aplicare |
|---------|----------|--------|---------------|
| Brod & Taylor | ~10% | 30 zile | brodandtaylor.com → contact |
| ThermoWorks | ~10% | 30 zile | thermoworks.com/affiliate |
| King Arthur Baking | 5-8% | 30 zile | kingarthurbaking.com → contact |
| Breadtopia | ~10% | 30 zile | breadtopia.com → contact |
| Skillshare | $7/free trial | 30 zile | skillshare.com/affiliates |
| Masterclass | 25%/sub | 30 zile | masterclass.com/affiliates |
| Bosch Home (EU) | ~8% | 30 zile | via Awin network |

---

## Roadmap 6 Luni

| Lună | Focus | Revenue Estimat |
|------|-------|----------------|
| 1 | Setup complet (acest ghid) + primele postări | $0–50 |
| 2 | Email automation + OneLink activat | $50–200 |
| 3 | SEO + blog expansion + direct affiliates EU | $200–500 |
| 4 | Paid PDF ($9.99) + social media traction | $500–1,000 |
| 5 | Email list 500+ + multi-country optimizat | $1,000–2,000 |
| 6 | Optimization + scale + programe non-Amazon | $2,000–4,000 |
