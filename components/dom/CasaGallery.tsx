'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CasaGalleryContent, CasaGalleryGroupId, CasaGalleryPhoto } from '@/lib/content/types';

type Filter = 'all' | CasaGalleryGroupId;

// La galleria è larga al massimo 1400px: oltre ~1600px di viewport le miniature
// non crescono più, quindi il tetto in px evita di scaricare varianti inutili.
const thumbSizes = (ratio: number) =>
    ratio >= 1
        ? '(max-width: 767px) 70vw, (max-width: 1600px) 36vw, 580px'
        : '(max-width: 767px) 35vw, (max-width: 1600px) 17vw, 280px';

function CasaGallery({ data, onOpen }: {
    data: CasaGalleryContent;
    onOpen: (photos: CasaGalleryPhoto[], index: number) => void;
}) {
    const [filter, setFilter] = useState<Filter>('all');
    const isFirstRender = useRef(true);

    const visibleGroups = useMemo(
        () => (filter === 'all' ? data.groups : data.groups.filter((g) => g.id === filter)),
        [data.groups, filter]
    );
    const visiblePhotos = useMemo(() => visibleGroups.flatMap((g) => g.photos), [visibleGroups]);
    const total = data.groups.reduce((n, g) => n + g.photos.length, 0);
    const chips: { id: Filter; label: string; count: number }[] = [
        { id: 'all', label: data.allLabel, count: total },
        ...data.groups.map((g) => ({ id: g.id, label: g.label, count: g.photos.length })),
    ];

    // Il filtro cambia l'altezza della pagina: senza refresh i trigger sotto
    // la galleria resterebbero sulle vecchie posizioni (testi mai rivelati).
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        ScrollTrigger.refresh();
    }, [filter]);

    let offset = 0;

    return (
        <section
            id="galleria-casa"
            aria-labelledby="galleria-casa-title"
            className="relative px-[6vw] py-[12vh] lg:px-[8vw] lg:py-[16vh]"
        >
            <div className="mx-auto max-w-[1400px]">
                <span className="label mb-5 block fade-up-text">{data.label}</span>
                <h2
                    id="galleria-casa-title"
                    className="font-playfair text-5xl leading-[1.05] text-[var(--mucco-pisano)] md:text-7xl fade-up-text"
                >
                    {data.titleHtml}
                </h2>

                <div className="mb-12 mt-10 flex flex-wrap gap-2 lg:mb-16">
                    {chips.map((chip) => {
                        const active = filter === chip.id;
                        return (
                            <button
                                key={chip.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setFilter(chip.id)}
                                className={`rounded-full border px-4 py-2 font-inter text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                                    active
                                        ? 'border-[var(--mucco-pisano)] bg-[var(--mucco-pisano)] text-[var(--tufo)]'
                                        : 'border-[var(--mucco-pisano)]/25 text-[var(--mucco-pisano)]/75 hover:border-[var(--mucco-pisano)]/60 hover:text-[var(--mucco-pisano)]'
                                }`}
                            >
                                {chip.label} <span className="ml-1 opacity-60 tabular-nums">{chip.count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-14 lg:gap-20">
                    {visibleGroups.map((group) => {
                        const groupOffset = offset;
                        offset += group.photos.length;
                        return (
                            <div key={group.id}>
                                {filter === 'all' && (
                                    <h3 className="mb-5 flex items-baseline gap-3 font-playfair text-2xl italic text-[var(--mucco-pisano)] lg:text-3xl">
                                        {group.label}
                                        <span className="font-inter text-[10px] not-italic tracking-[0.2em] text-[var(--olive)] tabular-nums">
                                            {group.photos.length}
                                        </span>
                                    </h3>
                                )}
                                <div className="gallery-justified">
                                    {group.photos.map((photo, i) => {
                                        const ratio = photo.width / photo.height;
                                        return (
                                            <button
                                                key={photo.id}
                                                type="button"
                                                onClick={() => onOpen(visiblePhotos, groupOffset + i)}
                                                className="gallery-justified-item group"
                                                style={{ '--ar': ratio } as React.CSSProperties}
                                            >
                                                <Image
                                                    src={photo.src}
                                                    alt={photo.alt}
                                                    fill
                                                    sizes={thumbSizes(ratio)}
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                                />
                                                <span className="gallery-justified-caption" aria-hidden="true">
                                                    {photo.alt}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(CasaGallery);
