import React from 'react';
import { UtensilsCrossed, Phone, MapPin, CreditCard, MessageCircle, Lock } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const { isUrdu, t } = useLanguage();

  return (
    <footer className="bg-zinc-950 text-white border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  The Royal Kitchen
                </span>
                <span className="text-xs text-amber-400 font-bold block">
                  {isUrdu ? settings.taglineUrdu : settings.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {isUrdu
                ? 'خالص دیسی گھی اور تازہ گوشت سے تیار کردہ حفظانِ صحت کے اصولوں کے مطابق گھر کا کھانا، جو محبت سے آپ کی دہلیز تک پہنچایا جاتا ہے۔'
                : 'Authentic homestyle cooking made with fresh halal meat, premium spices, and maternal care. Delivered fresh in temperature-safe packaging across Karachi.'}
            </p>
          </div>

          {/* Col 2: Operating & Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Kitchen & Delivery
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Kitchen:</strong> {isUrdu ? settings.operatingFromUrdu : settings.operatingFrom}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">🚚</span>
                <span>
                  <strong>Coverage:</strong> {isUrdu ? settings.deliveryCoverageUrdu : settings.deliveryCoverage}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">⏰</span>
                <span>
                  <strong>Hours:</strong> {isUrdu ? settings.businessHoursUrdu : settings.businessHours}
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Online Payment Only */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Payment Policy
            </h4>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>ONLINE PAYMENT ONLY</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                We do NOT offer Cash on Delivery (COD).
              </p>
              <div className="pt-1 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">JazzCash Number</span>
                <span className="text-sm font-black text-white font-mono">{settings.jazzCashNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 4: WhatsApp & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Direct Contact
            </h4>
            <p className="text-xs text-zinc-400">
              Order confirmations & custom bulk requirements:
            </p>
            <a
              href={`https://wa.me/92${settings.whatsappNumber.replace(/[^0-9]/g, '').slice(-10)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 text-xs font-bold transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-xs text-zinc-500 hover:text-amber-400 font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Restaurant Admin Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} The Royal Kitchen • Ghar Ka Khana Ghar Tak. All Rights Reserved.</p>
          <p className="text-zinc-600">Gulshan-e-Iqbal, Block 6, Karachi</p>
        </div>

      </div>
    </footer>
  );
};
