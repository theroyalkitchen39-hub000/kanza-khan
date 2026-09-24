import React, { useState } from 'react';
import { FoodCard } from './FoodCard';
import { MenuItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OnOrderSectionProps {
  items: MenuItem[];
}

const SUBCATEGORIES = [
  { id: 'all', label: 'All Dishes', labelUrdu: 'تمام پکوان' },
  { id: 'BIRYANI & PULAO', label: 'Biryani & Pulao', labelUrdu: 'بریانی و پلاؤ' },
  { id: 'CHICKEN KARAHI', label: 'Chicken Karahi', labelUrdu: 'چکن کڑاہی' },
  { id: 'BONELESS & KOFTA', label: 'Boneless & Kofta', labelUrdu: 'بون لیس و کوفتہ' },
  { id: 'HANDI', label: 'Handi Specials', labelUrdu: 'ہانڈی اسپیشل' },
  { id: 'CHICKEN QORMA', label: 'Chicken Qorma', labelUrdu: 'چکن قورمہ' },
  { id: 'CHICKEN QEEMA', label: 'Chicken Qeema', labelUrdu: 'چکن قیمہ' },
];

export const OnOrderSection: React.FC<OnOrderSectionProps> = ({ items }) => {
  const { isUrdu, t } = useLanguage();
  const [selectedSub, setSelectedSub] = useState<string>('all');

  const filteredItems = selectedSub === 'all'
    ? items
    : items.filter(item => item.subCategory?.toUpperCase() === selectedSub.toUpperCase());

  return (
    <section id="on-order" className="py-16 sm:py-24 bg-zinc-50/60 border-y border-zinc-200/80 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100/70 border border-amber-300 text-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>{isUrdu ? 'پیشگی آرڈر' : 'Special Bulk & Advance Booking'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            {t('onOrderHeading')}
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />

          <p className="text-base text-zinc-600 leading-relaxed font-normal">
            {t('onOrderSub')}
          </p>
        </div>

        {/* Subcategory Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {SUBCATEGORIES.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSub(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSub === sub.id
                  ? 'bg-zinc-950 text-white shadow-md border border-amber-400/50'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {isUrdu ? sub.labelUrdu : sub.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm font-semibold text-zinc-500">
              No dishes found under this category.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
