# Fattoria di Monti — Piano Operativo

Last updated: July 2026

Working checklist for the next product/engineering steps.

- Architecture source of truth: `SITE_BLUEPRINT.md`
- If this file conflicts with `STRATEGY.md` or `documenti di riferimento/`, follow `SITE_BLUEPRINT.md` for architecture and this file for current work priority.
- Do not invent new routes or IA changes here without updating the blueprint.
- Backlog dettagliato dei prossimi lavori richiesti da Mauro (Jul 30, 2026): `HANDOFF.md`.

---

## 1. Status Snapshot

| Wave | Scope | Status |
|---|---|---|
| Performance / first paint | Preloader, Lenis/ST, reveals, WebGL tiering | Done |
| Audit & hardening | Runtime, animations, SEO, i18n structure, assets cleanup | Done (uncommitted; 3 bug note sotto) |
| English editorial translation | Real EN copy (structure already complete) | Open |
| Future locales | `zh`, `ar` (RTL), `ru` — solo dopo copy stabile data-driven | Planned |
| Cookie banner GDPR | UI + consent wiring to GA helpers | Open |
| Carne secca — versione semplice launch | Card statiche + 1 CTA info (Concierge `carne-secca`) | Done Jul 2026 (uncommitted) |
| Olio — versione semplice launch | Slot foto archivio + 1 CTA info (Concierge `olio`) | Done Jul 2026 (foto da caricare) |
| Cucina Nomade — menu panini | Gusti da cartello food truck + ingredienti in arrivo | Open — nomi noti, ingredienti pending |
| Casa Rossa — struttura contenuti | Casa unica: piani + piantine SVG + comodità | Done Jul 2026 (piantine placeholder, contenuti da validare con Lorenzo) |
| Casa Rossa — commodities list | Prima lista in messages `Ospitalita.sections.casa.amenities`; rifinire con Lorenzo | Draft |
| Casa Rossa booking quiz | Concierge con date reali | Open — con Lorenzo |
| Lead destination | Google Form / Sheet / altro per CTA info (`/api/contact` pronto con `topic`) | TBD Mauro |
| Domain / launch polish | Custom domain, www redirect, final assets | Open |
| Raffinamento visivo | Palette meno aggressiva, stile piana; menu a sfondo chiaro | Done prima passata Jul 2026 |
| Rimozione WebGL | three.js/R3F ritirati; immagini DOM native + backdrop CSS statico | Done Jul 2026 (uncommitted) |
| CMS | Sanity replacing `getXData(t)` | Later |

---

## 2. Bug note (Fable 5 — sistemati Jul 2026, da committare)

| Severity | Location | Finding | Status |
|---|---|---|---|
| high | `messages/en.json` ~1126 | `Overlays.oilBottleSheet.details` EN ancora in italiano | Fixed |
| medium | `lib/site.ts` | Hreflang home trailing slash vs canonical | Fixed |
| medium | `app/[locale]/ospitalita/page.tsx` | Gallery reduced-motion briefly trapped | Fixed |

---

## 3. Lingue e traduzioni

### Regola copy (sempre)
- **Zero hardcoding** di testi user-facing nei componenti.
- Tutto data-driven: `messages/*` + `lib/data/*` + contratti in `lib/content/types.ts`.
- Ogni stringa nuova deve nascere già in messages (IT+EN ora), pronta per traduzione verso le lingue future senza rifattorizzare UI.

### Lingue live (ora)
- **`it`** (default) e **`en`** — `i18n/routing.ts` + blueprint.
- Non abilitare altre locale in routing finché non esistono `messages/<locale>.json` + metadata + sitemap + QA completi.

### Lingue previste in futuro
| Locale | Lingua | Note |
|---|---|---|
| `zh` | Cinese | Da aggiungere quando i contenuti sono stabili |
| `ar` | Arabo | RTL — richiederà layout/dir support oltre ai messages |
| `ru` | Russo | Da aggiungere quando i contenuti sono stabili |

Ordine di lavoro i18n: chiudere copy IT stabile → EN editoriale → poi `zh` / `ar` / `ru` (stessa struttura chiavi).

### Stato i18n (misura Jul 2026)
| Metrica | Valore |
|---|---|
| Chiavi IT | 376 |
| Chiavi EN | 376 |
| Chiavi mancanti | 0 (struttura completa) |
| Stringhe IT === EN | ~213 (~57%) |
| EN ancora “italian-looking” | ~42 |

---

## 4. Decisioni prodotto (Jul 2026) — vincolanti

Owner: **Lorenzo Querci**. Packaging/foto provvisorie: **Giacomo Toncelli**. Lead/forms: **Mauro** (destinazione ancora da scegliere).

### 4.1 Carne secca — launch semplice
Lorenzo **non** riesce a produrre carne secca prima del sito.

Regole launch:
- Sezione **semplice** (niente schede prodotto ricche, niente pesi, grammi, shelf-life, specifiche tecniche).
- Foto: **packaging provvisori** che manderà Giacomo.
- Un solo CTA: **«Richiedi maggiori informazioni sulla carne secca»**.
- Destinazione CTA: Google Form (o equivalente) — **ancora da definire**.
- Non vendere / non simulare e-commerce.

Stato implementazione (Jul 2026):
- `/mucco-pisano`: card prodotto **statiche** (foto + descrizione + tag), nessun click.
- CTA unica → Concierge context `carne-secca` (flow info: nome, contatto, note).
- `JerkyProductSheet` **eliminato** (componente, store flags, messages `Overlays.jerkySheet`).
- Il payload `/api/contact` include `topic` (carne-secca / olio / default / cucina-nomade); manca solo l'endpoint reale (TBD Mauro).

### 4.2 Olio — launch semplice
Stessa logica della carne secca:
- Usare **vecchie foto d’archivio risistemate** (non shooting prodotto premium obbligatorio per launch).
- Un solo CTA generico: **«Richiedi maggiori informazioni sull’olio»**.
- Destinazione: stesso tipo di lead form (TBD).
- Niente fake cart / checkout.
- Appunti storici restano in `documenti di riferimento/` per copy editoriale; non espandere schede tecniche se non richiesto.

Stato implementazione (Jul 2026):
- CTA finale pagina e CTA dello sheet bottiglia → Concierge context `olio` (flow info).
- Card bottiglie: se `Olio.bottles[n].image.src` è valorizzato nei messages mostra la **foto reale**, altrimenti fallback bottiglia CSS. Basta caricare le foto e riempire gli src.
- Rimossi `ctaLabel` per bottiglia e il blocco ordine fake (`Olio.order` ridotto a `openSheetLabel`).

### 4.3 Cucina Nomade / Food truck
Gusti letti dal cartello inviato da Lorenzo (naming da normalizzare in copy):

| Voce cartello | Note |
|---|---|
| Il Ghizanese | ortografia da confermare (ghizanese / ghizzanese) |
| La Ghizzanese | — |
| Il Montino | — |
| Piadina e Nutella | — |
| Patate dell’orto fritte | side / non panino |

- **Ingredienti**: Mauro li riceverà a breve da Lorenzo → aggiornare `lib/data/cucinaNomade.tsx` + messages.
- Il menu attuale in codice (Mucco, Cinta, Tartufato, Silvano, Sbadato, …) è **da sostituire** con questa lista reale.

**CTA lead (come olio / carne secca):**
- Pulsante: **«Richiedi maggiori informazioni»** (food truck / Cucina Nomade).
- Campi essenziali da raccogliere: **disponibilità per alcune date** + **note** (oltre a contatto).
- Destinazione: Google Form / equivalente — **TBD** (stesso tema lead Mauro).
- Il Concierge `cucina-nomade` oggi chiede già data evento + ospiti + contatto: allinearlo a questa richiesta (date disponibilità + note), non a un fake booking.

### 4.4 Casa Rossa — implementata come casa unica (Jul 2026)
**Non** presentare quattro stanze brandizzate (Avorio / Verde / Rosa / Albicocca) come suite separate. ✔ fatto.

Stato implementazione:
- `/ospitalita` sezione 3 = **casa unica**: due piani con **piantine SVG placeholder** (`components/ui/HouseFloorPlan.tsx`, marker numerati → legenda `spaces` dai messages), strip foto con lightbox, griglia comodità in 4 gruppi (`components/ui/AmenityIcon.tsx`).
- Contratto dati: `CasaContent` in `lib/content/types.ts`; contenuti in `Ospitalita.sections.casa` (IT+EN).
- `RoomSheet` e `RoomFloorPlan` **eliminati** (componenti, store flags, messages `Overlays.roomSheet`).
- Home hospitality: rimosso il riferimento alle 4 stanze colorate nel testo "L'Esperienza".

Da chiudere con Lorenzo:
- Validare lista comodità (`Ospitalita.sections.casa.amenities` è la prima bozza dai servizi storici).
- Sostituire le piantine placeholder con gli **SVG definitivi** del rilievo (stesso componente, due piani).
- Capacità ospiti, mq, regole soggiorno; booking quiz con date (campi, regole, destinazione lead).

---

## 5. Todo operativi (backlog)

### Bug / hardening
- [x] Fix EN `oilBottleSheet.details`
- [x] Fix hreflang trailing slash home (`lib/site.ts`)
- [x] Fix gallery Ospitalità + reduced motion
- [ ] Commit wave hardening quando i 3 bug sono ok (fix fatti, manca il commit)

### Lead / forms (Mauro)
- [ ] Scegliere destinazione CTA: Google Form / Sheet / altro per carne secca (`/api/contact` già invia `topic` + `message`; basta compilare `GOOGLE_FORMS_URL` + `FIELD_MAP`)
- [ ] Stessa destinazione (o form dedicato) per olio
- [ ] Form food truck: maggiori info + **disponibilità date** + **note** (+ contatto)
- [ ] Eventuale form/booking Casa Rossa (date) — dopo ok Lorenzo

### Asset
- [ ] Ricevere packaging provvisori carne secca da Giacomo → swap `bustina-*.webp`
- [ ] Ricevere/risistemare foto archivio olio → riempire `Olio.bottles[n].image.src` (IT+EN)
- [ ] Piantine SVG definitive Casa Rossa → sostituire i due piani in `HouseFloorPlan.tsx`
- [ ] Foto reali Casa Rossa → aggiornare src in `lib/data/ospitalita.tsx` (sezione casa)
- [ ] Non chiedere specs prodotto carne secca pre-lancio

### Cucina Nomade / Food truck
- [ ] Normalizzare naming gusti (Ghizanese/Ghizzanese)
- [ ] Inserire ingredienti quando arrivano da Lorenzo
- [ ] Aggiornare gallery menu + accordion details IT+EN
- [ ] CTA unica «Richiedi maggiori informazioni» con campi date disponibilità + note

### Casa Rossa (call Lorenzo)
- [ ] Validare lista commodities / servizi (bozza già in messages)
- [x] Struttura narrativa: piani / stanze / bagni (niente 4 suite colorate) — implementata Jul 2026
- [ ] Capacità ospiti, mq, regole soggiorno (confermare 210 mq / 8 ospiti)
- [ ] Campi quiz prenotazione con date
- [x] Allineare UI `/ospitalita` + home hospitality alla nuova struttura (RoomSheet ritirato)
- [x] Aggiornare `SITE_BLUEPRINT.md` sezione Ospitalità

### Raffinamento visivo (palette)
- [x] Proposta palette più soft/elegante, ispirata alla **piana** della tenuta (meno contrasto aggressivo, meno accenti “gridati”) — prima passata Jul 2026
- [x] Aggiornare CSS variables in `app/[locale]/globals.css` (e token Tailwind ora puntano alle CSS vars; accenti hardcoded migrati a `var()`; `labelColor` bottiglie/prodotti desaturati in messages IT+EN; hero title home ridotto)
- [x] **Menu overlay: sfondo chiaro** — testo mucco-pisano su tufo, toggle e locale switcher adattati, transizione pagina chiara (`#ECE8DF`); locale switcher desktop ridotto a it/en
- [ ] Pass su sezioni scure / accenti (slide Mucco, overlay) per tono più quiet luxury — rifinire dopo validazione visiva
- [ ] Validare con riferimento estetico “stile loro” (foto territorio / materiali) prima di shippare

### i18n / launch
- [ ] Audit residuale: nessun testo user-facing hardcoded (tutto messages/data)
- [ ] Pass EN editoriale (dopo o in parallelo ai contenuti reali)
- [ ] Futuro: aggiungere `zh`, `ar` (RTL), `ru` con parity chiavi + metadata + sitemap
- [ ] Cookie banner GDPR
- [ ] Dominio + env Netlify

---

## 6. Completed — Keep As Baseline

### Performance
- Hero/text not blocked by long preloaders
- Lenis + ScrollTrigger bridge centralized; no scroll/frame values in Zustand
- Section reveals faster and reduced-motion aware
- **WebGL rimosso (Jul 2026)**: niente three.js/R3F; hero, villa e product slides sono `<Image>` DOM native (parallax GSAP), backdrop CSS statico in `AppWrapper`; ritirati CanvasToggle, easter egg particellare e `useDevicePerformance`. First Load JS home ~174 kB.

### Product IA (attuale codice — da aggiornare dove sopra indicato)
- `Storia` absorbs filiera/cereals narrative
- `/cereali` and `/la-filiera` redirect to `/storia`
- Home product walk: Mucco, Cucina Nomade, Olio only
- `/vino-e-caccia` hidden via server redirect

### Audit hardening
- Breaking EN/TS/asset fixes
- Targeted ScrollTrigger cleanup only
- Backdrop "cielo" (ora gradiente CSS statico) limitato a `/` e `/storia`
- Privacy + cookie pages, i18n-aware 404, robots/sitemap hygiene
- Hardcoded user-facing copy moved into `messages` IT+EN
- Heavy PNG → WebP where applicable; dead deps/files removed

---

## 7. Next — Priority Queue

### P0 — Commit
1. Commit dell'intera wave (bug fix + palette + menu chiaro + semplificazione carne/olio + Casa Rossa unica + rimozione WebGL). Build già verde.

### P1 — Asset & lead endpoint
1. Foto packaging Giacomo → swap `bustina-*.webp`.
2. Foto archivio olio → riempire `Olio.bottles[n].image.src`.
3. Endpoint lead Mauro → `GOOGLE_FORMS_URL` + `FIELD_MAP` in `/api/contact`.

### P2 — Call Lorenzo (Casa Rossa)
1. Validare comodità + numeri (mq, ospiti).
2. Piantine SVG definitive.
3. Booking date fields (poi aggiornare Concierge default).

### P3 — Cucina Nomade menu reale
1. Gusti da cartello (già noti).
2. Ingredienti appena arrivano.
3. Swap dati menu + CTA info con date disponibilità + note.

### P4 — EN + launch polish
1. Pass EN editoriale.
2. Rifinitura sezioni scure (quiet luxury pass 2).
3. Cookie banner.
4. Dominio / env.

### P5 — Sanity CMS (later)

---

## 8. Explicitly Out Of Scope Unless Requested

- Re-promoting standalone `Cereali` or `La Filiera`
- Abilitare in routing `zh` / `ar` / `ru` (o altre) prima di messages + metadata + sitemap completi
- Hardcodare copy nei componenti invece di messages/data
- Reintrodurre WebGL/three.js (rimosso Jul 2026 per fluidità) senza decisione esplicita
- Fake e-commerce cart / ordini con quantità per carne secca o olio al launch
- Specs, pesi, schede tecniche carne secca pre-produzione
- Quattro stanze brandizzate Avorio/Verde/Rosa/Albicocca come modello hotel
- Implementare quiz date Casa Rossa **senza** ok di Lorenzo
- Aggiungere form Google finché Mauro non sceglie l’endpoint

---

## 9. Definition Of Done (per slice)

1. Content in both `messages/it.json` and `messages/en.json` when user-facing.
2. Types/data constructors updated if the content shape changes.
3. No new hardcoding in components.
4. Animations scoped; cleanup only what the component creates.
5. Reduced motion / low-performance paths still readable.
6. `ReadLints` on touched files; `npm run build` after route/i18n/shared changes.
7. Update this file’s status table when a wave finishes.
8. Update `SITE_BLUEPRINT.md` when product architecture truly changes (es. nuova Casa Rossa).

---

## 10. Suggested Next Command

1. Review visiva su localhost (menu chiaro, carne, olio, Casa Rossa) → poi **commit** della wave, **oppure**
2. Inserire asset appena arrivano (packaging Giacomo, foto olio, piantine definitive), **oppure**
3. Endpoint lead Mauro (`/api/contact`).
