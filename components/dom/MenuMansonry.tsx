'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

type MenuItem = CucinaNomadeData['menuGallery']['items'][number];

function DetailsAccordion({ details }: { details: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<SVGSVGElement>(null);

    const toggle = useCallback(() => {
        const el = contentRef.current;
        if (!el) return;

        if (isOpen) {
            gsap.to(el, { height: 0, duration: 0.4, ease: 'power3.inOut' });
            gsap.to(arrowRef.current, { rotation: 0, duration: 0.35, ease: 'power2.inOut' });
        } else {
            gsap.fromTo(el,
                { height: 0 },
                { height: el.scrollHeight, duration: 0.4, ease: 'power3.inOut' }
            );
            gsap.to(arrowRef.current, { rotation: 180, duration: 0.35, ease: 'power2.inOut' });
        }
        setIsOpen(v => !v);
    }, [isOpen]);

    return (
        <div className="mt-4 border-t border-[var(--muccoPisano)]/10 pt-3">
            <button
                onClick={toggle}
                aria-expanded={isOpen}
                className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
            >
                <span className="font-inter text-[10px] tracking-[0.18em] uppercase text-[var(--argilla-ferrosa)]/60 group-hover:text-[var(--argilla-ferrosa)] transition-colors duration-300">
                    ✦ Ingredienti
                </span>
                <svg
                    ref={arrowRef}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="text-[var(--argilla-ferrosa)]/50 group-hover:text-[var(--argilla-ferrosa)] transition-colors duration-300 flex-shrink-0"
                >
                    <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div
                ref={contentRef}
                style={{ height: 0, overflow: 'hidden' }}
            >
                <ul className="flex flex-col gap-2 pt-4 pb-1">
                    {details.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-[var(--argilla-ferrosa)]/30 text-[10px] mt-[3px] flex-shrink-0">—</span>
                            <span className="font-inter text-xs text-[var(--muccoPisano)]/55 leading-relaxed">{line}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function MasonryItem({ item }: { item: MenuItem }) {
    return (
        <div className="masonry-item flex flex-col w-full mb-16 md:mb-24 px-4 md:px-0">
            {item.type === 'image' && (
                <div className="w-full aspect-[4/5] bg-[var(--muccoPisano)]/5 overflow-hidden filter grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
            )}

            {item.type === 'text' && (
                <div className="flex flex-col gap-4 py-8 md:py-12 border-t border-b border-[var(--muccoPisano)]/10">
                    <h3 className="font-playfair italic text-4xl md:text-5xl text-[var(--argilla-ferrosa)] leading-[1.1]">{item.name}</h3>
                    <p className="font-inter text-sm md:text-base text-[var(--muccoPisano)]/70 leading-relaxed font-light">
                        {item.description}
                    </p>
                    {item.details && item.details.length > 0 && (
                        <DetailsAccordion details={item.details} />
                    )}
                </div>
            )}

            {item.type === 'mixed' && (
                <div className="flex flex-col gap-6">
                    <div className="w-full aspect-[4/3] bg-[var(--muccoPisano)]/5 overflow-hidden filter grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-playfair italic text-3xl md:text-4xl text-[var(--argilla-ferrosa)]">{item.name}</h3>
                        <p className="font-inter text-sm md:text-base text-[var(--muccoPisano)]/70 leading-relaxed font-light">
                            {item.description}
                        </p>
                        {item.details && item.details.length > 0 && (
                            <DetailsAccordion details={item.details} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MenuMansonry({ data }: { data: CucinaNomadeData['menuGallery'] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
                );
            });

            const items = containerRef.current!.querySelectorAll('.masonry-item');
            items.forEach((item) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const leftCol = data.items.filter((_, i) => i % 2 === 0);
    const rightCol = data.items.filter((_, i) => i % 2 !== 0);

    return (
        <section ref={containerRef} className="w-full py-24 md:py-32 bg-[var(--background)] relative">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">

                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <span className="font-inter text-[10px] tracking-[0.2em] text-[var(--argilla-ferrosa)] uppercase mb-6 fade-up-text opacity-0">
                        ✦ {data.tagline}
                    </span>
                    <h2 className="font-playfair italic text-5xl md:text-7xl text-[var(--muccoPisano)] fade-up-text opacity-0">
                        {data.title}
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                    <div className="w-full md:w-1/2 flex flex-col md:mt-32">
                        {leftCol.map(item => <MasonryItem key={item.id} item={item} />)}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        {rightCol.map(item => <MasonryItem key={item.id} item={item} />)}
                    </div>
                </div>

            </div>
        </section>
    );
}
