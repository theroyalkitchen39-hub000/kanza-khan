import React from 'react';
import { FoodCard } from './FoodCard';
import { MenuItem } from '../types';

interface MenuSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  items: MenuItem[];
  accentColor?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  id,
  title,
  subtitle,
  badge,
  items,
}) => {
  return (
    <section id={id} className="py-14 sm:py-20 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-300 text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            {title}
          </h2>

          {/* Gold Decorative Center Accent Line */}
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />

          {subtitle && (
            <p className="text-base text-zinc-600 leading-relaxed font-normal pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Food Items Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm font-semibold text-zinc-500">
              No dishes listed in this section at the moment.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
