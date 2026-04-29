'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface RoomFloorPlanProps {
    roomId: string;
    className?: string;
}

/**
 * Renders a detailed architectural floor plan (blueprint) for each room.
 * Uses thicker lines (1.8px) in the section's red color for a bold, technical feel.
 */
export default function RoomFloorPlan({ roomId, className = "" }: RoomFloorPlanProps) {
    const t = useTranslations('Overlays.roomSheet');
    
    // Technical style tokens
    const strokeColor = "var(--argilla-ferrosa)";
    const strokeWidth = "1.8";
    const wallWidth = "4"; // For double-wall effect
    const dashArray = "3 3";

    const renderPlan = () => {
        switch (roomId) {
            case 'avorio':
                return (
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Double Walls (Outer) */}
                        <rect x="10" y="10" width="180" height="130" stroke={strokeColor} strokeWidth={strokeWidth} />
                        <rect x="14" y="14" width="172" height="122" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                        
                        {/* En-suite Bathroom */}
                        <rect x="130" y="10" width="60" height="70" stroke={strokeColor} strokeWidth={strokeWidth} />
                        <circle cx="160" cy="30" r="10" stroke={strokeColor} strokeWidth="1" opacity="0.4" /> {/* Sink */}
                        
                        {/* Main Bed (King Size) */}
                        <rect x="60" y="40" width="60" height="80" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dashArray} rx="2" />
                        <path d="M60 55 H120" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
                        
                        {/* Windows with architectural lines */}
                        <rect x="70" y="7" width="50" height="6" fill={strokeColor} opacity="0.3" />
                        <rect x="70" y="137" width="50" height="6" fill={strokeColor} opacity="0.3" />
                        
                        {/* Door Swing */}
                        <path d="M10 110 Q45 110 45 140" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                );
            case 'verde':
                return (
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Walls */}
                        <rect x="20" y="10" width="160" height="130" stroke={strokeColor} strokeWidth={strokeWidth} />
                        <rect x="24" y="14" width="152" height="122" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                        
                        {/* Bathroom */}
                        <rect x="20" y="10" width="60" height="60" stroke={strokeColor} strokeWidth={strokeWidth} />
                        
                        {/* Split Beds configuration */}
                        <rect x="90" y="35" width="30" height="75" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dashArray} rx="1" />
                        <rect x="125" y="35" width="30" height="75" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dashArray} rx="1" />
                        
                        {/* Reading Chair / Nook */}
                        <path d="M35 105 H55 V125 H35 Z" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
                        <circle cx="45" cy="115" r="8" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
                        
                        {/* Door */}
                        <path d="M180 110 Q145 110 145 140" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                );
            case 'rosa':
                return (
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Walls (Intimate L-Shape) */}
                        <path d="M40 10 H170 V100 H120 V140 H40 Z" stroke={strokeColor} strokeWidth={strokeWidth} />
                        
                        {/* Small En-suite */}
                        <rect x="120" y="10" width="50" height="60" stroke={strokeColor} strokeWidth={strokeWidth} />
                        
                        {/* French Bed */}
                        <rect x="60" y="35" width="50" height="70" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dashArray} rx="2" />
                        
                        {/* Window */}
                        <rect x="80" y="7" width="40" height="6" fill={strokeColor} opacity="0.3" />
                        
                        {/* Door */}
                        <path d="M40 110 Q70 110 70 140" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                );
            case 'albicocca':
                return (
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Outer Walls - Large Panoramic */}
                        <rect x="10" y="10" width="180" height="130" stroke={strokeColor} strokeWidth={strokeWidth} />
                        <rect x="14" y="14" width="172" height="122" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
                        
                        {/* Large Bathroom Area */}
                        <rect x="10" y="10" width="70" height="70" stroke={strokeColor} strokeWidth={strokeWidth} />
                        
                        {/* King Bed with nightstands hint */}
                        <rect x="95" y="40" width="65" height="80" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dashArray} rx="2" />
                        <rect x="85" y="40" width="8" height="12" stroke={strokeColor} strokeWidth="0.5" opacity="0.4" />
                        <rect x="162" y="40" width="8" height="12" stroke={strokeColor} strokeWidth="0.5" opacity="0.4" />
                        
                        {/* Door */}
                        <path d="M10 110 Q45 110 45 140" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
                        
                        {/* Large Panoramic Windows */}
                        <rect x="188" y="30" width="6" height="90" fill={strokeColor} opacity="0.3" />
                        <rect x="90" y="137" width="75" height="6" fill={strokeColor} opacity="0.3" />
                    </svg>
                );
            default:
                return <div className="text-[10px] opacity-20">Layout pending...</div>;
        }
    };

    return (
        <div className={`relative ${className}`} style={{ width: '70%', margin: '3rem auto' }}>
            <div className="text-[10px] tracking-[0.35em] uppercase opacity-40 mb-5 font-medium text-center">
                {t('labelSpace')}
            </div>
            <div className="w-full aspect-[4/3] flex items-center justify-center p-6 bg-[var(--argilla-ferrosa)]/5 rounded-sm">
                <div className="w-full h-full opacity-90">
                    {renderPlan()}
                </div>
            </div>
        </div>
    );
}
