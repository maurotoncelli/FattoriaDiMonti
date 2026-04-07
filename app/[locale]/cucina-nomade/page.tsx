import { setRequestLocale } from 'next-intl/server';
import { cucinaNomadeData } from '@/lib/data/cucinaNomade';
import HeroNomade from '@/components/dom/HeroNomade';
import ManifestoNavigante from '@/components/dom/ManifestoNavigante';
import MenuMansonry from '@/components/dom/MenuMansonry';
import CrewNomade from '@/components/dom/CrewNomade';
import TourRadar from '@/components/dom/TourRadar';
import BookingNomade from '@/components/dom/BookingNomade';

export default function CucinaNomadePage({ params: { locale } }: { params: { locale: string } }) {
    setRequestLocale(locale);

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <HeroNomade data={cucinaNomadeData.hero} />
            <ManifestoNavigante data={cucinaNomadeData.manifesto} />
            <MenuMansonry data={cucinaNomadeData.menuGallery} />
            <CrewNomade data={cucinaNomadeData.crew} />
            <TourRadar data={cucinaNomadeData.radar} />
            <BookingNomade data={cucinaNomadeData.booking} />
        </main>
    );
}
