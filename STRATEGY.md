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
| Analytics | `@next/third-parties/google` (GA4, GDPR-aware) |
| Deployment | Netlify + `@netlify/plugin-nextjs` |
| Repo | GitHub (`maurotoncelli/FattoriaDiMonti`) |
| Contenuto attuale | `messages/it.json` + `messages/en.json` |
| Contenuto futuro | Sanity CMS (GROQ) |

---

## 2. Architettura Data-Driven

### Principio fondamentale
**Zero hardcoding** di stringhe visibili nel DOM. Ogni testo, label, aria-label o dato strutturato viene estratto da una sorgente centralizzata.

### Layer di contenuto

```
messages/
├── it.json     ← fonte italiana di verità (UI chrome + contenuto pagine + SEO metadata)
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
    └── cucinaNomade.tsx ← getCucinaNomadeData(t)
```

### Pattern nelle pagine (client component)
```tsx
const t = useTranslations();
const pageData = getXData(t);
// usa pageData.field per tutto il contenuto
```

### Separazione UI chrome vs. contenuto pagina
| Tipo | Dove vive | Esempio |
|---|---|---|
| Label pulsanti, aria-labels | `messages.UI.*` | `UI.backButton`, `UI.audio` |
| Testi navigazione menu | `messages.Navigation.*` | `Navigation.olio.label` |
| Contenuto pagine | `messages.[Pagina].*` | `Olio.acts.act1.label` |
| SEO metadata (title/description) | `messages.Metadata.pages.*` | `Metadata.pages.home.title` |
| Config media (src, colori, webgl) | `lib/data/*.tsx` | `textureSrc`, `bgColor` |
| Form / overlays | `messages.Overlays.*` | `Overlays.concierge.*` |
| Footer | `messages.Footer.*` | `Footer.innerFooter.*` |

### Migrazione a Sanity (quando pronto)
Si aggiorna SOLO la funzione `getXData` in `lib/data/` — le interfacce in `lib/content/types.ts` corrispondono già ai document types di Sanity.

---

## 3. Performance — Regole Architetturali

### Principio: separare stato React da stato ad alta frequenza

**Regola d'oro**: qualsiasi valore che cambia > 10 volte al secondo NON va in Zustand/React state.

#### `scrollStore` — `lib/scrollStore.ts`
Oggetto plain (non React) aggiornato da Lenis ogni frame (~60fps):
```ts
export const scrollStore = { y: 0, velocity: 0 };
```
- **Aggiornato da**: `hooks/useLenis.ts` nel RAF loop, senza `setState`
- **Letto da**: `SkyNoiseShader` (in `useFrame`), `ScrollProgressTracker` (via Lenis event), `AppWrapper` (via Lenis event)
- **MAI** leggere `scrollStore` in un `useEffect` con deps — usarlo solo in loop imperativi (RAF, useFrame, event callbacks)

#### Zustand `useAppStore` — solo stato booleano/modale
Contiene esclusivamente stati che cambiano raramente (click, transizioni):
```
isMenuOpen | isOilModalOpen | isConciergeOpen | isLightboxOpen
isTransitioning | nextRoute | transitionBgColor | transitionKeyword
isPreloaderComplete | easterEggTriggered | audioEnabled | currentSection
```
**NO** `scrollY`, `scrollVelocity` — rimossi, causavano 60 re-render/secondo.

#### Regola sui selettori Zustand
Ogni componente che legge dallo store deve usare selettori granulari:
```tsx
// ✅ Corretto — re-render solo quando cambia isMenuOpen
const isMenuOpen = useAppStore((s) => s.isMenuOpen);

// ❌ Sbagliato — re-render ad ogni cambio di qualsiasi stato
const { isMenuOpen } = useAppStore();
```

#### Lenis — best practices
- Un'istanza globale, inizializzata in `useLenis()` da `AppWrapper`
- Esposta su `window.__lenis` per accesso imperativo
- Loop RAF con `cancelAnimationFrame` nel cleanup per evitare leak
- Per ascoltare lo scroll: `lenis.on('scroll', cb)` + `lenis.off('scroll', cb)` nel cleanup
- Per aggiornare DOM senza re-render: usare `ref.current.style.xxx = ...` nel callback

#### SkyNoiseShader — Three.js performance
- Legge `scrollStore.y` e `scrollStore.velocity` direttamente in `useFrame` (nessun React)
- Le dimensioni del documento (`scrollHeight`, `innerHeight`) sono cached in un ref aggiornato da `ResizeObserver`, non lette ogni frame
- Il shader stesso gira sulla GPU — il costo è minimo; il bottleneck era il bridge React, ora eliminato

---

## 4. Navigazione — Transizioni di Pagina

### Architettura
1. **`TransitionLink`** (`components/ui/TransitionLink.tsx`): intercetta click, chiama `startPageTransition()`, naviga a **900ms** (quando il sipario copre il 97% dello schermo con `power4.inOut`)
2. **`GlobalTransitionOverlay`** (`components/overlays/GlobalTransitionOverlay.tsx`): sipario GSAP con `hasCovered` ref per prevenire lift spurii
3. **`useAppStore`** (Zustand): stato `isTransitioning`, `transitionBgColor`, `transitionKeyword`

### Flusso corretto (post-fix Aprile 2026)
```
click TransitionLink
  → startPageTransition() → isTransitioning = true
  → sipario scende (1.2s, power4.inOut)
  → a 900ms: router.push() → nuova pagina monta DIETRO il sipario coperto
  → a 1200ms: hasCovered = true → endPageTransition() → isTransitioning = false
  → sipario si alza (1.2s) → rivela nuova pagina già pronta
```

### Keyword di transizione
Ogni `TransitionLink` accetta `transitionKeyword` opzionale (es. "OLIO", "STORIA") mostrata al centro del sipario durante la chiusura.

---

## 5. SEO & Metadati

### Metadata per pagina
- **Root layout** (`app/[locale]/layout.tsx`): `generateMetadata` con `metadataBase`, template title, `alternates` (canonical + hreflang `it`/`en`/`x-default`), Open Graph, Twitter card
- **Ogni sub-route** ha il proprio `layout.tsx` server component che esporta `generateMetadata` con title/description specifici, canonical URL, e OG image
- **Testi SEO**: `messages.Metadata.pages.[pagina].title` + `.description`

### Structured Data
- `app/[locale]/page.tsx` (homepage): JSON-LD `AgriTourismBusiness` via `<Script type="application/ld+json">`

### File tecnici
- `app/sitemap.ts` — sitemap XML con tutte le rotte `it`/`en`, `lastModified`, `changeFrequency`, `priority`, `alternates` hreflang
- `app/robots.ts` — `allow: /`, `disallow: ['/api/', '/_next/']`, link sitemap
- `next.config.js` → `async headers()` — security headers per dev/hosting non-Netlify

### Heading hierarchy verificata
- Tutti i `<h1>` precedono i `<h2>` in ogni pagina
- `HeroNomade`: small title convertito da `<h2>` a `<p>` (era prima dell'`<h1>`)
- Immagini decorative con `aria-hidden="true" role="presentation"`

---

## 6. Analytics — Google Analytics 4 (GDPR-aware)

### Componente
`components/analytics/GoogleAnalytics.tsx` — client component con doppia guardia:
1. `NEXT_PUBLIC_GA_MEASUREMENT_ID` deve essere settato
2. Cookie `fdm_analytics_consent === 'granted'` (oppure `NEXT_PUBLIC_GA_FORCE_DEV=true` per test locali)

### Helper pubblici
```typescript
import { grantAnalyticsConsent, revokeAnalyticsConsent } from '@/components/analytics/GoogleAnalytics';
```
Da chiamare nel futuro cookie banner per attivare/disattivare il tracking.

### Event listener
Il componente ascolta l'evento custom `fdm:analytics-consent-updated` — il cookie banner dovrà solo emettere questo evento dopo aver settato/rimosso il cookie.

### Variabili d'ambiente
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # ID GA4 (da settare su Netlify)
NEXT_PUBLIC_GA_FORCE_DEV=true                 # Solo per test locali — non committare
```

---

## 7. Canvas WebGL — La Finestra sul Cielo

Il `SkyNoiseShader` (via React Three Fiber) vive nel layout globale — non viene mai distrutto tra navigazioni.

### Pagine con cielo visibile
- **Homepage** (`/`) — ai bordi di ogni slide prodotto e nella sezione terroir
- **La Filiera** (`/la-filiera`) — ai bordi della striscia centrale ACT 2

### Logica di apertura (sky windows)
- **HistoryTerroir**: filler tufo tranne strip destra (~10vw) dell'immagine
- **ProductsHorizontalWalk**: sfondo insetato 8vh top/bottom → fasce orizzontali visibili
- **LaFiliera ACT 2**: striscia centrale `left: 30vw / right: 30vw` su sfondo cream

### Canvas attivo su rotte
`/` e `/la-filiera` (configurato in `CanvasZ0.tsx`)

---

## 8. Sezioni Homepage

| ID | Section | Componente | Dati |
|---|---|---|---|
| `#00-hero` | L'Ingresso | `HeroSection` | `messages.Home.hero` |
| `#01-storia-terroir` | La Terra Antica | `HistoryTerroir` | `messages.Home.terroir` |
| `#02-prodotti` | La Materia Viva | `ProductsHorizontalWalk` | `getProductsData(t)` |
| `#03-ospitalita` | La Casa Rossa | `Hospitality` | `messages.Home.hospitality` |
| `#04-footer` | Raggiungici | `FooterSection` | `messages.Footer.mainFooter` |

---

## 9. Pagine Inner

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

## 10. Cucina Nomade — Menu con Accordion

### Struttura dati (`lib/data/cucinaNomade.tsx`)
Ogni item del `menuGallery` ha un campo opzionale `details?: string[]` con ingredienti/approfondimenti.

### Componente accordion (`components/dom/MenuMansonry.tsx`)
- `MasonryItem`: wrapper per ogni panino
- `DetailsAccordion`: accordion GSAP con animazione altezza + rotazione freccia
- Visibile solo se `item.details` esiste e il tipo è `text` o `mixed`
- Tasto con `aria-expanded` per accessibilità

---

## 11. Overlays & Form

| Componente | Stato | Gestione |
|---|---|---|
| `MainMenuOverlay` | `isMenuOpen` Zustand | `getMainMenuLinks(t)` — layout mobile/desktop condizionale |
| `ConciergeForm` | `isConciergeOpen` Zustand | `messages.Overlays.concierge.*` |
| `OilExtractionOverlay` | `isOilModalOpen` Zustand | `messages.Overlays.oilExtraction.*` |
| Lightbox gallery | `isLightboxOpen` Zustand | locale in `ospitalita/page.tsx` |
| `GlobalTransitionOverlay` | `isTransitioning` Zustand | sipario GSAP con `hasCovered` ref |

---

## 11. Mobile — Responsive Strategy

### Approccio
Mobile-first per layout; desktop rimane invariato. Responsive CSS tramite Tailwind breakpoints + CSS custom properties per safe area.

### Utility globali (`app/[locale]/globals.css`)
- `.pt-safe` / `.pb-safe` — `env(safe-area-inset-top/bottom)` per notch/home indicator
- `.touch-target` — min 48×48px per touch targets accessibili
- Media query `(hover: none) and (pointer: coarse)` — reset cursor custom su touch device
- `.concierge-step-label` — nascosto su `max-width: 479px`
- Fluid typography con `clamp()` su `h1`, `h2`, `p` per `max-width: 767px`

### Hook
`lib/hooks/useIsMobile.ts` — `useIsMobile(breakpoint?)` con `window.matchMedia` per conditional rendering JS

### Componenti con layout mobile alternativo
| Componente | Strategia mobile |
|---|---|
| `MainMenuOverlay` | Layout column, nessun panel editoriale, link full-width con animazione `slideUpItem` |
| `ProductsHorizontalWalk` | `ProductCardMobile` vertical stack invece di horizontal scroll |
| `Ospitalità gallery` | Grid 2 colonne `aspect-ratio: 3/4` invece di sticky horizontal scroll |
| `HistoryTerroir` | `grid-cols-1 lg:grid-cols-[3fr_4fr]`, order Tailwind per stacking corretto |
| `Hospitality` | Stats 2×2 su mobile, columns stacked, CTA verticali |
| `FooterSection` | `grid-cols-1 md:grid-cols-2` |
| `ConciergeForm` | `maxWidth: min(92vw, 680px)`, safe area buttons |
| `La Filiera ACT 3` | Pin GSAP orizzontale solo su `min-width: 1024px` via `gsap.matchMedia` |

---

## 12. Deployment — Netlify + GitHub

### Repo
`https://github.com/maurotoncelli/FattoriaDiMonti.git`

### netlify.toml
- `command = "npm run build"`, `publish = ".next"`
- Plugin `@netlify/plugin-nextjs` per compatibilità App Router
- Security headers globali (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- Cache aggressiva per `/_next/static/*` e `/images/*`
- **Nessun redirect locale** — gestito interamente da `next-intl` middleware (rimozione redirect `/it/*` ha risolto il loop infinito)

### Variabili d'ambiente da settare su Netlify
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://fattoriadimonti.it
```

### File di configurazione
- `netlify.toml` — build + plugin + headers
- `.env.example` — template con tutte le variabili necessarie
- `.gitignore` — esclude `.env*.local`, `.next/`, `node_modules/`

---

## 13. Direzione Artistica — Palette Colori

| Variabile CSS | Valore | Utilizzo |
|---|---|---|
| `--tufo` | `#ECE8DF` | Sfondo chiaro, testi su scuro |
| `--mucco-pisano` | `#4A2E1B` | Testo principale, sfondo sezioni |
| `--olive` | `#6B7A65` | Accenti, label, decorazioni |
| `--argilla-ferrosa` | `#B05C46` | Accenti caldi, award anni |
| `--terra-nera` | `#1A1714` | Sfondi scuri, slide Mucco |
| `--sabbia-limonitica` | `#C8B47A` | Slide olio, accenti dorati |

---

## 14. Roadmap

### Completato ✅
- Architettura data-driven: tutti i testi dal JSON, zero hardcoding
- `lib/content/types.ts` con interfacce TypeScript (schema Sanity)
- Funzioni `getXData(t)` per tutti i contenuti pagina
- Section labels, aria-labels, UI chrome da `messages.UI.*`
- Menu localizzato via `Navigation.*`
- Sticky horizontal scroll con GSAP (Ospitalità + Homepage)
- Hero con foto parallax + vignette (Mucco Pisano, Ospitalità)
- Sky canvas visibile su `/` e `/la-filiera`
- Lightbox gallery + Zustand state per nascondere MenuTrigger
- Pulsanti Concierge chiari (Invia/Salta) + X sul messaggio successo
- Vino & Riserva nascosta (redirect home)
- **SEO completo**: metadata per ogni pagina, hreflang, OG, Twitter card, JSON-LD, sitemap.ts, robots.ts
- **GA4 predisposizione**: componente GDPR-aware, guard cookie consent, helper grant/revoke
- **Mobile restyling**: menu overlay, products, ospitalità gallery, footer, hospitality, filiera
- **Safe area insets**: notch/home indicator su tutti i controlli fissi
- **Accordion ingredienti** Cucina Nomade: expand/collapse GSAP per ogni panino
- **Transizioni pagina corrette**: overlay naviga da solo in GSAP `onComplete` (zero race condition), z-index alzato a 500, `MainMenuOverlay` usa `startPageTransition`
- **Performance scroll**: rimossi `scrollY`/`scrollVelocity` da Zustand → `lib/scrollStore.ts` (plain ref, zero re-render); `useLenis` scrive su ref + `cancelAnimationFrame` nel cleanup; `ScrollProgressTracker` aggiornamento DOM imperativo via Lenis event; `SkyNoiseShader` legge `scrollStore` direttamente in `useFrame` + cache dimensioni DOM via `ResizeObserver`; tutti i componenti critici usano selettori granulari Zustand
- **Netlify deployment**: `netlify.toml`, plugin nextjs, security headers, fix redirect loop
- **GitHub**: repo inizializzato, push, CI/CD automatico via Netlify

### Da fare — prossima iterazione 🔜
- **Traduzione inglese**: compilare `messages/en.json` con veri testi EN (struttura già pronta)
- **Cookie banner GDPR**: UI banner → chiama `grantAnalyticsConsent()` / `revokeAnalyticsConsent()`
- **Dominio custom**: collegare `fattoriadimonti.it` su Netlify + abilitare redirect www → apex in `netlify.toml`
- **Immagini reali**: sostituire placeholder con foto editoriali definitive
- **Sanity integration**: sostituire `getXData(t)` con GROQ queries (le interfacce sono già definite)
- **Email transazionale**: Resend per form Concierge (variabile `RESEND_API_KEY` già in `.env.example`)
