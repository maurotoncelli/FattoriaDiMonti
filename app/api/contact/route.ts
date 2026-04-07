import { NextResponse } from 'next/server';

// ============================================================
// CONFIGURAZIONE: Sostituire con i valori reali del cliente
// ============================================================
// Per usare Google Forms:
// 1. Aprire Google Forms e cliccare "Anteprima" (icona occhio)
// 2. Ispezionare il form HTML → trovare gli attributi name="entry.XXXXXXX"
// 3. Sostituire i valori qui sotto con gli entry ID reali

const GOOGLE_FORMS_URL =
    'https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/formResponse';

const FIELD_MAP = {
    name: 'entry.000000001',     // → sostituire con entry ID reale del campo Nome
    intent: 'entry.000000002',   // → sostituire con entry ID reale del campo Intento
    contact: 'entry.000000003',  // → sostituire con entry ID reale del campo Contatto
    eventDate: 'entry.000000004', // → per Cucina Nomade
    guests: 'entry.000000005',   // → per Cucina Nomade
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Map fields to Google Forms entry IDs
        const params = new URLSearchParams();
        Object.entries(FIELD_MAP).forEach(([key, entryId]) => {
            if (body[key]) {
                params.append(entryId, body[key]);
            }
        });

        // Only submit if URL is configured (not placeholder)
        if (!GOOGLE_FORMS_URL.includes('PLACEHOLDER')) {
            await fetch(GOOGLE_FORMS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                redirect: 'manual', // Google redirects on success - we ignore it
            });
        }

        // Always return success to client (graceful error handling)
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
