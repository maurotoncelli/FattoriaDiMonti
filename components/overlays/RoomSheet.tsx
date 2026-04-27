'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import { getOspitalitaData } from '@/lib/data/ospitalita';

// SVG Icon Helper
const getIcon = (name: string) => {
    switch (name) {
        case 'bed':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></svg>;
        case 'bath':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" /><line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" /></svg>;
        case 'wind':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>;
        case 'sun':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
        case 'towel':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8C21 8.5 18 8 15.5 8" /><path d="M15.5 15H5" /><path d="M15.5 3v12" /></svg>;
        case 'hairdryer':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 16 3-8-3-8h16l-3 8 3 8zM15 8h.01" /><path d="M11 22v-6" /></svg>;
        case 'book':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>;
        case 'leaf':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 22 12 12" /></svg>;
        case 'heart':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>;
        case 'moon':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9z" /></svg>;
        case 'sparkle':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>;
        case 'sunset':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 10v2" /><path d="M2 22h20" /><path d="m4.93 10.93 1.41 1.41" /><path d="m17.66 12.34 1.41-1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m22 22-5-5-2.5 2.5L12 17l-2.5 2.5L7 17l-5 5" /><circle cx="12" cy="14" r="2" /></svg>;
        case 'expand':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 3 14 10" /><path d="M21 3v6" /><path d="M21 3h-6" /><path d="M3 21l7-7" /><path d="M3 21v-6" /><path d="M3 21h6" /></svg>;
        case 'check':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6 9 17l-5-5" /></svg>;
        default:
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>;
    }
};

export default function RoomSheet() {
    const t = useTranslations();
    const ospData = getOspitalitaData(t);
    const { isRoomSheetOpen, selectedRoomId, setRoomSheetOpen, setConciergeOpen } = useAppStore();

    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    const [activePhotoIdx, setActivePhotoIdx] = useState(0);

    const activeRoom = selectedRoomId ? ospData.sections.stanze.rooms.find(r => r.id === selectedRoomId) : null;

    useEffect(() => {
        if (!overlayRef.current || !contentRef.current || !bgRef.current) return;

        if (isRoomSheetOpen) {
            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.fromTo(
                bgRef.current,
                { yPercent: 100 },
                { yPercent: 0, duration: 1.2, ease: 'power4.inOut' }
            );

            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
            );
        } else {
            gsap.to(contentRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                ease: 'power3.in'
            });

            gsap.to(bgRef.current, {
                yPercent: 100,
                duration: 0.9,
                ease: 'power4.inOut',
                delay: 0.2,
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                    setActivePhotoIdx(0);
                }
            });
        }
    }, [isRoomSheetOpen]);

    if (!activeRoom) return null;

    const handleNextPhoto = () => {
        setActivePhotoIdx((prev) => (prev + 1) % activeRoom.photos.length);
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[110] hidden flex-col w-screen h-screen overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('Overlays.roomSheet.ariaLabel')}
        >
            {/* Split Screen Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none flex" ref={bgRef}>
                <div className="w-full h-full" style={{ backgroundColor: activeRoom.bgColor }}></div>
            </div>

            {/* Close Button */}
            <button
                onClick={() => setRoomSheetOpen(false)}
                className="absolute top-5 right-5 md:top-8 md:right-8 z-50 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity"
                aria-label={t('Overlays.roomSheet.closeAria')}
                style={{ color: '#111' }}
            >
                {t('Overlays.roomSheet.closeLabel')}
            </button>

            {/* Scrollable Content */}
            <div
                ref={contentRef}
                className="relative z-10 w-full h-full overflow-y-auto no-scrollbar"
                style={{ color: '#111' }}
            >
                {/* Hero Section */}
                <div className="w-full min-h-[85vh] md:min-h-[100vh] flex flex-col md:flex-row border-b border-black/10">
                    
                    {/* Left: Info */}
                    <div className="w-full md:w-1/3 p-8 md:p-16 flex flex-col justify-center">
                        <div className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-6 font-medium">
                            {t('Overlays.roomSheet.eyebrow')}
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-light mb-8 italic" style={{ fontFamily: 'var(--font-serif)' }}>
                            {activeRoom.name}
                        </h2>
                        
                        <p className="text-lg leading-relaxed opacity-80 mb-12 max-w-sm">
                            {activeRoom.description}
                        </p>

                        <div className="flex flex-col gap-5 border-t border-black/10 pt-8 mt-auto">
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 uppercase tracking-widest text-[10px]">{t('Overlays.roomSheet.specBed')}</span>
                                <span className="font-medium">{activeRoom.bedType}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 uppercase tracking-widest text-[10px]">{t('Overlays.roomSheet.specSurface')}</span>
                                <span className="font-medium">{activeRoom.surface}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 uppercase tracking-widest text-[10px]">{t('Overlays.roomSheet.specFloor')}</span>
                                <span className="font-medium">{activeRoom.floor}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 uppercase tracking-widest text-[10px]">{t('Overlays.roomSheet.specView')}</span>
                                <span className="font-medium">{activeRoom.view}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Interactive Gallery */}
                    <div className="w-full md:w-2/3 relative min-h-[50vh] md:min-h-full cursor-pointer overflow-hidden border-l border-black/10" onClick={handleNextPhoto}>
                        {activeRoom.photos.map((photo, idx) => (
                            <Image
                                key={idx}
                                src={photo.src}
                                alt={photo.alt || `Stanza ${activeRoom.name}`}
                                fill
                                className="object-cover transition-opacity duration-700 ease-in-out"
                                style={{ opacity: activePhotoIdx === idx ? 1 : 0 }}
                                priority={idx === 0}
                            />
                        ))}
                        
                        {/* Photo Indicator */}
                        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex gap-2 z-20">
                            {activeRoom.photos.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-[2px] transition-all duration-300 ${activePhotoIdx === idx ? 'w-8 bg-white' : 'w-4 bg-white/40'}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full max-w-6xl mx-auto px-8 md:px-16 py-16 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
                        
                        {/* Narrative */}
                        <div className="col-span-1 md:col-span-6">
                            <h3 className="text-3xl md:text-4xl mb-8 font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                                {activeRoom.name}
                            </h3>
                            <div className="text-lg leading-relaxed opacity-80" dangerouslySetInnerHTML={{ __html: activeRoom.longDescription?.replace(/\n/g, '<br/>') || '' }} />
                            
                            <div className="mt-16">
                                <h4 className="text-xs tracking-[0.2em] uppercase opacity-50 mb-6">{t('Overlays.roomSheet.sectionHighlights')}</h4>
                                <ul className="flex flex-col gap-4">
                                    {activeRoom.highlights?.map((hl, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <span className="opacity-40">{getIcon('check')}</span>
                                            <span className="text-lg opacity-80">{hl}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="col-span-1 md:col-span-5 md:col-start-8">
                            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-white/50">
                                <h4 className="text-xs tracking-[0.2em] uppercase opacity-50 mb-8">{t('Overlays.roomSheet.sectionAmenities')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                    {activeRoom.amenities?.map((amenity, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 mb-1">
                                                <div className="w-4 h-4 opacity-70">
                                                    {getIcon(amenity.icon)}
                                                </div>
                                            </span>
                                            <span className="text-sm font-medium opacity-80">{amenity.label}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-black/10">
                                    <h4 className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-4">{t('Overlays.roomSheet.sharedAmenities')}</h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {(t.raw('Overlays.roomSheet.sharedAmenitiesList') as string[]).map((item, i) => (
                                            <li key={i} className="text-xs opacity-70 flex items-center gap-2">
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    setRoomSheetOpen(false);
                                    setTimeout(() => setConciergeOpen(true), 800);
                                }}
                                className="mt-8 w-full group relative overflow-hidden bg-[#1D1B1A] text-white py-5 px-8 rounded-full flex items-center justify-center transition-all duration-500 hover:bg-[#2A2726] shadow-xl hover:shadow-2xl"
                            >
                                <span className="relative z-10 text-xs tracking-[0.2em] uppercase">{t('Overlays.roomSheet.ctaBook')}</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
