'use client';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>Not Found</title>
      </head>
      <body>
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
          <h1>404 - Page Not Found</h1>
          <a href="/" style={{ color: 'inherit', textDecoration: 'underline' }}>Return to homepage</a>
        </div>
      </body>
    </html>
  );
}
