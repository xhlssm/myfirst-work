import React from 'react';
import type { Faction } from '@/store';

export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url.split('?')[0]);
}

type FactionBadgeProps = {
  faction: Faction | null;
  large?: boolean;
};

export const FactionBadge: React.FC<FactionBadgeProps> = ({ faction, large = false }) => {
  if (!faction) return null;
  const size = large ? 'text-xs px-2 py-1' : 'text-[10px] px-1.5 py-0.5';
  const styleByFaction: Record<string, string> = {
    '开发组': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    '剧情组': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    '艺术组': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    '自由人': 'bg-green-500/20 text-green-300 border-green-500/40',
  };
  const cls = styleByFaction[faction] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  return (
    <span className={cn('inline-flex items-center rounded border font-bold', size, cls)}>
      {faction}
    </span>
  );
};
