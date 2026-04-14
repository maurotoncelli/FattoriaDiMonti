export interface CrewMember {
    id: string;
    name: string;
    role: string;
    image: string;
    quote: string;
}

export interface TourDate {
    id: string;
    date: string; // Es. "12-14 AGOSTO"
    location: string; // Es. "Peccioli (PI)"
    coordinates: string; // Es. "43° 32' N 10° 43' E"
    description: string;
    link?: string;
    image?: string; // Immagine locandina o location che appare in hover
}

export interface CucinaNomadeData {
    hero: {
        titleBig: string;
        titleSmall: string;
        videoEnabled: boolean;
        videoSrc: string; 
        fallbackImage: string;
        scrollText: string;
    };
    manifesto: {
        tagline: string;
        title: string;
        paragraphs: string[];
        stats: { label: string; value: string }[];
    };
    menuGallery: {
        tagline: string;
        title: string;
        items: {
            id: string;
            name: string;
            description: string;
            image: string;
            type: 'text' | 'image' | 'mixed';
            details?: string[];
        }[];
    };
    crew: {
        tagline: string;
        title: string;
        description: string;
        members: CrewMember[];
    };
    radar: {
        tagline: string;
        title: string;
        description: string;
        events: TourDate[];
    };
    booking: {
        title: string;
        description: string;
        ctaLabel: string;
    };
}

// Strato Dati: Tutto è gestito qui per facilitare l'i18n e scongiurare l'hardcoding nella UI.
export const cucinaNomadeData: CucinaNomadeData = {
    hero: {
        titleBig: "L'ALTA CUCINA",
        titleSmall: "Il Rito del Fuoco Nomade.",
        videoEnabled: true,
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder SICURO (Sostituire)
        fallbackImage: "/images/cucina-nomade-hero.jpg", // Immagine esistente come fallback
        scrollText: "SCOPRI IL VIAGGIO"
    },
    manifesto: {
        tagline: "IL MANIFESTO NAVIGANTE",
        title: "Il Panino Definitivo, scolpito a fuoco.",
        paragraphs: [
            "Non chiamatelo street food. La Boutique Itinerante è l'estensione cruda e materica della nostra fattoria, progettata per portare l'eccellenza assoluta del Mucco Pisano ovunque ci sia strada e fuoco.",
            "Nessun compromesso: gli hamburger sono 100% pura razza autoctona, allevata allo stato brado nei nostri pascoli. Le salse sono create artigianalmente. Il pane è lievitato con i grani dei nostri campi. L'assemblaggio è un rito."
        ],
        stats: [
            { label: "Materia Prima", value: "100% Mucco Pisano" },
            { label: "Cottura", value: "Brace di Legna" },
            { label: "Filosofia", value: "Farm to Wheel" }
        ]
    },
    menuGallery: {
        tagline: "LE ICONE",
        title: "Design del Sapore",
        items: [
            {
                id: 'm1',
                name: 'IL MUCCO',
                description: 'Hamburger 200g 100% Mucco Pisano, maionese al pepe nero, insalata dell\'orto, pane agricolo a lievitazione naturale.',
                image: '/images/panino-m1-mucco.jpg',
                type: 'mixed',
                details: [
                    'Hamburger 200g · razza Mucco Pisano allevato allo stato brado',
                    'Maionese al pepe nero · artigianale',
                    'Insalata dell\'orto biologico della fattoria',
                    'Pane agricolo a lievitazione naturale 24h',
                    'Pomodoro cuore di bue di stagione',
                ]
            },
            {
                id: 'm2',
                name: 'LA CINTA',
                description: 'Cinta Senese croccante, crema di pecorino locale stagionato in grotta, cipolla rossa di Toscana fondente.',
                image: '/images/panino-m2-cinta.jpg',
                type: 'mixed',
                details: [
                    'Costoletta di Cinta Senese · fritta in olio di semi di girasole',
                    'Crema di pecorino · stagionato 12 mesi in grotta naturale',
                    'Cipolla rossa di Toscana · caramellata in aceto balsamico artigianale',
                    'Pane brioche tiepido · impasto al burro di fattoria',
                    'Foglie di rucola selvatica',
                ]
            },
            {
                id: 'm3',
                name: 'IL TARTUFATO',
                description: 'Battuta di Mucco tagliata al coltello, scaglie di tartufo nero di San Miniato, uovo fritto biologico.',
                image: '/images/panino-m3-tartufato.jpg',
                type: 'mixed',
                details: [
                    'Battuta di Mucco Pisano · taglio al coltello, non macinata',
                    'Tartufo nero di San Miniato · in stagione (nov–feb)',
                    'Uovo biologico fritto · tuorlo morbido',
                    'Salsa truffle mayo · base extravergine della fattoria',
                    'Pane di semola rimacinata · crosta croccante',
                ]
            },
            {
                id: 'm4',
                name: 'IL SILVANO',
                description: 'Doppio hamburger di Mucco, emulsione all\'Olio Extravergine della fattoria, lardo di colonnata DOP.',
                image: '/images/panino-m4-silvano.jpg',
                type: 'mixed',
                details: [
                    'Doppio hamburger 2×150g · Mucco Pisano',
                    'Emulsione all\'Olio Extravergine · cultivar Razzo, Leccino, Moraiolo',
                    'Lardo di Colonnata DOP · stagionato in conca di marmo',
                    'Pomodori confit al timo',
                    'Pane di noci e fichi · artigianale',
                ]
            },
            {
                id: 'm5',
                name: 'LO SBADATO',
                description: 'Pollo ruspante fritto, cavolo viola marinato, maionese senapata rustica artigianale.',
                image: '/images/panino-m5-sbadato.jpg',
                type: 'mixed',
                details: [
                    'Petto di pollo ruspante · marinato 12h in latticello e spezie',
                    'Fritura in olio di semi · a temperatura controllata 175°C',
                    'Cavolo viola marinato · aceto di mele e zucchero di canna',
                    'Maionese senapata · senape di Digione + uova biologiche',
                    'Pane al latte giapponese (milk bun)',
                ]
            }
        ]
    },
    crew: {
        tagline: "I VOLTI DELLA BRACE",
        title: "L'Anima della Boutique",
        description: "Dietro il fumo bianco e le piastre calde, c'è un team di artigiani devoti alla carne e al servizio. Pochi elementi, totale sincronia.",
        members: [
            {
                id: "chef-1",
                name: "Lorenzo",
                role: "Maestro della Brace",
                image: "/images/crew-lorenzo.jpg", // Immagine placeholder da rigenerare
                quote: "Il segreto non è solo la carne, è il rispetto per il fuoco."
            },
            {
                id: "chef-2",
                name: "Martina",
                role: "Assemblaggio & Ritmo",
                image: "/images/crew-martina.jpg", // Immagine placeholder da rigenerare
                quote: "Un panino perfetto richiede ingegneria dei sapori."
            },
            {
                id: "chef-3",
                name: "Gabriele",
                role: "Accoglienza Nomade",
                image: "/images/crew-gabriele.jpg", // Immagine placeholder da rigenerare
                quote: "Non serviamo semplicemente cibo, raccontiamo la nostra fattoria."
            }
        ]
    },
    radar: {
        tagline: "RADAR TOUR",
        title: "Dove Incontrarci",
        description: "La Boutinque Itinerante si sposta seguendo eventi selezionati, festival d'arte e occasioni private esclusive. Tieni d'occhio le coordinate.",
        events: [
            {
                id: "ev-1",
                date: "14—16 LUGLIO 2026",
                location: "11 Lune",
                description: "Anfiteatro del Fonte Mazzola, Peccioli. Accompagniamo il gusto alle notti di teatro e musica sotto le stelle.",
                coordinates: "43° 32' 50\" N 10° 43' 12\" E",
                image: "/images/event-peccioli.png" // Fallback placeholder
            },
            {
                id: "ev-2",
                date: "28 AGOSTO 2026",
                location: "Castelfalfi Golf Club",
                description: "Edizione speciale cena sotto le stelle nel prestigioso resort di Castelfalfi. Evento su invito.",
                coordinates: "43° 33' 35\" N 10° 52' 14\" E",
                image: "/images/event-castelfalfi.png"
            },
            {
                id: "ev-3",
                date: "12 SETTEMBRE 2026",
                location: "Volterra AD 1398",
                description: "Il nostro ritorno alle origini medievali. La Boutique si inserisce nel contesto storico del borgo.",
                coordinates: "43° 24' 07\" N 10° 51' 35\" E",
                image: "/images/event-volterra.png"
            }
        ]
    },
    booking: {
        title: "Pretendi la Fattoria.",
        description: "La nostra Boutique Itinerante può raggiungere il tuo evento privato, matrimonio o meeting aziendale per offrire un'esperienza culinaria radicale e indimenticabile.",
        ctaLabel: "RICHIEDI LA BOUTIQUE"
    }
};
