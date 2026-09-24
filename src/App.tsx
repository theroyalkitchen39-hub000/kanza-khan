import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { OnOrderSection } from './components/OnOrderSection';
import { CartModal } from './components/CartModal';
import { AIChatModal } from './components/AIChatModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { MenuItem, WebsiteSettings, Order } from './types';
import { initialMenuItems, initialSettings } from './data/initialData';
import { 
  subscribeToMenuItems, 
  subscribeToWebsiteSettings, 
  subscribeToOrders, 
  subscribeToAuth 
} from './services/firebase';
import { User } from 'firebase/auth';
import { Sparkles, HeartHandshake, Flame, ShieldAlert } from 'lucide-react';

function RestaurantApp() {
  const { isUrdu, t } = useLanguage();
  const { openCart } = useCart();

  // Core Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Admin UI State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Subscribe to Firebase Live Firestore Streams (Menu and Settings are public read)
  useEffect(() => {
    const unsubMenu = subscribeToMenuItems((items) => {
      setMenuItems(items);
    });

    const unsubSettings = subscribeToWebsiteSettings((newSettings) => {
      setSettings(newSettings);
    });

    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubMenu();
      unsubSettings();
      unsubAuth();
    };
  }, []);

  // Subscribe to Orders only when admin is authenticated
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    const unsubOrders = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });
    return () => {
      unsubOrders();
    };
  }, [currentUser]);

  // Filter items for sections (active & published only for customer view)
  const visibleItems = menuItems.filter((i) => i.isActive);

  // 1. TODAY'S MENU (first food section, exactly 5 editable slots initially)
  const dailyMenuItems = visibleItems
    .filter((i) => i.isDailyMenu || i.category === 'daily')
    .sort((a, b) => (a.dailySlotIndex || 99) - (b.dailySlotIndex || 99));

  // 2. PATIENT SPECIAL (separate section, 3 editable items initially)
  const patientSpecialItems = visibleItems
    .filter((i) => i.isPatientSpecial || i.category === 'patient')
    .sort((a, b) => (a.patientSlotIndex || 99) - (b.patientSlotIndex || 99));

  // 3. ROTI
  const rotiItems = visibleItems.filter((i) => i.category === 'roti');

  // 4. ROTI & PARATHA
  const rotiParathaItems = visibleItems.filter((i) => i.category === 'roti_paratha');

  // 5. SWEETS
  const sweetsItems = visibleItems.filter((i) => i.category === 'sweets');

  // 6. SIDES
  const sidesItems = visibleItems.filter((i) => i.category === 'sides');

  // 7. ON ORDER
  const onOrderItems = visibleItems.filter((i) => i.category === 'on_order');

  // 8. FROZEN
  const frozenItems = visibleItems.filter((i) => i.category === 'frozen');

  // 9. KABAB
  const kababItems = visibleItems.filter((i) => i.category === 'kabab');

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-amber-400 selection:text-black flex flex-col font-sans">
      
      {/* Header */}
      <Header
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={!!currentUser}
      />

      {/* Hero Section */}
      <Hero
        settings={settings}
        onOrderNow={openCart}
      />

      {/* Online Payment Notice Strip */}
      <div className="bg-zinc-900 border-y border-amber-500/30 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="font-extrabold text-amber-400 tracking-wide uppercase">
              {isUrdu ? 'صرف آن لائن ادائیگی' : 'ONLINE PAYMENT ONLY'}
            </span>
            <span className="text-zinc-400 hidden md:inline">|</span>
            <span className="text-zinc-300">
              {isUrdu ? 'کیش آن ڈیلیوری (COD) قبول نہیں ہے' : 'No Cash on Delivery (COD)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">
              JazzCash: <strong className="text-white font-mono">{settings.jazzCashNumber}</strong>
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400">
              Delivery: <strong className="text-amber-300">All Over Karachi</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MAIN FOOD CONTENT - Spacious, Clean, Mostly White Space */}
      <main className="flex-1">
        
        {/* 1. TODAY'S MENU (The First Food Section) */}
        <div className="bg-gradient-to-b from-amber-50/40 via-white to-white border-b border-zinc-100">
          <MenuSection
            id="todays-menu"
            title={t('dailyMenuHeading')}
            subtitle={t('dailyMenuSub')}
            badge={isUrdu ? 'آج کا تازہ مینو' : "Fresh Daily Batches • Today's 5 Specials"}
            items={dailyMenuItems}
          />
        </div>

        {/* 2. PATIENT SPECIAL */}
        <div className="bg-emerald-50/30 border-b border-zinc-100">
          <MenuSection
            id="patient-special"
            title={t('patientSpecialHeading')}
            subtitle={t('patientSpecialSub')}
            badge={isUrdu ? 'طبی و پرہیزی خوراک' : 'Dietary Care & Hospital Friendly'}
            items={patientSpecialItems}
          />
        </div>

        {/* 3. ROTI (Homemade Roti - Rs. 30) */}
        <div className="border-b border-zinc-100">
          <MenuSection
            id="roti"
            title={t('rotiHeading')}
            subtitle={t('rotiSub')}
            badge={isUrdu ? 'خالص گندم' : 'Whole Wheat Phulka'}
            items={rotiItems}
          />
        </div>

        {/* 4. ROTI & PARATHA */}
        <div className="bg-zinc-50/50 border-b border-zinc-100">
          <MenuSection
            id="roti-paratha"
            title={t('rotiParathaHeading')}
            subtitle={t('rotiParathaSub')}
            badge={isUrdu ? 'خستہ پراٹھے اور کباب' : 'Tawa Crispy Specials & Kebabs'}
            items={rotiParathaItems}
          />
        </div>

        {/* 5. SWEETS */}
        <div className="border-b border-zinc-100">
          <MenuSection
            id="sweets"
            title={t('sweetsHeading')}
            subtitle={t('sweetsSub')}
            badge={isUrdu ? 'میٹھے پکوان' : 'Traditional Desserts'}
            items={sweetsItems}
          />
        </div>

        {/* 6. SIDES */}
        <div className="bg-zinc-50/40 border-b border-zinc-100">
          <MenuSection
            id="sides"
            title={t('sidesHeading')}
            subtitle={t('sidesSub')}
            badge={isUrdu ? 'رائتہ و سلاد' : 'Fresh Homemade Accompaniments'}
            items={sidesItems}
          />
        </div>

        {/* 7. ON ORDER (Large separate section with 6 subcategories) */}
        <OnOrderSection items={onOrderItems} />

        {/* 8. FROZEN */}
        <div className="border-b border-zinc-100">
          <MenuSection
            id="frozen"
            title={t('frozenHeading')}
            subtitle={t('frozenSub')}
            badge={isUrdu ? 'گھریلو فروزن' : 'Ready to Cook at Home (12 Pieces Pack)'}
            items={frozenItems}
          />
        </div>

        {/* 9. KABAB (Ready to Eat) */}
        <div className="bg-zinc-50/50 border-b border-zinc-100">
          <MenuSection
            id="kabab"
            title={t('kababHeading')}
            subtitle={t('kababSub')}
            badge={isUrdu ? 'تازہ گرم کباب' : 'Hot & Crispy (2 Pieces)'}
            items={kababItems}
          />
        </div>

      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Cart Drawer */}
      <CartModal settings={settings} />

      {/* Floating AI Chat Assistant */}
      <AIChatModal
        menuItems={menuItems}
        settings={settings}
      />

      {/* Protected Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        menuItems={menuItems}
        settings={settings}
        orders={orders}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <RestaurantApp />
      </CartProvider>
    </LanguageProvider>
  );
}
