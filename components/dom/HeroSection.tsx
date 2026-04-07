'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/useAppStore';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const titleWords = t.raw('Home.hero.titleWords') as string[];

    const heroImageRef = useRef<HTMLDivElement>(null);
    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);

    useEffect(() => {
        if (!isPreloaderComplete) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.2 });

            if (titleRef.current) {
                const words = titleRef.current.querySelectorAll('.word');
                tl.fromTo(
                    words,
                    { y: '110%', rotationZ: 3, opacity: 0 },
                    {
                        y: '0%',
                        rotationZ: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.08,
                        ease: 'expo.out',
                    }
                );
            }
            if (subtitleRef.current) {
                tl.fromTo(
                    subtitleRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );
            }
            if (scrollHintRef.current) {
                tl.fromTo(
                    scrollHintRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6 },
                    '-=0.2'
                );
            }

            // Ken Burns — slow zoom loop
            if (heroImageRef.current) {
                gsap.fromTo(heroImageRef.current,
                    { scale: 1 },
                    {
                        scale: 1.08,
                        duration: 18,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    }
                );

                // Scroll parallax on hero image
                gsap.to(heroImageRef.current, {
                    yPercent: 25,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }
        });

        return () => ctx.revert();
    }, [isPreloaderComplete]);

    return (
        <section
            ref={sectionRef}
            id="00-hero"
            data-section-label={t('UI.sectionLabels.hero')}
            style={{
                position: 'relative',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 8vw',
                overflow: 'hidden',
            }}
            aria-label="Hero"
        >
            {/* Background Image Placeholder */}
            <div
                ref={heroImageRef}
                data-webgl-media="true"
                data-effect-type="displacement"
                data-texture-src="/images/hero-drone.png"
                id="media-hero-background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    pointerEvents: 'none',
                    opacity: 0.6,
                    willChange: 'transform',
                    transformOrigin: 'center center',
                }}
            />
            {/* Main title */}
            <h1
                ref={titleRef}
                style={{
                    fontFamily: 'var(--font-playfair), var(--font-display)',
                    fontSize: 'clamp(2.8rem, 9vw, 9rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.02em',
                    color: 'var(--mucco-pisano)',
                    textAlign: 'center',
                    overflow: 'hidden',
                    willChange: 'transform',
                }}
            >
                {titleWords.map((word, i) => (
                    <span
                        key={i}
                        className="text-reveal-wrap"
                        style={{ display: 'block' }}
                    >
                        <span className="word" style={{ display: 'inline-block', opacity: 0 }}>
                            {word}
                        </span>
                    </span>
                ))}
            </h1>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                style={{
                    fontFamily: 'var(--font-inter), var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--olive)',
                    marginTop: '3rem',
                    opacity: 0,
                }}
            >
                {t('Home.hero.subtitle')}
            </p>

            {/* Scroll hint */}
            <div
                ref={scrollHintRef}
                style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0,
                }}
            >
                <span className="label" style={{ color: 'var(--olive)' }}>
                    {t('Home.hero.scrollHint')}
                </span>
                {/* Animated scroll line */}
                <div
                    style={{
                        width: 1,
                        height: 40,
                        background: 'var(--olive)',
                        animation: 'scrollPulse 2s ease-in-out infinite',
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }
      `}</style>
        </section>
    );
}
