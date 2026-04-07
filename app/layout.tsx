import { ReactNode } from 'react';

// Since we use a root `not-found.tsx` page to handle missing locales,
// a root layout file is required by Next.js, even if it merely passes children through.
// The actual <html> and <body> tags are inside app/[locale]/layout.tsx to support dynamic lang tags.
export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
