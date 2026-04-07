"use client";

import { useEffect, useRef } from 'react';
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
    const t = useTranslations();
    const olioData = getOlioData(t);

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
            <section id="act-1-attesa" className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[var(--terra-nera)] text-[#ECE8DF]">
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
                    <p className="font-inter text-xl lg:text-3xl leading-[1.6] act-1-text opacity-90 font-light max-w-3xl mx-auto">
                        {olioData.acts.act1.introText}
                    </p>
                </div>
            </section>

            {/* ACT 2: IL CULTO (Organic Green, Terroir) */}
            <section id="act-2-culto" className="relative min-h-screen px-[8vw] py-[20vh] bg-[var(--olive)] text-[#ECE8DF] flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2 act-2-reveal order-2 md:order-1">
                    <div className="w-full aspect-[3/4] rounded-sm relative overflow-hidden">
                        <Image 
                            src={olioData.acts.act2.images.primary.src}
                            alt={olioData.acts.act2.images.primary.alt}
                            fill 
                            className="object-cover opacity-80 parallax-img scale-[1.3]"
                            sizes="50vw"
                        />
                        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center font-playfair italic text-[#ECE8DF]/40 text-2xl z-20 pointer-events-none">
                            {olioData.acts.act2.images.primary.overlayText}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase mb-8 block act-2-reveal opacity-70">
                        {olioData.acts.act2.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-7xl leading-[1.1] mb-12 act-2-reveal">
                        {olioData.acts.act2.titleHtml}
                    </h2>
                    <div className="font-inter text-lg leading-[1.9] space-y-6 opacity-90 act-2-reveal font-light">
                        {olioData.acts.act2.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACT 3: L'ALCHIMIA FREDDA (Layout a colonna centrale semplificata) */}
            <section id="act-3-alchimia" className="relative px-[8vw] py-[25vh] bg-transparent text-[#ECE8DF] overflow-hidden">
                
                <div className="max-w-4xl mx-auto text-center relative z-20 mb-[15vh]">
                    <span className="font-inter text-xs tracking-[0.3em] uppercase mb-8 block opacity-60 fade-up-text">
                        {olioData.acts.act3.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl leading-[1.1] fade-up-text">
                        {olioData.acts.act3.titleHtml}
                    </h2>
                </div>

                <div className="flex flex-col gap-y-[12vh] max-w-3xl mx-auto relative z-20 pb-[10vh]">
                    {olioData.acts.act3.timelineSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center fade-up-text">
                            <div className="font-inter text-[10px] tracking-[0.25em] text-[#D4A361] uppercase mb-6 opacity-80">
                                {t('UI.stepPrefix')} 0{index + 1}
                            </div>
                            <h3 className="font-playfair text-3xl md:text-5xl mb-6 italic text-white">
                                {step.title}
                            </h3>
                            <p className="font-inter text-base md:text-lg leading-[1.9] opacity-70 font-light max-w-2xl">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ACT 4: LA RIVELAZIONE (Bright & Tasting) */}
            <section id="act-4-rivelazione" className="relative min-h-[100vh] px-[8vw] py-[25vh] bg-[#F3EFE7] text-[var(--mucco-pisano)] flex flex-col justify-center items-center text-center">
                <span className="font-inter text-xs tracking-[0.3em] uppercase mb-12 block act-4-sensory text-[var(--olive)]">
                    {olioData.acts.act4.label}
                </span>
                
                <p className="act-4-sensory font-playfair text-4xl md:text-5xl lg:text-7xl leading-[1.3] max-w-6xl mx-auto text-[var(--mucco-pisano)] mb-[10vh]">
                    {olioData.acts.act4.quoteHtml}
                </p>

                 {/* Single Elegant Panoramic Image */}
                <div className="act-4-sensory w-[90vw] md:w-[70vw] lg:w-[60vw] aspect-[16/9] rounded-sm overflow-hidden relative shadow-2xl mx-auto mt-12 md:mt-24 mb-16">
                    <Image 
                        src={olioData.acts.act4.images.primary.src}
                        alt={olioData.acts.act4.images.primary.alt}
                        fill 
                        className="object-cover parallax-img scale-[1.3]"
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 60vw"
                    />
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
                            onClick={() => setOilModalOpen(true)}
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
