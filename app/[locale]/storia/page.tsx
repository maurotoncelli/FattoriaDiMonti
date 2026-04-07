"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useTranslations } from 'next-intl';
import { getStoriaData } from '@/lib/data/storia';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function StoriaPage() {
    const containerRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const storiaData = getStoriaData(t);

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10 pt-[20vh] px-[8vw] lg:px-[10vw] pb-[25vh]">
                
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
        </main>
    );
}
