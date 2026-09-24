import React from 'react';
import { ShoppingBag, Lock, MessageCircle, Globe, UtensilsCrossed, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { WebsiteSettings } from '../types';

interface HeaderProps {
  settings: WebsiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenAdmin, isAdminLoggedIn }) => {
  const { language, setLanguage, isUrdu, t } = useLanguage();
  const { itemCount, openCart } = useCart();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/20 text-white transition-all">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 text-xs sm:text-sm font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
        <span>
          {isUrdu ? settings.announcementTextUrdu : settings.announcementText}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">
                    {t('siteTitle')}
                  </span>
                  <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-amber-400/40 text-amber-300 bg-amber-950/40">
                    Karachi
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-400 font-medium tracking-wide">
                  {isUrdu ? settings.taglineUrdu : settings.tagline}
                </p>
              </div>
            </a>
          </div>

          {/* Center Info - Karachi info */}
          <div className="hidden xl:flex flex-col items-center text-center text-xs text-zinc-400">
            <span className="text-zinc-300 font-medium">
              📍 {isUrdu ? settings.operatingFromUrdu : settings.operatingFrom}
            </span>
            <span className="text-amber-400 font-semibold mt-0.5">
              💳 {isUrdu ? 'صرف آن لائن ادائیگی (جاز کیش)' : 'ONLINE PAYMENT ONLY • JazzCash'}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-amber-400/60 bg-zinc-900/80 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/92${settings.whatsappNumber.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent('Assalam-o-Alaikum, I would like to inquire about today\'s menu at The Royal Kitchen.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">{settings.whatsappNumber}</span>
              <span className="lg:hidden">WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl gold-button transition cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              <span className="text-sm font-bold text-black hidden sm:inline">
                {t('cart')}
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center border-2 border-zinc-950 shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Admin Panel Toggle */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl border transition ${
                isAdminLoggedIn
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-zinc-800 bg-zinc-900 hover:border-amber-500/40 text-zinc-400 hover:text-amber-400'
              }`}
              title="Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Category Navigation Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-semibold border-t border-zinc-900 text-zinc-400">
          <a
            href="#todays-menu"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t('dailyMenuHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#patient-special"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('patientSpecialHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#roti"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('rotiHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#roti-paratha"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('rotiParathaHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#sweets"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('sweetsHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#sides"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('sidesHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#on-order"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('onOrderHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#frozen"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('frozenHeading')}
          </a>
          <span className="text-zinc-800">•</span>
          <a
            href="#kabab"
            className="whitespace-nowrap px-3 py-1 rounded-full hover:text-amber-400 hover:bg-zinc-900 transition"
          >
            {t('kababHeading')}
          </a>
        </nav>
      </div>
    </header>
  );
};
