# Fattoria di Monti — Piano Operativo

Last updated: July 2026

Working checklist for the next product/engineering steps.

- Architecture source of truth: `SITE_BLUEPRINT.md`
- If this file conflicts with `STRATEGY.md` or `documenti di riferimento/`, follow `SITE_BLUEPRINT.md` for architecture and this file for current work priority.
- Do not invent new routes or IA changes here without updating the blueprint.

---

## 1. Status Snapshot

| Wave | Scope | Status |
|---|---|---|
| Performance / first paint | Preloader, Lenis/ST, reveals, WebGL tiering | Done |
| Audit & hardening | Runtime, animations, SEO, i18n structure, assets cleanup | Done (uncommitted; 3 bug note sotto) |
| English editorial translation | Real EN copy (structure already complete) | Open |
| Future locales | `zh`, `ar` (RTL), `ru` — solo dopo copy stabile data-driven | Planned |
| Cookie banner GDPR | UI + consent wiring to GA helpers | Open |
| Carne secca — versione semplice launch | Pack provvisori Giacomo + 1 CTA info | Deciso — da implementare |
| Olio — versione semplice launch | Foto archivio + 1 CTA info | Deciso — da implementare |
| Cucina Nomade — menu panini | Gusti da cartello food truck + ingredienti in arrivo | Open — nomi noti, ingredienti pending |
| Casa Rossa — struttura contenuti | Casa unica (piani/stanze/bagni), non 4 suite brandizzate | Deciso — da ridisegnare con Lorenzo |
| Casa Rossa — commodities list | Elenco servizi con Lorenzo | Todo call |
| Casa Rossa booking quiz | Concierge con date reali | Open — con Lorenzo |
| Lead destination | Google Form / Sheet / altro per CTA info | TBD Mauro |
| Domain / launch polish | Custom domain, www redirect, final assets | Open |
| Raffinamento visivo | Palette meno aggressiva, stile piana; **menu a sfondo chiaro** | Planned |
| CMS | Sanity replacing `getXData(t)` | Later |

---

## 2. Bug note (Fable 5 — da sistemare)

| Severity | Location | Finding | Status |
|---|---|---|---|
| high | `messages/en.json` ~1126 | `Overlays.oilBottleSheet.details` EN ancora in italiano | Noted |
| medium | `lib/site.ts` | Hreflang home trailing slash vs canonical | Noted |
| medium | `app/[locale]/ospitalita/page.tsx` | Gallery reduced-motion briefly trapped | Noted |

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

Impatto codice (quando si implementa):
- Semplificare `/mucco-pisano` sezione essiccata + ridurre/nascondere `JerkyProductSheet` multi-SKU se non serve.
- Niente campi peso/ingredienti/specs in UI.

### 4.2 Olio — launch semplice
Stessa logica della carne secca:
- Usare **vecchie foto d’archivio risistemate** (non shooting prodotto premium obbligatorio per launch).
- Un solo CTA generico: **«Richiedi maggiori informazioni sull’olio»**.
- Destinazione: stesso tipo di lead form (TBD).
- Niente fake cart / checkout.
- Appunti storici restano in `documenti di riferimento/` per copy editoriale; non espandere schede tecniche se non richiesto.

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

### 4.4 Casa Rossa — da ridisegnare
**Non** presentare quattro stanze brandizzate (Avorio / Verde / Rosa / Albicocca) come suite separate.

Nuova direzione:
- Una **grande Casa Rossa** raccontata per **piani**, **stanze**, **bagni** (casa unica, non hotel a camere nominate).
- Lista **commodities / servizi**: da fare **insieme a Lorenzo** (todo call).
- Booking quiz con date: ancora da definire con Lorenzo (campi, regole, destinazione lead).
- Aggiornare blueprint quando la nuova IA pagina è chiusa.

Bozza servizi storici (solo materiale di partenza per la call, non copy finale):
- Veranda, doppio soggiorno-pranzo + camino, TV nascosta, biblioteca
- Cucina attrezzata, pergola + barbecue, lavanderia
- Bagno PT con vasca, bagni piano superiore, parquet camere
- Terrazza tetto + telescopio, piscina privata, Wi‑Fi

---

## 5. Todo operativi (backlog)

### Bug / hardening
- [ ] Fix EN `oilBottleSheet.details`
- [ ] Fix hreflang trailing slash home (`lib/site.ts`)
- [ ] Fix gallery Ospitalità + reduced motion
- [ ] Commit wave hardening quando i 3 bug sono ok

### Lead / forms (Mauro)
- [ ] Scegliere destinazione CTA: Google Form / Sheet / altro per carne secca
- [ ] Stessa destinazione (o form dedicato) per olio
- [ ] Form food truck: maggiori info + **disponibilità date** + **note** (+ contatto)
- [ ] Eventuale form/booking Casa Rossa (date) — dopo ok Lorenzo

### Asset
- [ ] Ricevere packaging provvisori carne secca da Giacomo → swap immagini
- [ ] Ricevere/risistemare foto archivio olio → swap immagini
- [ ] Non chiedere specs prodotto carne secca pre-lancio

### Cucina Nomade / Food truck
- [ ] Normalizzare naming gusti (Ghizanese/Ghizzanese)
- [ ] Inserire ingredienti quando arrivano da Lorenzo
- [ ] Aggiornare gallery menu + accordion details IT+EN
- [ ] CTA unica «Richiedi maggiori informazioni» con campi date disponibilità + note

### Casa Rossa (call Lorenzo)
- [ ] Lista commodities / servizi definitiva
- [ ] Struttura narrativa: piani / stanze / bagni (niente 4 suite colorate)
- [ ] Capacità ospiti, mq, regole soggiorno
- [ ] Campi quiz prenotazione con date
- [ ] Allineare UI `/ospitalita` + home hospitality + RoomSheet alla nuova struttura
- [ ] Aggiornare `SITE_BLUEPRINT.md` sezione Ospitalità dopo decisione

### Raffinamento visivo (palette)
- [ ] Proposta palette più soft/elegante, ispirata alla **piana** della tenuta (meno contrasto aggressivo, meno accenti “gridati”)
- [ ] Aggiornare CSS variables in `app/[locale]/globals.css` (e eventuali token correlati) senza rompere leggibilità CTA
- [ ] Pass su sezioni scure / accenti (`--argilla-ferrosa`, slide Mucco, overlay) per tono più quiet luxury
- [ ] **Menu overlay: sfondo chiaro** (non scuro) — testo/icone con contrasto adeguato su cream/tufo
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
- WebGL tiering / CSS fallback via performance + reduced motion

### Product IA (attuale codice — da aggiornare dove sopra indicato)
- `Storia` absorbs filiera/cereals narrative
- `/cereali` and `/la-filiera` redirect to `/storia`
- Home product walk: Mucco, Cucina Nomade, Olio only
- `/vino-e-caccia` hidden via server redirect

### Audit hardening
- Breaking EN/TS/asset fixes
- Targeted ScrollTrigger cleanup only
- Canvas sky routes limited to `/` and `/storia`
- Privacy + cookie pages, i18n-aware 404, robots/sitemap hygiene
- Hardcoded user-facing copy moved into `messages` IT+EN
- Heavy PNG → WebP where applicable; dead deps/files removed

---

## 7. Next — Priority Queue

### P0 — Chiudere hardening
1. Sistemare i 3 bug Fable 5.
2. Commit + `npm run build` + smoke route `it`/`en`.

### P1 — Semplificare conversioni prodotto (senza aspettare produzione carne)
1. Carne secca: UI semplice + CTA unica info (form TBD).
2. Olio: CTA unica info + foto archivio quando pronte.
3. Food truck: CTA unica info con **date disponibilità** + **note**.
4. Non aggiungere pesi/specs/SKU commerce.

### P2 — Call Lorenzo (Casa Rossa + commodities)
1. Lista servizi.
2. Nuova struttura casa (piani/stanze/bagni).
3. Booking date fields.
4. Poi refactor pagina Ospitalità + blueprint.

### P3 — Cucina Nomade menu reale
1. Gusti da cartello (già noti).
2. Ingredienti appena arrivano.
3. Swap dati menu.

### P4 — Raffinamento palette + EN + launch polish
1. Palette meno aggressiva / più elegante (stile piana tenuta) via CSS variables.
2. Pass EN.
3. Cookie banner.
4. Dominio / env.

### P5 — Sanity CMS (later)

---

## 8. Explicitly Out Of Scope Unless Requested

- Re-promoting standalone `Cereali` or `La Filiera`
- Abilitare in routing `zh` / `ar` / `ru` (o altre) prima di messages + metadata + sitemap completi
- Hardcodare copy nei componenti invece di messages/data
- WebGL on every inner page
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

1. Fix 3 bug Fable 5 + commit hardening, **oppure**
2. Semplificare subito UI carne secca / olio (CTA unica, no specs), **oppure**
3. Aspettare ingredienti panini / foto Giacomo / call commodities Lorenzo.

Non mescolare refactor Casa Rossa e semplificazione prodotto nello stesso patch.
