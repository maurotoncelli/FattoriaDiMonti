# Handoff — prossimi lavori (Jul 30, 2026)

Backlog operativo dettato da Mauro. Chi prende in mano questi task deve prima leggere
`SITE_BLUEPRINT.md` (architettura, regole i18n/data, performance) e `PIANO_OPERATIVO.md`
(stato generale). Regole non negoziabili: copy solo in `messages/*` + `lib/data/*`,
sempre IT **e** EN, niente valori per-frame in React/Zustand, `npm run build` dopo
modifiche a route/i18n/tipi (mai con `next dev` attivo: condividono `.next`).

---

## 1. Menu desktop → navbar in alto — ✅ FATTO (Jul 30, 2026)

Implementata `components/ui/NavBar.tsx`: navbar fissa in alto su desktop (≥1024px),
brand a sinistra, voci compatte da `getNavbarLinks(t)` (nuovi `Navigation.*.navLabel`
nei messages IT+EN), audio toggle + locale switcher a destra. Solo testo: niente
immagini precaricate (la lentezza dell'overlay era il preload di 7 immagini di
anteprima non ottimizzate all'apertura). Pill `MenuTrigger`, `BackButton` e
`MainMenuOverlay` ora sono solo mobile (`lg:hidden`) — su mobile il menu resta
apribile come prima. Tradotte anche le label EN di `Navigation` che erano in italiano.

Rifiniture possibili in futuro: nascondere la navbar allo scroll verso il basso e
rimostrarla allo scroll verso l'alto; stato attivo più elaborato.

### 1b. Navbar — CTA fisso «Richiedi informazioni» (da fare)

Nella navbar desktop (e in modo coerente su mobile) va un **pulsante fisso in evidenza**
«Richiedi informazioni». Al click apre una **tendina elegante** (non un menu pesante)
con quattro voci di contesto:

1. Soggiorno (Casa Rossa / ospitalità)
2. Cucina itinerante
3. Vendita olio
4. Vendita carne di Mucco Pisano

In futuro, scegliendo una voce si apre **lo stesso form** già usato altrove
(es. «Richiedi maggiori info» da dentro Casa Rossa / Concierge): l’oggetto /
`topic` / `conciergeContext` si **precompila** in base alla scelta.

Backend: lead verso **Google Forms** via `app/api/contact/route.ts` (campo `topic`
già previsto). UI form sul sito: elegante e in linea col design; Lorenzo riceve
le risposte nella vista Google Forms/Sheet. Un solo flusso, più ingressi
(navbar, CTA interni pagina, ecc.) — non duplicare form diversi.

Riusare / estendere `ConciergeForm` + `ConciergeContext` in `store/useAppStore.ts`
(`default` | `cucina-nomade` | `carne-secca` | `olio`; aggiungere/allineare
contesto soggiorno se manca). Copy IT+EN in `messages`.

## 2. Puntatore custom → classico o più semplice

`components/ui/CursorEngine.tsx` (ring + dot, rAF continuo) più `cursor: none` globale
in `globals.css`. Difficile da gestire e da mantenere coerente sugli elementi interattivi.

Da fare: rimuovere il cursore custom (o ridurlo a un dettaglio minimale, es. solo dot).
Se si rimuove: togliere `cursor: none` da `html` in `globals.css`, l'override touch
`@media (hover:none)`, e tutti i `cursor: 'none'` inline sparsi nei bottoni
(cercare `cursor: 'none'` nel repo). CursorEngine è montato da `components/ui/GlobalUI.tsx`.

## 3. Asset visivi da aggiornare

- **Foto Casa Rossa + storica + video hero** — ✅ FATTO (Aug 1, 2026)
  Source: `2026.05.14_FattoriadiMontiMateriale/Export/`. Video hero compresso
  `public/videos/hero.mp4` (~2.7 MB da 33 MB, 1280×720, no audio) + poster
  `hero-poster.webp`. Foto storica in `historical-picture.webp` + crop squared
  `villa-buontalenti-storica.webp`. Interni/esterni Casa Rossa in WebP sotto
  `public/images/casa-rossa/` e path legacy aggiornati. Rapporti mobile
  rivisti (hero `100dvh` + cover 16:9, terroir 5/6 desktop e 4/5 mobile,
  galleria ospitalità portrait/landscape).
- **Bottiglie olio** — ✅ FATTO (Aug 1, 2026): tre scontornate Monti / Moraiolo /
  Razzo in `public/images/olio/*-bottiglia.webp` (sRGB, alpha, h≈1800). Nomi
  prodotto allineati nei messages; packaging in
  `public/images/olio/packaging-archivio/` per uso futuro.
- **Foto Mucco home** — ✅ FATTO (Aug 1, 2026): evocativa mucche pisane in
  `mucco-pisano-gregge.webp` (path nuovo per bustare cache `_next/image`)
  + `mucco-pisano.webp` per menu/pagina.
- **Mockup carne** (carne secca / jerky): sostituire le foto card su `/mucco-pisano`.
- **Titolini eleganti**: rifinire i label/eyebrow delle sezioni; valutare qualche
  titolino **oro** per arricchire (introdurre un token tipo `--oro` in `globals.css`
  e Tailwind config, tono smorzato coerente con la palette quiet-luxury — non oro squillante).
- **Altre foto ancora da sostituire**: cucina nomade, panini, crew; eventuale
  refresh foto olio di contesto (oliveto / frantoio) oltre alle bottiglie.
- **Video hero — grade colore** — ✅ FATTO (Aug 1, 2026): Mauro ha
  ri-esportato `minivideo_hero.mp4` con verde meno acido; ricompresso in
  `public/videos/hero.mp4` + poster aggiornato.
- **Naming «Cucina itinerante» / Boutique**: trovare un **nuovo nome** di prodotto
  più chiaro e brandabile (IT + EN) al posto di «Cucina Nomade» / «Boutique
  Itinerante» / «Cucina itinerante». Quando deciso: aggiornare menu, navbar
  `navLabel`, messages, route slug solo se serve (oggi `/cucina-nomade` —
  preferire redirect se si cambia slug). Validare con Lorenzo.

## 4. Casa Rossa — piantine interattive (pagina `/ospitalita`)

Le due piantine (`components/ui/HouseFloorPlan.tsx`, SVG placeholder con marker
numerati) devono diventare interattive:

- **Pulsanti sulle stanze**: cliccando una stanza si vedono le foto di *quella sola* stanza.
- **Una fascia foto dinamica per piano**: una tra la piantina del primo piano e quella
  del secondo, una sotto la piantina del secondo. La fascia mostra le foto della stanza
  selezionata del rispettivo piano.
- Dati: estendere `CasaContent` in `lib/content/types.ts` (es. `spaces[n].photos[]`)
  e i messages `Ospitalita.sections.casa` (IT+EN). Niente testo dentro gli SVG (i18n).
- Le foto per stanza non esistono ancora: predisporre la struttura dati e un fallback
  elegante (fascia nascosta o placeholder) finché non arrivano gli scatti.
- Attenzione blueprint: le SVG placeholder verranno sostituite dai rilievi reali.

## 5. Osservatorio "Migliaia di Stelle" (pagina `/ospitalita`)

La sezione `Ospitalita.sections.osservatorio` ("Migliaia di *Stelle*") oggi è un
riquadro nero. Sostituire con una **foto vera di cielo stellato** di sfondo e scritta
**bianca** ad alto contrasto. Serve l'asset foto (non presente in `public/images/`);
alt text nei messages, entrambe le lingue.

## 6. Cucina Nomade — nuovo menu street food (attesa conferma Lorenzo)

Foto del cartello fisico salvata in
`documenti di riferimento/menu-street-food-2026-foto.png`. Trascrizione dalla foto
(da NON pubblicare finché Lorenzo non conferma):

| Voce | Prezzo | Note |
|---|---|---|
| La Ghizzanese | € 10,00 | Piadina con 180 g di hamburger di Mucco Pisano |
| Il Ghizzanese | € 10,00 | Panino con 180 g di hamburger di Mucco Pisano |
| Il Montino | € 10,00 | "Pane e ragù e l'omo vive!" — panino con ragù di Mucco Pisano, antica ricetta toscana, tagli pregiati |
| Piadina e Nutella | € 4,00 | |
| Patate dell'orto fritte | € 4,00 | |

"Componi Il/La Ghizzanese con" — verdure: cavolo cappuccio, pomodori freschi, cipolle
caramellate, insalata; salse: mayo, mayo all'aglio, mayo + salsa verde, mayo e soia,
olio piccante. Claim: "Autentico Street Food Toscano"; badge: ingredienti di qualità,
carne di Mucco Pisano, ricette toscane tradizionali.

Quando confermato: aggiornare i dati menu su `/cucina-nomade` (data-driven, messages
IT+EN + `lib/data/cucinaNomade`), decidere se mostrare i prezzi.

## 7. Pre go-live

- **Check multilingua**: revisione editoriale completa EN (diverse sezioni sono
  traduzioni fedeli ma non riviste); parità chiavi già verificata via script.
- **SEO**: metadata per pagina (`messages.Metadata.pages.*`), OG image reali,
  sitemap/robots (già allineati alle route promosse), JSON-LD (presente in home),
  test Lighthouse su build di produzione.
- Cookie banner GDPR (voce già aperta in `PIANO_OPERATIVO.md`).
- Dominio custom + redirect www (vedi `PIANO_OPERATIVO.md`).

---

## Stato al momento dell'handoff

- Rimozione WebGL completata; backdrop `.backdrop-terroso` (tufo + grana) su tutte le route.
- Palette smorzata e riarmonizzata (`globals.css`), nuovi token `--cielo`/`--notte`.
- Fix performance scroll (pin ProductsHorizontalWalk, selettori Zustand granulari).
- Sezione Casa Rossa in home ridisegnata: fondo chiaro, foto senza scrim, fasce
  sfalsate stile rivista, invito finale con doppio CTA.
- Scrim rimosso anche dalla foto "Raggiungici" nel footer di home (text-shadow al suo posto).
- Navbar desktop implementata (punto 1 sopra); menu overlay ora solo mobile.
