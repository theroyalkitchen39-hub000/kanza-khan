import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, MapPin, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings } from '../types';

interface HeroProps {
  settings: WebsiteSettings;
  onOrderNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOrderNow }) => {
  const { isUrdu, t } = useLanguage();

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden py-16 sm:py-24 border-b border-amber-500/20">
      {/* Subtle background ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Brand Messaging */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? settings.taglineUrdu : settings.tagline}</span>
            </div>

            {/* Main Brand Heading */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-none">
              The Royal <span className="gold-gradient-text">Kitchen</span>
            </h1>

            {/* Core Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-300 font-medium max-w-2xl mx-auto lg:mx-0">
              {isUrdu ? (
                <span>تازہ گھریلو کھانا • پورے کراچی میں ترسیل</span>
              ) : (
                <span>Fresh Homemade Food • Delivered Across Karachi</span>
              )}
            </p>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {isUrdu
                ? 'خالص گھی، تازہ گوشت اور اعلیٰ مصالحوں سے تیار کردہ گھر کے لذیذ کھانے۔ روزانہ کا تازہ مینو، مریضوں کا پرہیزی کھانا، اور تقاریب کیلئے خصوصی ڈشز۔'
                : 'Prepared every morning with pure ghee, whole spices, and home kitchen hygiene. Authentic Karachi flavors cooked fresh in limited daily batches.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#todays-menu"
                className="w-full sm:w-auto px-8 py-4 rounded-xl gold-button text-black font-extrabold text-base flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{t('viewDailyMenu')}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-amber-400/80 hover:border-amber-400 bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-base transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('orderNow')}</span>
              </button>
            </div>

            {/* Key Service Highlights */}
            <div className="pt-8 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Halal</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">Hygienic Home Kitchen</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Gulshan Block 6</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">Delivered All Karachi</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>Online Only</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">JazzCash 0300 2934707</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Fresh Batches</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">Prepared Daily</p>
              </div>
            </div>
          </div>

          {/* Right Column: Subtle Animated Hero Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-88 aspect-square flex items-center justify-center">
              
              {/* Outer Golden Ring with subtle pulse */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-pulse" />
              
              {/* Subtle spinning dashed accent */}
              <div className="absolute inset-3 rounded-full border border-dashed border-amber-500/30 animate-[spin_40s_linear_infinite]" />

              {/* Center Royal Insignia and Dish Container */}
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-2xl shadow-amber-500/20 bg-zinc-900 group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="The Royal Kitchen Homemade Biryani"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Floating royal badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-amber-400/50 px-4 py-1.5 rounded-full text-center whitespace-nowrap backdrop-blur-sm shadow-lg">
                  <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase">
                    👑 The Royal Kitchen
                  </p>
                </div>
              </div>

              {/* Gentle Floating Steam Indicator (Subtle, non-distracting) */}
              <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-zinc-900/90 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-lg animate-bounce duration-1000">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Cooked Fresh Today</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
