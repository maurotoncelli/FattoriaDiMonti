import { redirect } from 'next/navigation';

// Pagina temporaneamente nascosta — redirect server-side locale-aware alla home
export default async function VinoRedirectPage(
    props: { params: Promise<{ locale: string }> }
) {
    const { locale } = await props.params;
    redirect(locale === 'it' ? '/' : `/${locale}`);
}
