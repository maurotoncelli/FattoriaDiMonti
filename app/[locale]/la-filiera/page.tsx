"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useTranslations } from 'next-intl';
import { getFilieraData } from '@/lib/data/filiera';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function FilieraPage() {
    const containerRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const filieraData = getFilieraData(t);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // General Text Reveals
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 1.2, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        }
                    }
                );
            });

            // Act 1: Intro Fade
            gsap.fromTo(".act-1-text", 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.5, 
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: "#act-1-ecosistema",
                        start: "top 80%",
                    }
                }
            );

            // Act 3: Horizontal Gallery Pin — solo desktop
            const mmAct3 = gsap.matchMedia();
            mmAct3.add('(min-width: 1024px)', () => {
                const act3Container = document.getElementById("act-3-pin-container");
                const horizontalScrollDiv = document.getElementById("horizontal-gallery-track");
                if (act3Container && horizontalScrollDiv) {
                    gsap.to(horizontalScrollDiv, {
                        x: () => -(horizontalScrollDiv.scrollWidth - window.innerWidth),
                        ease: "none",
                        scrollTrigger: {
                            trigger: act3Container,
                            pin: true,
                            scrub: 1,
                            invalidateOnRefresh: true,
                            end: () => "+=" + horizontalScrollDiv.scrollWidth
                        }
                    });
                }
                return () => ScrollTrigger.getAll().forEach(st => st.kill());
            });

            // Act 4: Sensory Tasting Reveal
            gsap.fromTo(".act-4-sensory",
                { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
                {
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: "#act-4-terroir",
                        start: "top 60%",
                    }
                }
            );

            // Act 5: Finale Reveal
            gsap.fromTo(".act-5-reveal",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: "#act-5-conservazione",
                        start: "top 60%",
                    }
                }
            );

            // GSAP Parallax for Images
            gsap.utils.toArray('.parallax-img').forEach((el: any) => {
                gsap.fromTo(el, 
                    { yPercent: -15 },
                    {
                        yPercent: 15,
                        ease: "none",
                        scrollTrigger: {
                            trigger: el.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        }
                    }
                );
            });

        }, containerRef);
        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <main ref={containerRef} className="w-full relative z-10 font-inter text-[var(--mucco-pisano)] overflow-hidden">
            
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink 
                    href={filieraData.closeUrl}
                    bgColor="#F3EFE7"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--olive)] bg-[#F3EFE7]/80 backdrop-blur-md transition-all hover:bg-[var(--olive)] hover:scale-105"
                >
                    <span className="font-inter text-lg text-[var(--olive)] transition-colors group-hover:text-[#F3EFE7]">
                        {filieraData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* ACT 1: L'ECOSISTEMA (Dark & Tension) */}
            <section id="act-1-ecosistema" className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[var(--terra-nera)] text-[#ECE8DF]">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay overflow-hidden">
                    <Image 
                        src={filieraData.acts.act1.images.background.src}
                        alt={filieraData.acts.act1.images.background.alt}
                        fill 
                        className="object-cover parallax-img editorial-image scale-[1.3]"
                        sizes="100vw"
                        priority
                    />
                </div>
                
                <div className="relative z-10 text-center px-[8vw] max-w-5xl">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase block act-1-text opacity-70 mb-12 text-[#B4B886]">
                        {filieraData.acts.act1.label}
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] act-1-text mb-8 text-[#FFFDF8] drop-shadow-lg">
                        {filieraData.acts.act1.titleHtml}
                    </h1>
                    <p className="font-inter text-xl lg:text-3xl leading-[1.6] act-1-text font-light max-w-3xl mx-auto text-[#F5EAD4] drop-shadow-md">
                        {filieraData.acts.act1.introText}
                    </p>
                </div>
            </section>

            {/* ACT 2: LA ROTAZIONE DELLE COLTURE */}
            <section id="act-2-rotazione" className="relative px-[8vw] py-[25vh] text-[#ECE8DF] overflow-hidden">
                {/* Striscia chiara centrata — lascia visibile il canvas ai lati */}
                <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0,
                    left: '30vw', right: '30vw',
                    background: '#F3EFE7',
                    zIndex: 0,
                    pointerEvents: 'none',
                }} />
                <div className="max-w-4xl mx-auto text-center relative z-20 mb-[15vh]">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase mb-8 block fade-up-text text-[var(--olive)]">
                        {filieraData.acts.act2.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl leading-[1.1] fade-up-text text-[var(--mucco-pisano)]">
                        {filieraData.acts.act2.titleHtml}
                    </h2>
                </div>

                <div className="flex flex-col gap-y-[12vh] max-w-3xl mx-auto relative z-20 pb-[10vh]">
                    {filieraData.acts.act2.timelineSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center fade-up-text">
                            <div className="font-inter text-[10px] tracking-[0.25em] text-[var(--olive)] uppercase mb-6">
                                {t('UI.stepPrefix')} 0{index + 1}
                            </div>
                            <h3 className="font-playfair text-3xl md:text-5xl mb-6 italic text-[var(--mucco-pisano)]">
                                {step.title}
                            </h3>
                            <p className="font-inter text-base md:text-lg leading-[1.9] font-light max-w-2xl text-[var(--mucco-pisano)] opacity-75">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ACT 3: L'INTEGRAZIONE ANIMALE (Horizontal Gallery) */}
            <section id="act-3-pin-container" className="relative h-screen w-full bg-[#F3EFE7] overflow-hidden flex items-center">
                <div id="horizontal-gallery-track" className="flex h-[75vh] items-center pl-[8vw] flex-nowrap w-max will-change-transform">
                    
                    {/* Intro Testo */}
                    <div className="w-[85vw] md:w-[45vw] mr-16 md:mr-32 flex-shrink-0 flex flex-col justify-center">
                        <span className="font-inter text-xs tracking-[0.3em] uppercase mb-8 block opacity-70 text-[var(--olive)]">
                            {filieraData.acts.act3.label}
                        </span>
                        <h2 className="font-playfair text-5xl md:text-7xl leading-[1.1] mb-12 text-[var(--mucco-pisano)]">
                            {filieraData.acts.act3.titleHtml}
                        </h2>
                        <div className="font-inter text-lg leading-[1.9] space-y-6 opacity-90 font-light text-[var(--mucco-pisano)]">
                            {filieraData.acts.act3.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>

                    {/* Immagini Galleria */}
                    {filieraData.acts.act3.gallery.map((img, i) => (
                        <div key={i} className="w-[85vw] md:w-[65vw] h-full flex-shrink-0 relative overflow-hidden">
                            <Image 
                                src={img.src}
                                alt={img.alt}
                                fill 
                                className="object-cover editorial-image"
                                sizes="90vw"
                            />
                            <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                            <div className="absolute bottom-12 left-12 font-playfair italic text-[#ECE8DF] text-4xl z-20 pointer-events-none drop-shadow-md">
                                {img.caption}
                            </div>
                        </div>
                    ))}
                    
                    {/* Padding End per non incollare l'ultima immagine al margine se necessario */}
                    <div className="w-[4vw] flex-shrink-0" />
                </div>
            </section>

            {/* ACT 4: TERROIR ED ECCELLENZE (2-col Layout) */}
            <section id="act-4-terroir" className="relative min-h-screen px-[8vw] py-[25vh] bg-[#ECE8DF] text-[var(--mucco-pisano)] flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                
                {/* Colonna Sinistra: Testo */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center text-left act-4-sensory relative z-20">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase mb-12 block text-[var(--olive)] opacity-80">
                        {filieraData.acts.act4.label}
                    </span>
                    <p className="font-playfair text-3xl md:text-5xl lg:text-[3.2rem] leading-[1.3] text-[var(--mucco-pisano)] relative text-balance">
                        <span className="absolute -left-12 -top-8 text-[8rem] text-[var(--sabbia-limonitica)] opacity-20 font-playfair pointer-events-none leading-none">"</span>
                        {filieraData.acts.act4.quoteHtml}
                    </p>
                </div>

                {/* Colonna Destra: Immagine Editoriale */}
                <div className="w-full lg:w-7/12 aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden relative shadow-2xl act-4-sensory mt-12 lg:mt-0">
                    <Image 
                        src={filieraData.acts.act4.images.primary.src}
                        alt={filieraData.acts.act4.images.primary.alt}
                        fill 
                        className="object-cover parallax-img editorial-image scale-[1.3]"
                        sizes="(max-width: 1024px) 90vw, 60vw"
                    />
                </div>

            </section>

            {/* ACT 5: LA CONSERVAZIONE (Finale) */}
            <section id="act-5-conservazione" className="relative min-h-screen py-[15vh] pb-[10vh] flex flex-col justify-center items-center overflow-hidden text-[#ECE8DF]">
                
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={filieraData.acts.act5.images.background.src}
                        alt={filieraData.acts.act5.images.background.alt}
                        fill 
                        className="object-cover parallax-img editorial-image scale-[1.3]"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full pt-32">
                    <div className="text-center px-[8vw] act-5-reveal w-full">
                        <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-16">
                            {filieraData.acts.act5.cta.titleHtml}
                        </h2>
                        <TransitionLink 
                            href={filieraData.acts.act5.cta.href}
                            bgColor="#F3EFE7"
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-12 py-6 transition-transform hover:scale-[1.03]"
                        >
                            <span className="absolute inset-0 bg-white translate-y-[101%] transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
                            <span className="relative z-10 font-inter text-sm uppercase tracking-[0.2em] text-white transition-colors duration-500 group-hover:text-black">
                                {filieraData.acts.act5.cta.buttonLabel}
                            </span>
                        </TransitionLink>
                    </div>
                </div>
            </section>
        </main>
    );
}
