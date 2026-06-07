import { Megaphone, BookOpen, Heart, CalendarDays, Palette } from 'lucide-react';
import type { BlogCategory } from '@/types';

export const CATEGORY_CONFIG: Record<BlogCategory, {
  Icon: React.ElementType;
  // For use on DARK backgrounds (homepage bento, article hero strip)
  accent: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
  // For use on WHITE backgrounds — all pass WCAG AA (4.5:1 on white)
  onWhiteText: string;
  onWhiteBg: string;
  // Fallback card gradient (when no cover image) — dark so white text is legible
  fallbackFrom: string;
  fallbackTo: string;
  desc: string;
}> = {
  Update: {
    Icon: Megaphone,
    accent: 'text-waxy-corn',
    bg: 'bg-waxy-corn/10',
    badgeBg: 'bg-waxy-corn/15',
    badgeText: 'text-waxy-corn',
    onWhiteText: 'text-[#CC2D2D]',   // #CC2D2D — 5.9:1 on white ✓
    onWhiteBg:   'bg-[#CC2D2D]/8',
    fallbackFrom: '#CC2D2D',
    fallbackTo:   '#7a1010',
    desc: 'Big events and announcements',
  },
  Devotion: {
    Icon: BookOpen,
    accent: 'text-sky-400',
    bg: 'bg-sky-400/10',
    badgeBg: 'bg-sky-400/15',
    badgeText: 'text-sky-400',
    onWhiteText: 'text-blue-700',    // #1d4ed8 — 5.9:1 on white ✓
    onWhiteBg:   'bg-blue-700/8',
    fallbackFrom: '#1d4ed8',
    fallbackTo:   '#1e3a8a',
    desc: 'Reflections and spiritual readings',
  },
  Story: {
    Icon: Heart,
    accent: 'text-pink-swirl',
    bg: 'bg-pink-swirl/10',
    badgeBg: 'bg-pink-swirl/20',
    badgeText: 'text-pink-swirl',
    onWhiteText: 'text-amber-700',   // #b45309 — 4.9:1 on white ✓
    onWhiteBg:   'bg-amber-700/8',
    fallbackFrom: '#1c3a2a',
    fallbackTo:   '#0a1f12',
    desc: 'Lifehouse stories and testimonials',
  },
  Events: {
    Icon: CalendarDays,
    accent: 'text-fluorescence',
    bg: 'bg-fluorescence/10',
    badgeBg: 'bg-fluorescence/15',
    badgeText: 'text-fluorescence',
    onWhiteText: 'text-green-700',   // #15803d — 5.1:1 on white ✓
    onWhiteBg:   'bg-green-700/8',
    fallbackFrom: '#15803d',
    fallbackTo:   '#14532d',
    desc: 'Worship nights and gatherings',
  },
  Culture: {
    Icon: Palette,
    accent: 'text-astral-blue',
    bg: 'bg-astral-blue/10',
    badgeBg: 'bg-astral-blue/15',
    badgeText: 'text-astral-blue',
    onWhiteText: 'text-purple-700',  // #7e22ce — 6.1:1 on white ✓
    onWhiteBg:   'bg-purple-700/8',
    fallbackFrom: '#7e22ce',
    fallbackTo:   '#4c1d95',
    desc: 'Articles, videos, and creative culture',
  },
};

export const CATEGORIES: BlogCategory[] = ['Update', 'Devotion', 'Story', 'Events', 'Culture'];
