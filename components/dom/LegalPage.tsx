import BackButton from '@/components/ui/BackButton';

interface LegalSection {
    title: string;
    body: string;
}

interface LegalPageProps {
    title: string;
    updatedAt: string;
    intro: string;
    sections: LegalSection[];
}

export default function LegalPage({ title, updatedAt, intro, sections }: LegalPageProps) {
    return (
        <main className="relative z-10 min-h-screen bg-[var(--background)] text-[var(--mucco-pisano)]">
            <BackButton />
            <div className="mx-auto max-w-3xl px-6 pb-[12vh] pt-[18vh] md:px-8">
                <h1 className="font-playfair text-4xl md:text-5xl mb-3">{title}</h1>
                <p className="font-inter text-xs uppercase tracking-[0.2em] opacity-60 mb-10">{updatedAt}</p>
                <p className="font-inter text-base leading-relaxed mb-12 opacity-90">{intro}</p>
                <div className="flex flex-col gap-10">
                    {sections.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="font-playfair text-2xl mb-3">{section.title}</h2>
                            <p className="font-inter text-sm leading-[1.9] opacity-80 whitespace-pre-line">{section.body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
