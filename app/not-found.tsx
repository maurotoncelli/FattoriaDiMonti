// Fallback di ultima istanza per path fuori dal routing i18n
// (i 404 dentro le locale sono gestiti da app/[locale]/not-found.tsx).
export default function RootNotFound() {
    return (
        <html lang="it">
            <head>
                <title>404 — Fattoria di Monti</title>
            </head>
            <body>
                <div style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 2rem', textAlign: 'center' }}>
                    <h1 style={{ fontWeight: 400 }}>404</h1>
                    <p>Pagina non trovata — Page not found</p>
                    <a href="/" style={{ color: 'inherit', textDecoration: 'underline' }}>
                        Fattoria di Monti
                    </a>
                </div>
            </body>
        </html>
    );
}
