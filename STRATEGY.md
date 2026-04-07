# Fattoria di Monti — Strategy & Architecture Blueprint
> Ultimo aggiornamento: Aprile 2026

Questo documento è il punto di riferimento per l'architettura del sito, lo stack tecnico, le linee guida visive e il piano di evoluzione verso Sanity CMS.

---

## 1. Stack Tecnico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Stile | Tailwind CSS + CSS Variables |
| Animazioni | GSAP + ScrollTrigger + matchMedia |
| 3D / Canvas | React Three Fiber (`@react-three/fiber`) |
| Stato globale | Zustand (`useAppStore`) |
| Internazionalizzazione | next-intl |
| Contenuto attuale | `messages/it.json` + `messages/en.json` |
| Contenuto futuro | Sanity CMS (GROQ) |

---

## 2. Architettura Data-Driven (in vigore da Aprile 2026)

### Principio fondamentale
**Zero hardcoding** di stringhe visibili nel DOM. Ogni testo, label, aria-label o dato strutturato viene estratto da una sorgente centralizzata.

### Layer di contenuto

```
messages/
├── it.json     ← fonte italiana di verità (UI chrome + contenuto pagine)
└── en.json     ← struttura identica (da tradurre)

lib/
├── content/
│   └── types.ts   ← TypeScript interfaces (= futuro schema Sanity)
└── data/
    ├── olio.tsx         ← getOlioData(t)
    ├── filiera.tsx      ← getFilieraData(t)
    ├── muccoPisano.tsx  ← getMuccoPisanoData(t)
    ├── ospitalita.tsx   ← getOspitalitaData(t)
    ├── storia.tsx       ← getStoriaData(t)
    ├── cereali.tsx      ← getCerealiData(t)
    ├── products.tsx     ← getProductsData(t)
    ├── menu.ts          ← getMainMenuLinks(t)
    └── cucinaNomade.tsx ← getCucinaNomadeData(t) [prossima iterazione]
```

### Pattern nelle pagine (client component)
```tsx
// Ogni pagina inner chiama:
const t = useTranslations();
const pageData = getXData(t);
// poi usa pageData.field per tutto il contenuto
```

### Pattern nei componenti (UI chrome)
```tsx
// Componenti di navigazione/UI:
const t = useTranslations('UI.backButton');
t('label')     // "✦ Indietro"
t('ariaLabel') // "Torna alla pagina precedente"
```

### Separazione UI chrome vs. contenuto pagina
| Tipo | Dove vive | Esempio |
|---|---|---|
| Label pulsanti, aria-labels, sezione labels | `messages.UI.*` | `UI.backButton`, `UI.audio`, `UI.sectionLabels` |
| Testi navigazione menu | `messages.Navigation.*` | `Navigation.olio.label` |
| Contenuto pagine (titoli, testi, quote) | `messages.[Pagina].*` | `Olio.acts.act1.label` |
| Config media (src immagini, colori, webgl) | `lib/data/*.tsx` | `textureSrc`, `bgColor`, `aspect` |
| Form / overlays UI | `messages.Overlays.*` | `Overlays.concierge.*` |
| Footer | `messages.Footer.*` | `Footer.innerFooter.*` |

### Migrazione a Sanity (quando pronto)
Per ogni pagina, si aggiorna SOLO la funzione `getXData` in `lib/data/`:
```typescript
// Attuale — usa next-intl
export const getOlioData = (t: any): OlioContent => ({
  acts: { act1: { label: t('Olio.acts.act1.label'), ... } }
});

// Con Sanity — stessa interfaccia OlioContent, fonte diversa
export const getOlioData = async (locale: string): Promise<OlioContent> => {
  const doc = await sanity.fetch(groq`*[_type == "olio"][0]`, { locale });
  return { acts: { act1: { label: doc.acts.act1.label, ... } } };
};
```
Le interfacce in `lib/content/types.ts` corrispondono direttamente ai document types di Sanity.

---

## 3. Navigazione — Transizioni di Pagina Fluide

L'obiettivo è far percepire il sito come SPA pur mantenendo il SSR di Next.js.

1. **`TransitionLink`**: intercetta click e attiva overlay di transizione GSAP
2. **`useTransitionStore`**: gestisce lo stato globale della transizione
3. **Animazione uscita** → cambio rotta sotto traccia → **animazione entrata**
4. Zero flash di pagina bianca

---

## 4. Canvas WebGL — La Finestra sul Cielo

Il `SkyNoiseShader` (via React Three Fiber) vive nel `layout.tsx` globale — non viene mai distrutto tra una pagina e l'altra.

### Pagine con cielo visibile
- **Homepage** (`/`) — cielo visibile ai bordi di ogni slide prodotto e nella sezione terroir
- **La Filiera** (`/la-filiera`) — cielo ai bordi della striscia centrale ACT 2

### Logica di apertura (sky windows)
- **HistoryTerroir**: filler tufo coprono tutto tranne strip destra (~10vw) dell'immagine
- **ProductsHorizontalWalk**: sfondo insetato 8vh top/bottom → fasce orizzontali visibili
- **LaFiliera ACT 2**: striscia centrale `left: 30vw / right: 30vw` su sfondo cream `#F3EFE7`

### Canvas attivo su rotte
`/` e `/la-filiera` (configurato in `CanvasZ0.tsx`)

---

## 5. Sezioni Homepage

| ID | Section | Componente | Dati |
|---|---|---|---|
| `#00-hero` | L'Ingresso | `HeroSection` | `messages.Home.hero` |
| `#01-storia-terroir` | La Terra Antica | `HistoryTerroir` | `messages.Home.terroir` |
| `#02-prodotti` | La Materia Viva | `ProductsHorizontalWalk` | `getProductsData(t)` |
| `#03-ospitalita` | La Casa Rossa | `Hospitality` | `messages.Home.hospitality` |
| `#04-footer` | Raggiungici | `FooterSection` | `messages.Footer.mainFooter` |

---

## 6. Pagine Inner

| Rotta | Pagina | Dati | Stato |
|---|---|---|---|
| `/storia` | La Storia della Villa | `getStoriaData(t)` | ✅ Live |
| `/la-filiera` | La Filiera / Ecosistema | `getFilieraData(t)` | ✅ Live |
| `/mucco-pisano` | Il Mucco Pisano | `getMuccoPisanoData(t)` | ✅ Live |
| `/olio` | L'Oro Liquido | `getOlioData(t)` | ✅ Live |
| `/cereali` | I Cereali | `getCerealiData(t)` | ✅ Live |
| `/ospitalita` | La Casa Rossa | `getOspitalitaData(t)` | ✅ Live |
| `/cucina-nomade` | Boutique Itinerante | `getCucinaNomadeData(t)` | ✅ Live |
| `/vino-e-caccia` | Vino & Riserva | — | 🔒 Nascosta (redirect `/`) |

---

## 7. Overlays & Form

| Componente | Stato | Gestione |
|---|---|---|
| `MainMenuOverlay` | `isMenuOpen` Zustand | `getMainMenuLinks(t)` con `Navigation.*` |
| `ConciergeForm` | `isConciergeOpen` Zustand | `messages.Overlays.concierge.*` |
| `OilExtractionOverlay` | `isOilModalOpen` Zustand | `messages.Overlays.oilExtraction.*` |
| Lightbox gallery | `isLightboxOpen` Zustand | locale in `ospitalita/page.tsx` |

---

## 8. Direzione Artistica — Palette Colori

| Variabile CSS | Valore | Utilizzo |
|---|---|---|
| `--tufo` | `#ECE8DF` | Sfondo chiaro, testi su scuro |
| `--mucco-pisano` | `#4A2E1B` | Testo principale, sfondo sezioni |
| `--olive` | `#6B7A65` | Accenti, label, decorazioni |
| `--argilla-ferrosa` | `#B05C46` | Accenti caldi, award anni |
| `--terra-nera` | `#1A1714` | Sfondi scuri, slide Mucco |
| `--sabbia-limonitica` | `#C8B47A` | Slide olio, accenti dorati |

---

## 9. Strategia di Prodotto

### Il Mucco Pisano
Narrativa: allevatore orgoglioso di una materia prima eccezionalmente rara. **Non** una onlus di salvaguardia.
- Parole chiave: naturalezza, genuinità, rarità, lenta maturazione, qualità assoluta
- Struttura pagina: Hero brado → Tagli Nobili → Essiccata → Cucina Itinerante

### La Casa Rossa
Narrativa: ritiro esclusivo, disintossicazione digitale, lusso offline.
- Parole chiave: silenzio, caminetto, stelle, privacy totale, 210mq
- Struttura pagina: Ritiro → Calore (doppio soggiorno) → 4 Stanze Cromatiche → Osservatorio Notturno

---

## 10. Roadmap

### Completato ✅
- Architettura data-driven: tutti i testi dal JSON, zero hardcoding
- `lib/content/types.ts` con interfacce TypeScript (schema Sanity)
- Funzioni `getXData(t)` per tutti i contenuti pagina
- Section labels, aria-labels, UI chrome tutti da `messages.UI.*`
- Menu localizzato via `Navigation.*`
- Sticky horizontal scroll con GSAP (Ospitalità + Homepage)
- Hero con foto parallax + vignette (Mucco Pisano, Ospitalità)
- Sky canvas visibile su `/` e `/la-filiera`
- InnerFooter testi leggibili su sfondo scuro
- Lightbox gallery + Zustand state per nascondere MenuTrigger
- Pulsanti Concierge chiari (Invia/Salta) + X sul messaggio successo
- Vino & Riserva nascosta (redirect home)

### Da fare — prossima iterazione 🔜
- **Traduzione inglese**: compilare `messages/en.json` con veri testi EN (struttura già pronta)
- **Sanity integration**: sostituire `getXData(t)` con GROQ queries (le interfacce sono già definite)
- **Cucina Nomade data-driven**: aggiungere `CucinaNomade.*` a `messages/it.json` e convertire `getCucinaNomadeData` per accettare `t`
- **Immagini reali**: sostituire placeholder con foto editoriali definitive
- **OG / Meta tags**: rendere dinamici per ogni pagina (titolo, description, immagine)
- **Analytics**: GA4 o Plausible
- **Cookie banner**: GDPR compliant
