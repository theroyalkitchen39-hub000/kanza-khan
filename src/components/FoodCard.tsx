import React, { useState } from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { MenuItem, PriceVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const { isUrdu, t } = useLanguage();

  const [selectedVariant, setSelectedVariant] = useState<PriceVariant | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [justAdded, setJustAdded] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    addItem(item, selectedVariant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
      item.isAvailable 
        ? 'border-zinc-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/5' 
        : 'border-zinc-200 opacity-60'
    }`}>
      
      {/* Food Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {item.isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-950/80 text-amber-300 border border-amber-400/40 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('available')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800/90 text-zinc-300 border border-zinc-700 backdrop-blur-xs">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              {t('soldOut')}
            </span>
          )}
        </div>

        {/* Category Pill */}
        {item.subCategory && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-zinc-950/80 text-zinc-200 border border-zinc-800 backdrop-blur-xs">
              {item.subCategory}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Item Name */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-lg text-zinc-950 group-hover:text-amber-600 transition-colors">
              {isUrdu ? item.nameUrdu || item.name : item.name}
            </h3>
          </div>

          {/* Urdu / Secondary Name display for authenticity */}
          {!isUrdu && item.nameUrdu && (
            <p className="text-xs text-zinc-500 font-medium font-urdu mt-0.5" dir="rtl">
              {item.nameUrdu}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
            {isUrdu ? item.descriptionUrdu || item.description : item.description}
          </p>
        </div>

        {/* Variants Selector (if item has portion options e.g. 1 Pc vs 6 Pcs or 1/2 KG vs 1 KG) */}
        {item.variants && item.variants.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              {isUrdu ? 'سائز / مقدار منتخب کریں:' : 'Select Portion:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {item.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                    selectedVariant?.label === v.label
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50'
                  }`}
                >
                  <span className="block truncate">{isUrdu && v.labelUrdu ? v.labelUrdu : v.label}</span>
                  <span className="text-[11px] text-zinc-500">Rs. {v.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-zinc-500 font-medium block">
              {selectedVariant ? (isUrdu && selectedVariant.labelUrdu ? selectedVariant.labelUrdu : selectedVariant.label) : (isUrdu ? 'قیمت' : 'Price')}
            </span>
            <span className="text-xl font-black text-zinc-950 tracking-tight">
              <span className="text-amber-600 text-sm font-bold mr-1">Rs.</span>
              {currentPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              !item.isAvailable
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-md'
                : 'gold-button text-black'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t('addedToCart')}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
