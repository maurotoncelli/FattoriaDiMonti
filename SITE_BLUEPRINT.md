# Fattoria di Monti — Site Blueprint for AI Agents

Last updated: April 2026

This is the authoritative working blueprint for the current website. Any AI agent working on this repo must read this file before changing architecture, content, animations, navigation, data models, or performance behavior.

If this file conflicts with older notes in `STRATEGY.md` or `documenti di riferimento/`, this file wins. Reference documents are useful for tone and source material, but this file describes the live product architecture.

---

## 1. Product Intent

Fattoria di Monti is a premium editorial and commerce-oriented site for a Tuscan estate near Volterra.

The experience should feel:

- refined, cinematic, tactile, and slow-luxury;
- fast enough to feel fluid, never blocked by decorative effects;
- content-rich but not dispersed;
- data-driven and ready for a future CMS such as Sanity;
- suitable for high-end hospitality, olive oil, Mucco Pisano, and private food experiences.

Current strategic simplification:

- `Storia` is the central narrative page and absorbs the former `La Filiera` / cereals ecosystem content.
- `Cereali` and `La Filiera` are no longer promoted as standalone experiences.
- The home product walk now focuses on Mucco Pisano, Cucina Nomade, and Olio.
- `/cereali` and `/la-filiera` redirect to `/storia`.

---

## 2. Stack

- Framework: Next.js 14 App Router
- React: 18
- Styling: Tailwind CSS plus CSS variables in `app/[locale]/globals.css`
- i18n: `next-intl`
- Locales: `it`, `en`
- Animations: GSAP + ScrollTrigger
- Smooth scroll: Lenis
- WebGL: React Three Fiber, Drei, Three
- State: Zustand in `store/useAppStore.ts`
- Deployment target: Netlify
- Analytics: consent-aware GA component, not always active

Important scripts:

- `npm run dev`
- `npm run build`
- `npm run lint` may prompt for ESLint config in this repo; do not assume it is usable non-interactively.

---

## 3. Core Architecture

### App Shell

- Root route layout: `app/layout.tsx`
- Locale layout: `app/[locale]/layout.tsx`
- Site constants: `lib/site.ts`
- App-level client shell: `components/AppWrapper.tsx`

`AppWrapper` owns global client systems:

- `useLenis()`
- hash scroll
- easter egg
- WebGL background canvas
- global UI
- overlays
- transition overlay
- home preloader

### Home Route

File: `app/[locale]/page.tsx`

Order:

1. `HeroSection`
2. `HistoryTerroir`
3. `ProductsHorizontalWalk`
4. `Hospitality`
5. `FooterSection`

Home sections are client components. Keep them scoped, but content must still come from `messages/*` and `lib/data/*`.

### Inner Routes

Live promoted routes:

- `/storia`: history plus ecosystem/filiera narrative and gallery
- `/mucco-pisano`: Mucco Pisano content
- `/olio`: oil product storytelling and product showcase
- `/ospitalita`: La Casa Rossa
- `/cucina-nomade`: itinerant kitchen

Compatibility redirects:

- `/la-filiera` redirects to `/storia`
- `/cereali` redirects to `/storia`
- `/vino-e-caccia` is hidden and redirects away

Do not re-add `Cereali` or `La Filiera` to the menu or sitemap unless the product strategy changes explicitly.

---

## 4. Data And Content Rules

### Golden Rule

No visible text hardcoded in page/component JSX unless it is non-user-facing developer scaffolding or a temporary technical label that is not rendered to users.

Use:

- `messages/it.json`
- `messages/en.json`
- data constructors in `lib/data/*.tsx`
- interfaces in `lib/content/types.ts`

Pattern:

```tsx
const t = useTranslations();
const pageData = getXData(t);
```

Then render from `pageData`.

### Translation Requirements

Every new user-facing string must be added to both `messages/it.json` and `messages/en.json`.

Never update only Italian.
Never leave English with missing keys.
If English copy is not finalized, create a faithful placeholder translation with the same structure.

### Data Contracts

`lib/content/types.ts` is the contract. When adding content:

1. add or update the TypeScript interface;
2. update `messages/it.json`;
3. update `messages/en.json`;
4. update the corresponding `lib/data/*.tsx`;
5. render from the data object.

Do not bypass the data layer to move faster.

---

## 5. Navigation And Information Architecture

Main menu data is in `lib/data/menu.ts`.

Current menu intent:

1. Home
2. Storia
3. Carne di Mucco Pisano
4. Boutique Itinerante
5. Olio Extravergine
6. Accoglienza
7. Contatti

Rules:

- Keep menu compact.
- Do not create extra nav entries for subtopics that can live inside `Storia`.
- Keep sitemap aligned with promoted routes only.
- Use redirects for old routes rather than broken links.
- Use `TransitionLink` for internal navigation that should participate in page transitions.

---

## 6. Page-Specific Notes

### Home

`ProductsHorizontalWalk` is a pinned horizontal product walk on desktop.

Current slides come from `lib/data/products.tsx`:

- Mucco Pisano
- Cucina Nomade
- Olio

Do not reintroduce `slide-cereali`.

If adding/removing slides, verify desktop pinned distance and mobile vertical rendering.

### Storia

`app/[locale]/storia/page.tsx` now combines:

- villa/history narrative from `getStoriaData(t)`;
- ecosystem/rotation/gallery from `getFilieraData(t)`.

This page should remain named and promoted as `Storia`, not `Filiera`.

If improving this page:

- preserve the editorial tone;
- keep the filiera content subordinate to the story;
- use image galleries or compact editorial blocks rather than new standalone routes;
- keep `getFilieraData(t)` reusable unless a cleaner combined data model is intentionally introduced.

### Olio

`/olio` is a premium product/story page.

It includes:

- dark hero;
- three oil bottles with different label colors;
- selected product sheet;
- CTA using the existing oil modal via `setOilModalOpen(true)`;
- compact extraction-method grid;
- awards and final CTA.

Rules:

- Do not add a fake cart unless requested.
- Product ordering will later connect to Google Sheets / Google Forms through API plumbing.
- Product bottle data lives in `messages.*.Olio.bottles`, typed by `OlioContent`.
- PNG bottle images can replace CSS placeholders later via the existing `image` fields.

### Ospitalita

La Casa Rossa is a major conversion page/section.

Keep copy readable, high-contrast, and direct. Avoid hiding critical booking content behind slow reveals.

### Cucina Nomade

Menu and panino content are data-driven. Keep accordion/details behavior accessible.

---

## 7. Animation And Performance Rules

Animations must support content, not block it.

Hard rules:

- Do not hide primary text behind multi-second preloaders.
- Do not make content readability depend on animation completion.
- Do not create 60fps React state updates.
- Do not put scroll position, velocity, or per-frame values in Zustand or React state.
- Do not run broad `ScrollTrigger.getAll().forEach(kill)` from a component cleanup; kill only triggers created by that component.
- Respect `prefers-reduced-motion`.
- Keep low-end/mobile fallbacks lightweight.

Current performance design:

- `hooks/useLenis.ts` owns Lenis and the Lenis/ScrollTrigger bridge.
- `lib/scrollStore.ts` holds high-frequency scroll values outside React.
- `hooks/usePerformance.ts` detects low performance and reduced motion.
- `CanvasZ0` uses CSS fallback for low tier or reduced motion.
- `WebGLImageEngine` should not become an excuse for heavy per-frame DOM work.

When editing scroll or animation:

1. scope GSAP selectors with `gsap.context`;
2. clean up only what you create;
3. call `ScrollTrigger.refresh()` only in controlled places;
4. test desktop and mobile;
5. keep initial text readable.

---

## 8. WebGL Rules

Global canvas: `components/canvas/CanvasZ0.tsx`

Current visible sky routes:

- `/`
- `/storia`

Do not add WebGL to every page by default.

Fallback requirements:

- low performance device: CSS fallback;
- reduced motion: CSS fallback;
- canvas toggle off: CSS fallback.

WebGL image placeholders use DOM elements with `data-webgl-media`, `data-texture-src`, and `data-effect-type`.

Do not replace content images with WebGL-only output if it harms accessibility or layout stability. The DOM must still define the semantic surface.

---

## 9. State Management Rules

Zustand is only for rare UI/application state:

- menu open
- oil modal open
- concierge open
- transition state
- preloader complete
- canvas toggle
- audio toggle
- easter egg

Use granular selectors:

```tsx
const isMenuOpen = useAppStore((s) => s.isMenuOpen);
```

Avoid:

```tsx
const { isMenuOpen } = useAppStore();
```

Do not add rapidly changing values to Zustand.

---

## 10. SEO And Routing Rules

- `BASE_URL` lives in `lib/site.ts`, not in a Next layout export.
- Promoted routes must be listed in `app/sitemap.ts`.
- Redirect-only legacy routes should not be listed in the sitemap.
- Metadata copy lives in `messages.Metadata.pages.*`.
- Add or update layout metadata when adding a promoted route.
- Keep `i18n/routing.ts` limited to locales that actually have message files.

Current locales:

- `it`
- `en`

Do not add `fr`, `de`, `es` unless corresponding `messages/*.json`, metadata, sitemap, and routing behavior are complete.

---

## 11. Forms And Orders

Current API:

- `app/api/contact/route.ts`

It is prepared for Google Forms-style field mapping. Future order flows may connect to Google Sheets or Google Forms.

Rules:

- Do not hardcode production Google IDs in random components.
- Keep form field labels and success messages in `messages/*`.
- Keep API field mapping centralized.
- If adding order functionality, create a clear data shape and avoid fake e-commerce state unless requested.

---

## 12. Visual Design Rules

Tone:

- premium agricultural estate;
- tactile natural materials;
- dark olive/earth/tufo palette;
- high contrast for readability;
- editorial spacing, not crowded SaaS UI.

Do:

- use existing CSS variables;
- use Playfair for poetic display moments;
- use Inter for labels, facts, and UI;
- keep CTAs elegant, clear, and consistent;
- make product sections feel luxury commerce, not generic cards.

Avoid:

- cheap card grids with random translucent boxes;
- low-contrast brown text on dark backgrounds;
- overly long scroll tunnels;
- adding new decorative animations without reducing something else;
- visual changes that scatter information architecture.

---

## 13. Anti-Patterns Other AI Agents Must Avoid

These are explicitly forbidden unless the project owner asks for a throwaway prototype:

1. Hardcoding visible copy directly in components.
2. Updating only `messages/it.json` and forgetting `messages/en.json`.
3. Adding a new route for every idea.
4. Reintroducing standalone `Cereali` or `La Filiera` navigation.
5. Adding `scrollY` or animation frame values to React/Zustand state.
6. Killing all ScrollTriggers from one component cleanup.
7. Making the preloader longer or blocking hero text behind it.
8. Adding WebGL to pages without fallback or performance tiering.
9. Editing layout exports with arbitrary constants; use `lib/site.ts` or other libs.
10. Shipping an aesthetic-only patch that breaks build, routing, i18n, or accessibility.
11. Leaving stale links in sitemap/menu/footer.
12. Adding new dependencies for simple UI work without checking existing patterns first.

---

## 14. Required Workflow For AI Changes

Before editing:

1. Read this file.
2. Read the files you will touch.
3. Check existing data-layer and i18n patterns.
4. Prefer small, coherent changes over patch piles.

During editing:

1. Keep content in `messages` + `lib/data`.
2. Keep interfaces in `lib/content/types.ts` current.
3. Keep animations scoped and reversible.
4. Preserve user changes and dirty working tree content.

After editing:

1. Run `ReadLints` or equivalent diagnostics for touched files.
2. Run `npm run build` when changing routes, i18n, types, or shared components.
3. If `next build` ran while `next dev` is active, clear `.next` and restart dev to avoid stale vendor chunk errors.
4. Verify important local routes by HTTP when possible.

---

## 15. Current Critical Files

- `app/[locale]/page.tsx`: home route
- `app/[locale]/layout.tsx`: locale shell, metadata, providers
- `components/AppWrapper.tsx`: global client systems
- `components/dom/ProductsHorizontalWalk.tsx`: home product scroll
- `components/dom/HistoryTerroir.tsx`: home story/terroir
- `app/[locale]/storia/page.tsx`: story plus absorbed filiera content
- `app/[locale]/olio/page.tsx`: oil story/product page
- `components/canvas/CanvasZ0.tsx`: global WebGL/CSS fallback
- `hooks/useLenis.ts`: smooth scroll and ScrollTrigger bridge
- `hooks/usePerformance.ts`: low tier/reduced motion
- `store/useAppStore.ts`: rare UI state
- `lib/content/types.ts`: content contracts
- `lib/data/*.tsx`: data constructors
- `messages/it.json`, `messages/en.json`: localized content
- `lib/data/menu.ts`: main menu
- `app/sitemap.ts`: promoted routes only
- `lib/site.ts`: site constants

---

## 16. When In Doubt

Prefer:

- fewer routes;
- richer existing pages;
- data-driven content;
- readable text;
- faster first paint;
- scoped animation;
- clear conversion CTAs.

Do not solve architectural uncertainty with another patch. Stop, inspect the current flow, and update the blueprint if the product decision truly changes.
