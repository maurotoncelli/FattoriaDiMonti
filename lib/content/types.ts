/**
 * lib/content/types.ts
 *
 * TypeScript interfaces for all site content.
 * These serve as the canonical data contract between:
 *   1. The current locale-aware data layer (messages JSON via next-intl)
 *   2. The future CMS layer (Sanity GROQ queries)
 *
 * When Sanity is integrated, each interface maps to a Sanity document type.
 * Field names are intentionally CMS-neutral (no next-intl-specific conventions).
 */

import React from 'react';

// ─── Shared Primitives ────────────────────────────────────────────────────────

export interface MediaItem {
  src: string;
  alt: string;
}

export interface MediaWithOverlay extends MediaItem {
  overlayText?: string;
}

export interface TimelineStep {
  title: string;
  text: string;
}

export interface GalleryItem extends MediaItem {
  caption: string;
}

export interface Award {
  year: string;
  name: string;
}

export interface CtaConfig {
  label: string;
  href?: string;
  action?: string;
  actionTarget?: string;
}

// ─── Home Content ─────────────────────────────────────────────────────────────

export interface HeroContent {
  titleWords: string[];
  subtitle: string;
  scrollHint: string;
  media: { src: string };
  sectionLabel: string;
}

export interface TerroirContent {
  sectionLabel: string;
  titleHtml: React.ReactNode;
  introText: React.ReactNode;
  villaMedia: { alt: string; proxyLabel: string; proxyTags: string; src: string };
  renaissanceLabel: string;
  historyText: React.ReactNode;
  mediciQuote: string;
  cta: { label: string; href: string };
}

export interface ProductSlideContent {
  id: string;
  label: string;
  title: string;
  titleItalic?: string;
  body: React.ReactNode;
  extra?: React.ReactNode;
  cta: CtaConfig;
  bgColor?: string;
  theme?: 'light' | 'dark';
  media: { webgl: boolean; effectType: string; textureSrc: string };
}

export interface HospitalityContent {
  sectionLabel: string;
  heroLabel: string;
  heroItalic: string;
  stats: { value: string; unit: string; label: string }[];
  quote: string;
  amenitiesPills: string[];
  video: { src: string; alt: string; previewText: string };
  columns: {
    day: { label: string; text: React.ReactNode };
    night: { label: string; text: React.ReactNode; media: { alt: string; previewText: string } };
  };
  amenities: { title: string; items: string[] };
  cta: { label: string; href: string };
  cta2: { label: string };
  images: { panoramic: { src: string; alt: string }; day: { src: string; alt: string } };
}

// ─── Storia ───────────────────────────────────────────────────────────────────

export interface StoriaContent {
  closeUrl: string;
  closeLabel: string;
  chapterLabel: string;
  titleHtml: React.ReactNode;
  paragraphs: React.ReactNode[];
  quote: React.ReactNode;
  legendText: React.ReactNode;
  legendLink: { text: string; tooltip: string };
  legendSuffix: string;
  images: { primary: MediaItem; secondary: MediaItem };
}

// ─── Mucco Pisano ─────────────────────────────────────────────────────────────

export interface MuccoPisanoContent {
  closeUrl: string;
  closeLabel: string;
  hero: { label: string; titleHtml: React.ReactNode; introText: string; images: { background: MediaItem } };
  caratteristiche: {
    label: string;
    quoteHtml: React.ReactNode;
    items: { title: string; body: string }[];
  };
  tagli: { label: string; titleHtml: React.ReactNode; bodyText: string; ctaLabel: string; images: { primary: MediaItem } };
  essiccata: { label: string; titleHtml: React.ReactNode; bodyText: string; images: { primary: MediaItem } };
  cucina: { titleHtml: React.ReactNode; bodyText: string; ctaLabel: string; images: { primary: MediaItem } };
}

// ─── Olio ─────────────────────────────────────────────────────────────────────

export interface OlioContent {
  closeUrl: string;
  closeLabel: string;
  acts: {
    act1: { label: string; titleHtml: React.ReactNode; introText: string; images: { background: MediaItem } };
    act2: { label: string; titleHtml: React.ReactNode; paragraphs: string[]; images: { primary: MediaWithOverlay } };
    act3: { label: string; titleHtml: React.ReactNode; timelineSteps: TimelineStep[] };
    act4: { label: string; quoteHtml: React.ReactNode; images: { primary: MediaItem } };
    act5: { images: { background: MediaItem }; awards: Award[]; cta: { titleHtml: React.ReactNode; buttonLabel: string } };
  };
}

// ─── La Filiera ───────────────────────────────────────────────────────────────

export interface FilieraContent {
  closeUrl: string;
  closeLabel: string;
  acts: {
    act1: { label: string; titleHtml: React.ReactNode; introText: string; images: { background: MediaItem } };
    act2: { label: string; titleHtml: React.ReactNode; timelineSteps: TimelineStep[] };
    act3: { label: string; titleHtml: React.ReactNode; paragraphs: string[]; gallery: GalleryItem[] };
    act4: { label: string; quoteHtml: React.ReactNode; images: { primary: MediaItem } };
    act5: { images: { background: MediaItem }; cta: { titleHtml: React.ReactNode; buttonLabel: string; href: string } };
  };
}

// ─── Cereali ──────────────────────────────────────────────────────────────────

export interface CerealiContent {
  closeUrl: string;
  closeLabel: string;
  hero: { label: string; titleHtml: React.ReactNode; introText: string };
  transition: { quote1: string; quote2: string };
  filosofia: { title: string; paragraphs: string[]; conclusionHtml: React.ReactNode };
  images: { background: MediaItem };
}

// ─── Ospitalità ───────────────────────────────────────────────────────────────

export interface RoomContent {
  id: string;
  name: string;
  bgColor: string;
  description: string;
  photos: MediaItem[];
}

export interface OspitalitaContent {
  closeUrl: string;
  closeLabel: string;
  sections: {
    hero: { label: string; titleHtml: React.ReactNode; introText: string; images: { background: MediaItem } };
    calore: { label: string; titleHtml: React.ReactNode; paragraphs: React.ReactNode[]; images: { primary: MediaWithOverlay } };
    galleria: {
      titleHtml: React.ReactNode;
      scrollHint: string;
      items: (MediaWithOverlay & { aspect: '3/2' | '2/3' })[];
      indicator: { exploreText: string; scrollText: string };
    };
    stanze: { label: string; titleHtml: React.ReactNode; introText: string; rooms: RoomContent[] };
    osservatorio: { label: string; titleHtml: React.ReactNode; introText: string; cta: { buttonLabel: string } };
  };
}

// ─── Cucina Nomade ────────────────────────────────────────────────────────────

export interface CucinaNomadeContent {
  hero: {
    titleBig: string;
    titleSmall: string;
    videoEnabled: boolean;
    videoSrc: string;
    fallbackImage: string;
    scrollText: string;
  };
  manifesto: {
    tagline: string;
    title: string;
    paragraphs: string[];
    stats: { label: string; value: string }[];
  };
  menuGallery: {
    tagline: string;
    title: string;
    items: { id: string; name: string; description: string; image: string; type: 'text' | 'image' | 'mixed' }[];
  };
  crew: {
    tagline: string;
    title: string;
    description: string;
    members: { id: string; name: string; role: string; image: string; quote: string }[];
  };
  radar: {
    tagline: string;
    title: string;
    description: string;
    events: { id: string; date: string; location: string; description: string; coordinates: string; image?: string }[];
  };
  booking: { title: string; description: string; ctaLabel: string };
}

// ─── Preloader ────────────────────────────────────────────────────────────────

export interface PreloaderContent {
  brand: string;
  coordinates: string;
  location: string;
  minDurationMs: number;
}
