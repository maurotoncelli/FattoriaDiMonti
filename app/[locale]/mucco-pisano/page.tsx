"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { getMuccoPisanoData } from '@/lib/data/muccoPisano';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function MuccoPisanoPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const setConciergeOpen = useAppStore((state) => state.setConciergeOpen);
    const setJerkySheetOpen = useAppStore((state) => state.setJerkySheetOpen);
    const t = useTranslations();
    const muccoPisanoData = getMuccoPisanoData(t);
    const tOverlay = useTranslations('Overlays.jerkySheet');

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero elements — timeline al mount (già in viewport, ScrollTrigger non scatta)
            gsap.timeline({ delay: 0.15 })
                .fromTo('.hero-label',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
                )
                .fromTo('.hero-title',
                    { y: 55, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.55'
                )
                .fromTo('.hero-intro',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6'
                );

            // Sezioni corpo — fade-up al scroll
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el,
                    { y: 60, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 87%' }
                    }
                );
            });

            // Parallax su tutte le immagini .parallax-img
            gsap.utils.toArray('.parallax-img').forEach((img: any) => {
                const parent = img.parentElement;
                gsap.fromTo(img,
                    { yPercent: -10 },
                    {
                        yPercent: 10, ease: 'none',
                        scrollTrigger: {
                            trigger: parent,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="w-full bg-[#F3EFE7] overflow-hidden">

            {/* Close button */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink
                    href={muccoPisanoData.closeUrl}
                    bgColor="#F3EFE7"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--olive)] bg-[#F3EFE7] backdrop-blur-md transition-all hover:bg-[var(--olive)] hover:scale-105 shadow-xl"
                >
                    <span className="font-inter text-lg text-[var(--olive)] transition-colors group-hover:text-[#F3EFE7]">
                        {muccoPisanoData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-[8vw] py-[20vh] overflow-hidden">

                {/* Foto hero con parallax */}
                <div className="absolute inset-0 z-0" style={{ overflow: 'hidden' }}>
                    <Image
                        src="/images/mucco-pisano.png"
                        alt="Mucco Pisano allo stato brado"
                        fill
                        className="parallax-img"
                        style={{ objectFit: 'cover', objectPosition: 'center', scale: '1.15' }}
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* Vignette */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(20,15,10,0.45) 0%, rgba(20,15,10,0.2) 40%, rgba(20,15,10,0.5) 100%)',
                    }}
                />

                {/* Testo hero */}
                <div className="relative z-10 max-w-4xl text-center">
                    <span className="hero-label font-inter text-xs tracking-[0.2em] text-[rgba(236,232,223,0.65)] uppercase mb-8 block">
                        {muccoPisanoData.hero.label}
                    </span>
                    <h1 className="hero-title font-playfair text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] mb-12 text-[var(--tufo)]">
                        {muccoPisanoData.hero.titleHtml}
                    </h1>
                    <p className="hero-intro font-inter text-lg lg:text-xl leading-[1.8] text-[rgba(236,232,223,0.78)] max-w-2xl mx-auto">
                        {muccoPisanoData.hero.introText}
                    </p>
                </div>
            </section>

            {/* ── CARATTERISTICHE ───────────────────────────────────────── */}
            <section className="relative min-h-[70vh] flex flex-col justify-center items-center px-[8vw] py-[15vh] bg-[#EAE5DA]">
                <div className="max-w-5xl text-center w-full">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--argilla-ferrosa)] uppercase mb-12 block fade-up-text">
                        {muccoPisanoData.caratteristiche.label}
                    </span>

                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl leading-[1.2] text-[var(--mucco-pisano)] mb-16 fade-up-text font-medium italic px-[5vw]">
                        {muccoPisanoData.caratteristiche.quoteHtml}
                    </h2>

                    {/* Carne Secca Products embedded in Caratteristiche */}
                    <div className="mt-8 mb-24 sm:mt-12 sm:mb-32 w-full">
                        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-2 lg:gap-24 relative z-10 w-full">
                            {muccoPisanoData.essiccata.products?.map((product) => (
                                <button 
                                    key={product.id}
                                    onClick={() => setJerkySheetOpen(true, product.id)}
                                    className="group relative flex flex-col items-center text-center outline-none transition-all duration-500 hover:-translate-y-3 focus-visible:-translate-y-3 fade-up-text"
                                >
                                    {/* Image Container with drop shadow and hover scaling */}
                                    <div className="relative mb-6 flex h-[350px] sm:h-[400px] w-full items-end justify-center">
                                        <div className="absolute bottom-[-15px] h-6 w-56 rounded-full bg-[#3D332A]/20 blur-xl transition-all duration-500 group-hover:w-72 group-hover:bg-[#3D332A]/30" />
                                        <div className="relative h-full w-[280px] sm:w-[320px] origin-bottom transition-transform duration-500 group-hover:scale-[1.03]">
                                            {product.image?.src ? (
                                                <Image 
                                                    src={product.image.src} 
                                                    alt={product.image.alt} 
                                                    fill 
                                                    style={{ objectPosition: 'bottom' }}
                                                    className="object-contain drop-shadow-[0_15px_25px_rgba(40,30,20,0.25)] transition-all duration-500 group-hover:drop-shadow-[0_25px_35px_rgba(40,30,20,0.35)]" 
                                                />
                                            ) : (
                                                <div className="absolute inset-x-0 bottom-0 h-4/5 rounded-xl shadow-2xl" style={{ background: product.labelColor }} />
                                            )}
                                        </div>
                                    </div>
                    
                                    {/* Product Text & Tags */}
                                    <span className="mb-3 font-inter text-[10px] uppercase tracking-[0.24em] text-[var(--olive)]/80 transition-colors duration-500 group-hover:text-[var(--olive)] block w-full text-center">
                                        {product.subtitle}
                                    </span>
                                    <h3 className="font-playfair text-4xl italic leading-none text-[var(--mucco-pisano)] transition-all duration-500 group-hover:scale-105 block w-full text-center">
                                        {product.name}
                                    </h3>
                                    <p className="mt-5 min-h-[80px] max-w-sm text-sm md:text-base leading-[1.8] text-[var(--mucco-pisano)]/75 transition-colors duration-500 group-hover:text-[var(--mucco-pisano)] mx-auto text-center">
                                        {product.description}
                                    </p>
                                    <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-[80%] mx-auto">
                                        {product.tags?.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-[var(--mucco-pisano)]/15 bg-transparent px-3 py-1 font-inter text-[9px] uppercase tracking-[0.16em] text-[var(--mucco-pisano)]/70 transition-colors duration-500 group-hover:border-[var(--olive)]/40 group-hover:text-[var(--olive)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-8">
                                        <span
                                            className="font-inter text-[10px] uppercase tracking-[0.24em] text-[var(--olive)] border-b border-[var(--olive)]/30 pb-1.5 transition-all inline-block group-hover:text-[var(--mucco-pisano)] group-hover:border-[var(--mucco-pisano)]"
                                        >
                                            {tOverlay('viewDetails')}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Pulsante d'acquisto sotto i prodotti */}
                        <div className="mt-20 flex justify-center w-full fade-up-text">
                            <button
                                onClick={() => setConciergeOpen(true, 'default')}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--mucco-pisano)]/20 bg-transparent px-10 py-5 transition-transform hover:scale-[1.03]"
                            >
                                <span className="absolute inset-0 translate-y-[101%] bg-[var(--mucco-pisano)] transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
                                <span className="relative z-10 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[var(--mucco-pisano)] transition-colors duration-500 group-hover:text-[#F3EFE7]">
                                    {muccoPisanoData.tagli.ctaLabel}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        {muccoPisanoData.caratteristiche.items.map((item, index) => (
                            <div key={index} className="fade-up-text">
                                <h3 className="font-playfair text-2xl mb-4 text-[var(--olive)]">{item.title}</h3>
                                <p className="font-inter text-sm md:text-base text-[var(--mucco-pisano)]/80 leading-[1.8]">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── I TAGLI NOBILI ────────────────────────────────────────── */}
            <section className="relative min-h-screen bg-[var(--terra-nera)] text-[var(--tufo)] px-[8vw] py-[15vh] flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10vw] items-center w-full max-w-[1600px] mx-auto">

                    {/* Foto materica */}
                    <div className="relative h-[60vh] lg:h-[80vh] w-full overflow-hidden rounded-sm fade-up-text">
                        <Image
                            src="/images/mucco-pisano-16-9.png"
                            alt="Mucco Pisano — Tagli Nobili"
                            fill
                            className="parallax-img"
                            style={{ objectFit: 'cover', scale: '1.15' }}
                            sizes="50vw"
                        />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(20,15,10,0.15)' }} />
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-6 block fade-up-text">
                            {muccoPisanoData.tagli.label}
                        </span>
                        <h2 className="font-playfair text-5xl md:text-7xl leading-[0.9] text-white mb-10 fade-up-text">
                            {muccoPisanoData.tagli.titleHtml}
                        </h2>
                        <p className="font-inter text-sm md:text-base leading-[1.9] text-white/70 max-w-lg fade-up-text">
                            {muccoPisanoData.tagli.bodyText}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── L'ECCELLENZA ESSICCATA ────────────────────────────────── */}
            <section className="relative min-h-[80vh] bg-[#F3EFE7] px-[8vw] py-[15vh] flex flex-col justify-center items-center text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-6 block fade-up-text">
                        {muccoPisanoData.essiccata.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-7xl leading-[0.9] text-[var(--mucco-pisano)] mb-10 fade-up-text">
                        {muccoPisanoData.essiccata.titleHtml}
                    </h2>
                    <p className="font-inter text-base md:text-lg leading-[1.8] text-[var(--mucco-pisano)]/80 mb-16 fade-up-text">
                        {muccoPisanoData.essiccata.bodyText}
                    </p>

                    {/* Foto */}
                    <div className="w-full relative h-[45vh] overflow-hidden rounded-sm fade-up-text">
                        <Image
                            src="/images/mucco-pisano.png"
                            alt="Mucco Pisano — Eccellenza Essiccata"
                            fill
                            className="parallax-img"
                            style={{ objectFit: 'cover', objectPosition: 'center 30%', scale: '1.15' }}
                            sizes="80vw"
                        />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(243,239,231,0.12)' }} />
                    </div>
                </div>
            </section>

            {/* ── LA CUCINA ITINERANTE ──────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

                {/* Foto di sfondo con parallax */}
                <div className="absolute inset-0 z-0" style={{ overflow: 'hidden' }}>
                    <Image
                        src="/images/cucina-nomade.png"
                        alt="Cucina Nomade Itinerante"
                        fill
                        className="parallax-img"
                        style={{ objectFit: 'cover', scale: '1.15' }}
                        sizes="100vw"
                    />
                </div>

                {/* Overlay scuro */}
                <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(20,15,10,0.65)' }} />

                <div className="relative z-10 text-center px-[5vw] w-full max-w-5xl">
                    <h2 className="font-playfair text-6xl md:text-[8rem] leading-[0.8] text-[#F3EFE7] mb-8 fade-up-text">
                        {muccoPisanoData.cucina.titleHtml}
                    </h2>
                    <p className="font-inter text-lg text-[#F3EFE7]/80 max-w-xl mx-auto mb-16 fade-up-text font-light tracking-wide">
                        {muccoPisanoData.cucina.bodyText}
                    </p>

                    <div className="fade-up-text">
                        <button
                            onClick={() => setConciergeOpen(true, 'cucina-nomade')}
                            className="group relative inline-flex items-center justify-center px-12 py-5 font-inter text-sm tracking-[0.2em] text-[#F3EFE7] uppercase overflow-hidden rounded-full border border-[rgba(243,239,231,0.3)] transition-all hover:border-[#F3EFE7] bg-white/5 backdrop-blur-sm"
                        >
                            <span className="relative z-10 group-hover:text-[var(--terra-nera)] transition-colors duration-500">{muccoPisanoData.cucina.ctaLabel}</span>
                            <div className="absolute inset-0 bg-[#F3EFE7] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
                        </button>
                    </div>
                </div>
            </section>

        </main>
    );
}
