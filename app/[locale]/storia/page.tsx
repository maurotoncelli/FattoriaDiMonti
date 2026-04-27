"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useTranslations } from 'next-intl';
import { getStoriaData } from '@/lib/data/storia';
import { getFilieraData } from '@/lib/data/filiera';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function StoriaPage() {
    const containerRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const storiaData = getStoriaData(t);
    const filieraData = getFilieraData(t);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Background filigrana fade-in
            gsap.to(".bg-filigrana", {
                opacity: 0.15,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: ".text-buontalenti",
                    start: "top 60%",
                    end: "bottom 40%",
                    toggleActions: "play reverse play reverse",
                }
            });

            // Unified Parallax effect on images
            gsap.utils.toArray('.parallax-img').forEach((el: any) => {
                const speedY = el.dataset.speed ? parseFloat(el.dataset.speed) : 15;
                const startY = el.dataset.start ? parseFloat(el.dataset.start) : -15;

                gsap.fromTo(el, 
                    { yPercent: startY },
                    {
                        yPercent: speedY,
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
            
            // Text reveals individually on scroll
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { 
                        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 85%" }
                    }
                );
            });

            gsap.utils.toArray('.storia-gallery-card').forEach((el: any) => {
                gsap.fromTo(el,
                    { x: 50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 90%" }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen relative z-10 text-[var(--mucco-pisano)] bg-[var(--tufo)] overflow-hidden font-inter">
            
            {/* Background Image / Filigrana */}
            <div className="bg-filigrana fixed inset-0 pointer-events-none z-0 opacity-0 mix-blend-multiply flex items-center justify-center grayscale">
                <div className="relative w-full h-full opacity-30 scale-[1.15] transform-gpu will-change-transform">
                    <Image 
                        src={storiaData.images.primary.src}
                        alt="Background Texture"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                </div>
            </div>

            {/* Magnetic Close Button */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink 
                    href={storiaData.closeUrl}
                    bgColor="#ECE8DF"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--mucco-pisano)] bg-[var(--tufo)]/80 backdrop-blur-md transition-all hover:bg-[var(--mucco-pisano)] hover:scale-105"
                >
                    <span className="font-inter text-lg text-[var(--mucco-pisano)] transition-colors group-hover:text-[var(--tufo)]">
                        {storiaData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10 pt-[20vh] px-[8vw] lg:px-[10vw] pb-[16vh]">
                
                {/* Left Col - Text */}
                <div className="col-span-1 lg:col-span-5 content-col pt-[5vh] lg:pt-[10vh]">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-12 block fade-up-text">
                        {storiaData.chapterLabel}
                    </span>
                    
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.85] mb-20 text-[var(--mucco-pisano)] fade-up-text">
                        {storiaData.titleHtml}
                    </h1>

                    <div className="font-inter text-lg lg:text-xl leading-[1.8] space-y-10 opacity-90 max-w-lg text-buontalenti">
                        <p className="fade-up-text">{storiaData.paragraphs[0]}</p>
                        
                        <p className="fade-up-text">{storiaData.paragraphs[1]}</p>
                        
                        <p className="fade-up-text text-2xl font-playfair italic text-[var(--olive)] my-16 border-l-2 border-[var(--olive)]/30 pl-8 leading-snug">
                            {storiaData.quote}
                        </p>
                        
                        <p className="fade-up-text">{storiaData.paragraphs[2]}</p>
                        
                        {/* Easter Egg Trigger Concept in Text */}
                        <p className="mt-24 text-base opacity-60">
                            {storiaData.legendText}
                            <span className="underline decoration-dotted decoration-[var(--olive)]/50 cursor-help transition-all hover:text-[var(--olive)] group relative">
                                {storiaData.legendLink.text}
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--mucco-pisano)] text-[var(--tufo)] px-3 py-1 rounded">
                                    {storiaData.legendLink.tooltip}
                                </span>
                            </span>
                            {storiaData.legendSuffix}
                        </p>
                    </div>
                </div>
                
                {/* Right Col - Images */}
                <div className="col-span-1 lg:col-span-7 mt-20 lg:mt-0 lg:pt-[15vh]">
                    <div className="image-container relative w-full aspect-[3/4] overflow-hidden rounded-sm filter sepia-[0.2] contrast-[1.1]">
                        <Image 
                            src={storiaData.images.primary.src}
                            alt={storiaData.images.primary.alt}
                            fill
                            className="parallax-img object-cover editorial-image scale-[1.3] transform-gpu will-change-transform"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                    
                    {/* Second smaller overlapping image */}
                    <div className="image-container w-3/4 lg:w-2/3 aspect-square relative ml-auto -mt-24 lg:-mt-40 overflow-hidden rounded-sm shadow-2xl filter sepia-[0.3] contrast-[1.1] grayscale-[0.2]">
                        <Image 
                            src={storiaData.images.secondary.src}
                            alt={storiaData.images.secondary.alt}
                            fill
                            data-speed="10"
                            data-start="-25"
                            className="parallax-img object-cover scale-[1.4] transform-gpu will-change-transform"
                            sizes="(max-width: 1024px) 80vw, 33vw"
                        />
                    </div>
                </div>

            </div>

            <section className="relative z-10 px-[8vw] lg:px-[10vw] pb-[20vh]">
                <div className="grid grid-cols-1 gap-12 border-y border-[var(--mucco-pisano)]/15 py-[12vh] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div className="fade-up-text">
                        <span className="font-inter text-xs tracking-[0.3em] text-[var(--olive)] uppercase mb-8 block">
                            {filieraData.acts.act1.label}
                        </span>
                        <h2 className="font-playfair text-5xl md:text-7xl leading-[0.98] text-[var(--mucco-pisano)]">
                            {filieraData.acts.act1.titleHtml}
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <p className="fade-up-text font-inter text-lg md:text-xl leading-[1.9] text-[var(--mucco-pisano)]/80">
                            {filieraData.acts.act1.introText}
                        </p>
                        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] border border-[var(--mucco-pisano)]/10 bg-[var(--mucco-pisano)]/10 md:grid-cols-2">
                            {filieraData.acts.act2.timelineSteps.map((step, index) => (
                                <article key={step.title} className="fade-up-text bg-[var(--tufo)]/85 p-6">
                                    <span className="font-inter text-[9px] tracking-[0.25em] text-[var(--olive)] uppercase">
                                        {t('UI.stepPrefix')} 0{index + 1}
                                    </span>
                                    <h3 className="mt-4 font-playfair text-2xl italic text-[var(--mucco-pisano)]">
                                        {step.title.replace(/^\d+\.\s*/, '')}
                                    </h3>
                                    <p className="mt-4 font-inter text-sm leading-[1.75] text-[var(--mucco-pisano)]/68">
                                        {step.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-[10vh]">
                    <div className="mb-10 max-w-4xl fade-up-text">
                        <span className="font-inter text-xs tracking-[0.3em] text-[var(--olive)] uppercase mb-6 block">
                            {filieraData.acts.act3.label}
                        </span>
                        <h2 className="font-playfair text-5xl md:text-6xl leading-[1.05] text-[var(--mucco-pisano)]">
                            {filieraData.acts.act3.titleHtml}
                        </h2>
                    </div>

                    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {filieraData.acts.act3.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="fade-up-text font-inter text-base md:text-lg leading-[1.85] text-[var(--mucco-pisano)]/75">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="-mx-[8vw] overflow-x-auto px-[8vw] pb-6 lg:-mx-[10vw] lg:px-[10vw]">
                        <div className="flex w-max gap-5">
                            {filieraData.acts.act3.gallery.map((item, index) => (
                                <figure
                                    key={`${item.caption}-${index}`}
                                    className="storia-gallery-card w-[76vw] max-w-[520px] flex-shrink-0 md:w-[38vw]"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[var(--mucco-pisano)]/10">
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 76vw, 38vw"
                                        />
                                    </div>
                                    <figcaption className="mt-4 font-inter text-[10px] uppercase tracking-[0.2em] text-[var(--olive)]">
                                        {item.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
