import { notFound } from 'next/navigation';

// Catch-all: qualsiasi route sconosciuta dentro una locale valida
// viene gestita da app/[locale]/not-found.tsx (i18n-aware).
export default function CatchAllNotFound() {
    notFound();
}
