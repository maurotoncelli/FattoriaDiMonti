"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { getOlioData } from '@/lib/data/olio';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function OlioPage() {
    const containerRef = useRef<HTMLElement>(null);
    const setOilModalOpen = useAppStore((state) => state.setOilModalOpen);
    const setConciergeOpen = useAppStore((state) => state.setConciergeOpen);
    const setOilSheetOpen = useAppStore((state) => state.setOilSheetOpen);
    const t = useTranslations();
    const olioData = getOlioData(t);
    const [selectedFormatSize, setSelectedFormatSize] = useState(olioData.acts.act4.formats[0]?.size || '500 ml');

    useEffect(() => {
        let ctx = gsap.context(() => {
            // General Text Reveals per i blocchi refattorizzati
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
                        trigger: "#act-1-attesa",
                        start: "top 80%",
                    }
                }
            );

            // Act 2: Staggered Reveal
            gsap.utils.toArray('.act-2-reveal').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 1.2, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        }
                    }
                );
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
                        trigger: "#act-4-rivelazione",
                        start: "top 60%",
                    }
                }
            );

            // Act 4: Masonry Reveal
            gsap.utils.toArray('.act-4-masonry-item').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        }
                    }
                );
            });

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
                        trigger: "#act-5-sigillo",
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
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="w-full relative z-10 font-inter text-[var(--mucco-pisano)] overflow-hidden">
            
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink 
                    href={olioData.closeUrl}
                    bgColor="#F3EFE7"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--olive)] bg-[#F3EFE7]/80 backdrop-blur-md transition-all hover:bg-[var(--olive)] hover:scale-105"
                >
                    <span className="font-inter text-lg text-[var(--olive)] transition-colors group-hover:text-[#F3EFE7]">
                        {olioData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* ACT 1: L'ATTESA (Dark & Tension) */}
            <section id="act-1-attesa" className="relative min-h-[135vh] w-full flex flex-col justify-center items-center overflow-hidden bg-[var(--terra-nera)] text-[#ECE8DF] py-[14vh]">
                {/* Standard GSAP Parallax Image */}
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay overflow-hidden">
                    <Image 
                        src={olioData.acts.act1.images.background.src}
                        alt={olioData.acts.act1.images.background.alt}
                        fill 
                        className="object-cover parallax-img scale-[1.3]"
                        sizes="100vw"
                    />
                </div>
                
                <div className="relative z-10 text-center px-[8vw] max-w-5xl">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase block act-1-text opacity-70 mb-12 text-[#B4B886]">
                        {olioData.acts.act1.label}
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] act-1-text mb-8">
                        {olioData.acts.act1.titleHtml}
                    </h1>
                    <p className="font-inter text-xl lg:text-3xl leading-[1.6] act-1-text font-light max-w-3xl mx-auto text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.75)]">
                        {olioData.acts.act1.introText}
                    </p>
                </div>

                <div className="relative z-10 mt-16 w-full px-[5vw]">
                    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14">
                        {olioData.bottles.map((bottle) => (
                                <button
                                    key={bottle.id}
                                    type="button"
                                    onClick={() => setOilSheetOpen(true, bottle.id)}
                                    className="group relative flex min-h-[620px] flex-col items-center justify-end px-2 pb-6 pt-4 text-center outline-none transition-all duration-500 hover:-translate-y-3 focus-visible:-translate-y-3"
                                >
                                    <div
                                        className="absolute left-1/2 top-16 h-96 w-96 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                                        style={{ background: bottle.glowColor }}
                                    />

                                    <div className="relative mb-8 flex h-[430px] w-full items-end justify-center lg:h-[480px]">
                                        <div className="absolute bottom-0 h-6 w-56 rounded-full bg-black/55 blur-xl transition-all duration-500 group-hover:w-72 group-hover:bg-black/80" />
                                        <div className="relative h-[410px] w-[156px] origin-bottom transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110 lg:h-[460px] lg:w-[176px]">
                                            <div className="absolute left-1/2 top-0 h-20 w-12 -translate-x-1/2 rounded-t-[1rem] bg-[#15130f] ring-1 ring-white/10 lg:h-24 lg:w-14" />
                                            <div className="absolute left-1/2 top-16 h-11 w-20 -translate-x-1/2 rounded-t-full bg-[#1d1a13] ring-1 ring-white/10 lg:top-20 lg:h-12 lg:w-24" />
                                            <div className="absolute inset-x-0 bottom-0 h-[334px] rounded-[3rem_3rem_1.3rem_1.3rem] bg-gradient-to-br from-[#16130d] via-[#2b2618] to-[#090806] shadow-2xl ring-1 ring-white/10 lg:h-[372px]" />
                                            <div className="absolute left-7 top-[8.5rem] h-56 w-5 rounded-full bg-white/20 blur-[2px] lg:top-40 lg:h-64" />
                                            <div
                                                className="absolute left-1/2 top-44 flex h-36 w-36 -translate-x-1/2 flex-col items-center justify-center rounded-[1.35rem] border border-white/20 px-4 text-center shadow-lg transition-all duration-500 group-hover:shadow-[0_0_45px_rgba(246,211,101,0.45)] lg:top-52 lg:h-40 lg:w-40 backdrop-blur-sm"
                                                style={{ background: bottle.labelColor }}
                                            >
                                                <span className="font-playfair text-3xl italic leading-none text-[#F3EFE7] lg:text-4xl">Monti</span>
                                                <span className="mt-3 font-inter text-[8px] uppercase tracking-[0.24em] text-[#F3EFE7]/90">
                                                    {bottle.subtitle}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="mb-3 font-inter text-[10px] uppercase tracking-[0.24em] text-white/40 transition-colors duration-500 group-hover:text-[#F6D365]/80">
                                        {bottle.subtitle}
                                    </span>
                                    <h2 className="font-playfair text-5xl italic leading-none text-white transition-all duration-500 group-hover:scale-105 group-hover:text-[#F6D365] group-focus-visible:text-[#F6D365] lg:text-6xl">
                                        {bottle.name}
                                    </h2>
                                    <p className="mt-5 min-h-[84px] max-w-md text-base leading-7 text-white/78 transition-all duration-500 group-hover:text-white group-focus-visible:text-white">
                                        {bottle.description}
                                    </p>
                                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                                        {bottle.tastingNotes.map((note) => (
                                            <span
                                                key={note}
                                                className="rounded-full border border-white/12 px-3 py-1 font-inter text-[9px] uppercase tracking-[0.16em] text-white/48 transition-colors duration-500 group-hover:border-[#F6D365]/35 group-hover:text-[#F6D365]"
                                            >
                                                {note}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="mt-7 font-inter text-[10px] uppercase tracking-[0.24em] text-white/58 transition-colors duration-500 group-hover:text-[#F6D365]">
                                        {olioData.order.openSheetLabel}
                                    </span>
                                </button>
                            ))}
                    </div>
                </div>
            </section>

            {/* ACT 2: IL CULTO (Organic Green, Terroir) */}
            <section id="act-2-culto" className="relative px-[6vw] py-[12vh] bg-[var(--olive)] text-[#ECE8DF] flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                <div className="w-full md:w-5/12 act-2-reveal order-2 md:order-1 relative">
                    <div className="w-full aspect-[4/5] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <Image 
                            src={olioData.acts.act2.images.primary.src}
                            alt={olioData.acts.act2.images.primary.alt}
                            fill 
                            className="object-cover opacity-90 parallax-img scale-[1.3]"
                            sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-0 flex items-end justify-center pb-8 font-playfair italic text-[#ECE8DF]/80 text-xl md:text-2xl z-20 pointer-events-none">
                            {olioData.acts.act2.images.primary.overlayText}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-7/12 flex flex-col justify-center order-1 md:order-2 max-w-2xl">
                    <span className="font-inter text-[10px] tracking-[0.3em] uppercase mb-6 block act-2-reveal opacity-70 text-[#B4B886]">
                        {olioData.acts.act2.label}
                    </span>
                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8 act-2-reveal">
                        {olioData.acts.act2.titleHtml}
                    </h2>
                    <div className="font-inter text-base lg:text-lg leading-[1.8] space-y-5 opacity-80 act-2-reveal font-light">
                        {olioData.acts.act2.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACT 3: L'ALCHIMIA FREDDA (Compact Grid) */}
            <section id="act-3-alchimia" className="relative px-[6vw] py-[12vh] md:py-[15vh] bg-[#ECE8DF] text-[#15130f]">
                <div className="mx-auto flex flex-col max-w-[1400px]">
                    
                    <div className="mb-16 md:mb-20 flex flex-col lg:flex-row items-baseline justify-between gap-8 border-b border-[#15130f]/10 pb-8 fade-up-text">
                        <div className="max-w-3xl">
                            <span className="font-inter text-[10px] tracking-[0.3em] uppercase mb-4 block opacity-50 font-semibold">
                                {olioData.acts.act3.label}
                            </span>
                            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
                                {olioData.acts.act3.titleHtml}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 fade-up-text">
                        {olioData.acts.act3.timelineSteps.map((step, index) => (
                            <div key={index} className="group flex flex-col relative h-full">
                                <div className="font-inter text-[9px] tracking-[0.25em] text-[#B4B886] font-semibold mb-4 border-b border-[#15130f]/5 pb-4 flex justify-between items-end">
                                    <span>{t('UI.stepPrefix')}</span>
                                    <span className="text-xl font-playfair italic text-[#15130f]/20 group-hover:text-[#B4B886] transition-colors">0{index + 1}</span>
                                </div>
                                <h3 className="font-playfair text-2xl mb-3 text-[#15130f]">
                                    {step.title.replace(/^\d+\.\s*/, '')}
                                </h3>
                                <p className="font-inter text-sm leading-[1.7] text-[#15130f]/70 font-light mt-auto pt-2">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ACT 4: LA RIVELAZIONE E I FORMATI */}
            <section id="act-4-rivelazione" className="relative bg-[#F3EFE7] text-[#4A2E1B] px-[8vw] py-[20vh] min-h-screen">
                <div className="max-w-7xl mx-auto flex flex-col gap-16 lg:gap-24">
                    
                    {/* Top Section: Text and Primary Banner */}
                    <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Left Sticky Column: The sensory quote */}
                        <div className="lg:w-5/12 lg:sticky lg:top-[20vh] h-fit flex flex-col items-start text-left z-10">
                            <span className="font-inter text-[10px] tracking-[0.3em] uppercase mb-10 block text-[#6B7A65] font-semibold">
                                {olioData.acts.act4.label}
                            </span>
                            <p className="font-playfair text-4xl md:text-5xl xl:text-[4rem] leading-[1.1] mb-10 text-[#4A2E1B]">
                                {olioData.acts.act4.quoteHtml}
                            </p>
                            <p className="font-inter text-base md:text-lg leading-[1.8] text-[#4A2E1B]/70 font-light max-w-md">
                                {olioData.acts.act4.description}
                            </p>
                        </div>

                        {/* Right Scrollable Column: Primary Image */}
                        <div className="lg:w-7/12 flex flex-col pt-[5vh] lg:pt-0">
                            <div className="act-4-masonry-item opacity-0 relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden shadow-[0_30px_60px_rgba(74,46,27,0.15)]">
                                <Image 
                                    src={olioData.acts.act4.images.primary.src}
                                    alt={olioData.acts.act4.images.primary.alt}
                                    fill 
                                    className="object-cover parallax-img scale-[1.3]"
                                    sizes="(max-width: 1024px) 90vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Full-width Masonry Gallery */}
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-10 md:mt-2 lg:-mt-24 pb-10 md:pb-20 relative z-20">
                        <div className="act-4-masonry-item opacity-0 relative w-full aspect-[3/4] overflow-hidden shadow-[0_20px_40px_rgba(74,46,27,0.1)] lg:mt-32">
                            <Image src={olioData.acts.act4.images.gallery[0].src} alt={olioData.acts.act4.images.gallery[0].alt} fill className="object-cover parallax-img scale-[1.2]" sizes="(max-width: 1024px) 45vw, 25vw" />
                        </div>
                        <div className="act-4-masonry-item opacity-0 relative w-full aspect-[4/5] overflow-hidden shadow-[0_20px_40px_rgba(74,46,27,0.1)] mt-8 md:mt-16">
                            <Image src={olioData.acts.act4.images.gallery[1].src} alt={olioData.acts.act4.images.gallery[1].alt} fill className="object-cover parallax-img scale-[1.2]" sizes="(max-width: 1024px) 45vw, 25vw" />
                        </div>
                        <div className="act-4-masonry-item opacity-0 relative w-full aspect-[3/4] overflow-hidden shadow-[0_20px_40px_rgba(74,46,27,0.1)] mt-12 md:mt-24 lg:mt-32">
                            <Image src={olioData.acts.act4.images.gallery[2].src} alt={olioData.acts.act4.images.gallery[2].alt} fill className="object-cover parallax-img scale-[1.2]" sizes="(max-width: 1024px) 45vw, 25vw" />
                        </div>
                        <div className="act-4-masonry-item opacity-0 relative w-full aspect-[4/5] overflow-hidden shadow-[0_20px_40px_rgba(74,46,27,0.1)] mt-4 md:mt-8">
                            <Image src={olioData.acts.act4.images.gallery[3].src} alt={olioData.acts.act4.images.gallery[3].alt} fill className="object-cover parallax-img scale-[1.2]" sizes="(max-width: 1024px) 45vw, 25vw" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ACT 5: IL SIGILLO (Awards & CTA) */}
            <section id="act-5-sigillo" className="relative min-h-screen py-[15vh] pb-[10vh] flex flex-col justify-end items-center overflow-hidden text-[#ECE8DF]">
                
                {/* Immersive Parallax Background */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={olioData.acts.act5.images.background.src}
                        alt={olioData.acts.act5.images.background.alt}
                        fill 
                        className="object-cover parallax-img scale-[1.3]"
                        sizes="100vw"
                    />
                    {/* Dark gradient overlay so text is legible and mood is dramatic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/30" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                    
                    {/* Awards Box Minimal (White/Gold variant) */}
                    <div className="act-5-reveal w-full max-w-4xl border-t border-white/20 pt-16 flex flex-col md:flex-row justify-center items-center gap-12 mb-[15vh]">
                        {olioData.acts.act5.awards.map((award, index) => (
                            <div className="flex items-center flex-col md:flex-row gap-12" key={index}>
                                <div className="text-center">
                                    <span className="block font-playfair text-3xl text-[#D4A361] mb-2">{award.year}</span>
                                    <span className="font-inter text-xs uppercase tracking-[0.2em] opacity-80">{award.name}</span>
                                </div>
                                {index < olioData.acts.act5.awards.length - 1 && (
                                    <div className="hidden md:block w-px h-12 bg-white/20"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Final CTA Full Width Center */}
                    <div className="text-center px-[8vw] act-5-reveal w-full">
                        <h2 className="font-playfair text-6xl md:text-8xl leading-[1.1] mb-12">
                            {olioData.acts.act5.cta.titleHtml}
                        </h2>
                        <button 
                            onClick={() => setConciergeOpen(true)}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-12 py-6 transition-transform hover:scale-[1.03]"
                        >
                            <span className="absolute inset-0 bg-white translate-y-[101%] transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
                            <span className="relative z-10 font-inter text-sm uppercase tracking-[0.2em] text-white transition-colors duration-500 group-hover:text-black">
                                {olioData.acts.act5.cta.buttonLabel}
                            </span>
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
}
