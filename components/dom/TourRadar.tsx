'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

export default function TourRadar({ data }: { data: CucinaNomadeData['radar'] }) {
    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const ctx = gsap.context(() => {
            // Textual fades
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
                );
            });

            // List items fades
            if (listRef.current) {
                const items = listRef.current.querySelectorAll('li');
                items.forEach((item) => {
                    gsap.fromTo(item,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%' } }
                    );
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-24 md:py-32 bg-[var(--background)] text-[var(--muccoPisano)]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row gap-20">
                
                {/* Left: Info */}
                <div className="md:w-1/3 flex flex-col pt-4">
                    <span className="font-inter text-[10px] tracking-[0.2em] text-[var(--argilla-ferrosa)] uppercase mb-6 fade-up-text opacity-0">
                        ✦ {data.tagline}
                    </span>
                    <h2 className="font-playfair italic text-5xl md:text-6xl text-[var(--muccoPisano)] mb-6 fade-up-text opacity-0">
                        {data.title}
                    </h2>
                    <p className="font-inter text-base text-[var(--muccoPisano)]/70 max-w-sm leading-relaxed mt-4 fade-up-text opacity-0">
                        {data.description}
                    </p>
                </div>

                {/* Right: List */}
                <div className="md:w-2/3 border-t border-[var(--muccoPisano)]/10">
                    <ul ref={listRef} className="flex flex-col">
                        {data.events.map((ev) => (
                            <li key={ev.id} className="group relative border-b border-[var(--muccoPisano)]/10 py-16 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-black/5 transition-colors duration-500 px-6 -mx-6">
                                
                                <div className="flex flex-col gap-4 md:w-2/3">
                                    <span className="font-inter text-[10px] font-bold tracking-[0.2em] text-[var(--olive)] uppercase">
                                        {ev.date}
                                    </span>
                                    <h3 className="font-playfair italic text-4xl md:text-5xl text-[var(--muccoPisano)] transition-colors group-hover:text-[var(--argilla-ferrosa)]">
                                        {ev.location}
                                    </h3>
                                    <p className="font-inter text-sm text-[var(--muccoPisano)]/70 leading-relaxed mt-2 max-w-md">
                                        {ev.description}
                                    </p>
                                </div>

                                <div className="md:w-1/3 flex md:justify-end mt-4 md:mt-0">
                                    <span className="font-inter text-[10px] tracking-[0.25em] text-[var(--argilla-ferrosa)] opacity-70">
                                        {ev.coordinates}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    );
}
