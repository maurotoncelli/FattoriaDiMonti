"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useTranslations } from 'next-intl';
import { getCerealiData } from '@/lib/data/cereali';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CerealiPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    const cerealiData = getCerealiData(t);

    useEffect(() => {
        let ctx = gsap.context(() => {
            
            // Universal fade up text
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
                );
            });

            // Background Parallax
            gsap.fromTo(".parallax-bg",
                { yPercent: -10 },
                {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                    }
                }
            );

            // The Seasonal Transition (Spring to Summer)
            // Fades out the green overlay as the user scrolls through the middle section
            ScrollTrigger.create({
                trigger: ".transition-trigger",
                start: "top 60%",
                end: "bottom 40%",
                scrub: 1, // Smooth scrub
                animation: gsap.to(".spring-overlay", { opacity: 0, ease: "none" })
            });
            
            // Second transition: darken background further for the bottom text visibility
            ScrollTrigger.create({
                trigger: ".final-section",
                start: "top 80%",
                end: "bottom bottom",
                scrub: true,
                animation: gsap.to(".base-darkening", { backgroundColor: "rgba(0,0,0,0.7)", ease: "none" })
            });



        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen relative font-inter bg-black">
            
            {/* Fixed Background with Seasonal Overlay */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <Image 
                    src={cerealiData.images.background.src}
                    alt={cerealiData.images.background.alt}
                    fill 
                    className="object-cover scale-110 parallax-bg" 
                    quality={90}
                    priority
                />
                
                {/* The Spring Green Overlay (Mix blend color tints the image below) */}
                <div className="absolute inset-0 bg-[#5d7031] mix-blend-color opacity-80 spring-overlay"></div>
                
                {/* Base Darkening for Legibility */}
                <div className="absolute inset-0 bg-black/30 base-darkening transition-colors duration-1000"></div>
            </div>

            {/* Close Button */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink 
                    href={cerealiData.closeUrl}
                    bgColor="#2B2420"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--tufo)] bg-black/30 backdrop-blur-md transition-all hover:bg-[var(--tufo)] hover:scale-105"
                >
                    <span className="font-inter text-lg text-[var(--tufo)] transition-colors group-hover:text-[var(--terra-nera)]">
                        {cerealiData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 text-[var(--tufo)]">
                
                {/* Hero / Spring Section */}
                <div className="h-screen flex flex-col items-center justify-center text-center px-[8vw] lg:px-[20vw] pt-[10vh]">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--tufo)] uppercase mb-8 block fade-up-text">
                        {cerealiData.hero.label}
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[8rem] leading-[0.85] text-[var(--tufo)] mb-12 fade-up-text drop-shadow-lg">
                        {cerealiData.hero.titleHtml}
                    </h1>
                    <p className="text-lg lg:text-xl opacity-90 font-light leading-relaxed max-w-2xl fade-up-text drop-shadow-md">
                        {cerealiData.hero.introText}
                    </p>
                </div>

                {/* Transition Trigger Area (The long scroll where color changes) */}
                <div className="transition-trigger py-[30vh] px-[8vw] lg:px-[15vw] flex flex-col gap-[40vh] max-w-6xl mx-auto">
                    
                    <div className="fade-up-text border-l border-[var(--tufo)]/30 pl-8 max-w-xl">
                        <p className="font-playfair text-3xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg">
                            {cerealiData.transition.quote1}
                        </p>
                    </div>

                    <div className="fade-up-text border-r border-[var(--tufo)]/30 pr-8 max-w-xl self-end text-right">
                        <p className="font-playfair text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--tufo)] drop-shadow-lg">
                            {cerealiData.transition.quote2}
                        </p>
                    </div>

                </div>

                {/* Final Area / Philosophy */}
                <div className="final-section min-h-[80vh] flex flex-col justify-center items-center text-center px-[8vw] lg:px-[20vw] pb-[20vh] mt-[20vh] bg-gradient-to-t from-[var(--terra-nera)] to-transparent pt-32">
                    <h2 className="font-playfair text-5xl md:text-6xl text-[var(--tufo)] mb-12 fade-up-text">
                        {cerealiData.filosofia.title}
                    </h2>
                    
                    <div className="font-inter text-lg lg:text-xl opacity-90 leading-relaxed space-y-8 max-w-3xl fade-up-text text-left">
                        {cerealiData.filosofia.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                        <p className="text-xl lg:text-2xl font-playfair italic pt-4">
                            {cerealiData.filosofia.conclusionHtml}
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
