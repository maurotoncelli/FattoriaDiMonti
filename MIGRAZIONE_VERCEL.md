# Migrazione Netlify → Vercel (Fattoria di Monti)

**Data prep:** 30 luglio 2026  
**Team Vercel:** `atstudio`  
**Repo:** `maurotoncelli/FattoriaDiMonti`

## Scelte

- Hosting: Vercel (Next.js nativo), team già in uso — niente costi extra Hobby/team attuale
- Dominio custom: **non ancora acquistato** — si usa `*.vercel.app` finché il cliente non sceglie/compra il dominio
- Deploy automatici: push su `main` → production

## File preparati

- `vercel.json` — headers/cache (ex `netlify.toml`)
- Rimosso `@netlify/plugin-nextjs` (non serve su Vercel)
- `lib/site.ts` — `BASE_URL` da `NEXT_PUBLIC_SITE_URL` (fallback dominio previsto)
- `netlify.toml` lasciato come riferimento legacy; si può cancellare dopo go-live Vercel

## Env su Vercel (Project → Settings → Environment Variables)

| Variabile | Note |
|-----------|------|
| `NEXT_PUBLIC_SITE_URL` | Dopo il primo deploy: URL produzione Vercel (senza slash). Quando arriva il dominio custom, aggiornare qui. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Opzionale, quando GA è pronto |
| `NEXT_PUBLIC_GA_FORCE_DEV` | Lasciare unset / `false` in prod |

## Dominio (più avanti)

1. Acquisto dominio (registrar o Vercel Domains)
2. Aggiungere dominio al progetto Vercel
3. Aggiornare `NEXT_PUBLIC_SITE_URL` e ridistribuire
