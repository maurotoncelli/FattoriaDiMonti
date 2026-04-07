export type PanelType = 'STORY' | 'PROCESS' | 'STATS' | 'CONTACT';

export interface NavLink {
    id: string;
    index: string;
    label: string;
    href?: string;
    action?: string;
    actionTarget?: string;
    image: string | null;
    panelData: {
        type: PanelType;
        title?: string;
        quote?: string;
        stats?: { label: string; text?: string; value: string }[];
        text?: string;
    };
}

/**
 * getMainMenuLinks — locale-aware via next-intl.
 * Pass t from useTranslations('Navigation') for full i18n support.
 * When Sanity is integrated, swap the t() calls for GROQ field reads.
 */
export const getMainMenuLinks = (t?: any): NavLink[] => {
    const s = (key: string, fallback: string) => (t ? t(key) : fallback);
    const raw = (key: string, fallback: any) => (t ? (t.raw ? t.raw(key) : t(key)) : fallback);

    return [
        {
            id: 'nav-home', index: '00', label: s('home.label', 'Home'), href: '/', image: '/images/hero-drone.png',
            panelData: {
                type: 'STATS',
                title: s('home.panelTitle', 'Fattoria di Monti'),
                stats: raw('home.stats', [
                    { label: 'Coordinate', value: "43° 24' N  10° 51' E" },
                    { label: 'Altitudine', value: '450m s.l.m.' },
                    { label: 'Estensione', value: '10 Ettari' },
                ]),
                text: s('home.text', "Riconnettiti con l'essenza della terra in un luogo dove il tempo è dettato dalla ritmica della natura."),
            },
        },
        {
            id: 'nav-storia', index: '01', label: s('storia.label', 'Storia'), href: '/storia', image: '/images/villa-buontalenti.png',
            panelData: {
                type: 'STORY',
                title: s('storia.panelTitle', '1839'),
                text: s('storia.text', 'Fondata sulle aspre e antiche colline etrusche di Volterra, la fattoria tramanda da secoli il rispetto quasi religioso per una terra dura ma incredibilmente generosa.'),
            },
        },
        {
            id: 'nav-filiera', index: '02', label: s('filiera.label', 'La filiera'), href: '/la-filiera', image: '/images/campi-grano-16-9.png',
            panelData: {
                type: 'PROCESS',
                title: s('filiera.panelTitle', 'Ciclo Naturale'),
                stats: raw('filiera.stats', [
                    { label: '01. Radici', value: 'Sementi Antiche Locali' },
                    { label: '02. Ritmo', value: 'Crescita Naturale Lenta' },
                    { label: '03. Manodopera', value: 'Raccolto 100% Manuale' },
                    { label: '04. Origine', value: 'Trasformazione in Loco' },
                ]),
            },
        },
        {
            id: 'nav-mucco', index: '03', label: s('mucco.label', 'Carne di Mucco Pisano'), href: '/mucco-pisano', image: '/images/mucco-pisano.png',
            panelData: {
                type: 'STATS',
                title: s('mucco.panelTitle', 'Mucco Pisano'),
                stats: raw('mucco.stats', [
                    { label: 'Specie', value: 'Razza Antica Autoctona' },
                    { label: 'Allevamento', value: 'Stato Brado (Pascolo)' },
                    { label: 'Alimentazione', value: 'Cereali Naturali Propri' },
                    { label: 'Frollatura', value: 'Lenta (Mese+)' },
                ]),
                text: s('mucco.text', "Una proteina pura, scolpita dal pascolo all'aperto nelle valli dell'Era."),
            },
        },
        {
            id: 'nav-boutique', index: '04', label: s('boutique.label', 'Boutique Itinerante'), href: '/cucina-nomade', image: '/images/cucina-nomade-16-9.png',
            panelData: {
                type: 'CONTACT',
                title: s('boutique.panelTitle', 'Cucina Nomade'),
                stats: raw('boutique.stats', [
                    { label: 'Disponibilità', value: 'Stagione Estiva' },
                    { label: 'Location', value: 'Ovunque' },
                    { label: 'Coperti', value: 'Private Dining (Max 30)' },
                ]),
                text: s('boutique.text', 'Eventi esclusivi e degustazioni private orchestrate direttamente nel cuore della fattoria viscerale o dove desideri.'),
            },
        },
        // nav-vino temporaneamente nascosto
        {
            id: 'nav-olio', index: '06', label: s('olio.label', 'Olio Extravergine'), href: '/olio', image: '/images/olio-extravergine.png',
            panelData: {
                type: 'STATS',
                title: s('olio.panelTitle', 'Olio EVO Biologico'),
                stats: raw('olio.stats', [
                    { label: 'Cultivar', value: 'Frantoio, Moraiolo, Leccino' },
                    { label: 'Estrazione', value: 'Meccanica Fredda (<27°C)' },
                    { label: 'Acidità', value: '0.15% (Purissimo)' },
                    { label: 'Filtraggio', value: 'Grezzo Naturale' },
                ]),
            },
        },
        {
            id: 'nav-accoglienza', index: '07', label: s('accoglienza.label', 'Accoglienza'), href: '/ospitalita', image: '/images/casa-rossa-interni.png',
            panelData: {
                type: 'STORY',
                title: s('accoglienza.panelTitle', 'La Casa Rossa'),
                text: s('accoglienza.text', 'Un ritiro materico assoluto dove il silenzio assordante delle colline aperte incontra il lusso discreto della pietra nuda e del legno recuperato, sospeso fuori dal tempo.'),
            },
        },
        {
            id: 'nav-contatti', index: '08', label: s('contatti.label', 'Contatti'), href: '/#04-footer', image: '/images/hero-drone.png',
            panelData: {
                type: 'CONTACT',
                title: s('contatti.panelTitle', 'Coordinate'),
                stats: raw('contatti.stats', [
                    { label: 'Sede', value: 'Piazza Martiri, Volterra' },
                    { label: 'Email', value: 'info@fattoriadimonti.it' },
                    { label: 'Tel', value: '+39 0588 86099' },
                ]),
                text: s('contatti.text', 'Riceviamo esclusivamente su prenotazione.'),
            },
        },
    ];
};
