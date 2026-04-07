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
    const t = useTranslations();
    const muccoPisanoData = getMuccoPisanoData(t);

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
                        <p className="font-inter text-sm md:text-base leading-[1.9] text-white/70 mb-12 max-w-lg fade-up-text">
                            {muccoPisanoData.tagli.bodyText}
                        </p>

                        <div className="fade-up-text">
                            <button
                                onClick={() => setConciergeOpen(true, 'default')}
                                className="font-inter text-xs tracking-[0.2em] text-white uppercase border-b border-[var(--olive)] pb-2 hover:text-[var(--olive)] transition-colors inline-block"
                            >
                                {muccoPisanoData.tagli.ctaLabel}
                            </button>
                        </div>
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
