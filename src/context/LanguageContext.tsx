import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    siteTitle: 'The Royal Kitchen',
    tagline: 'Ghar Ka Khana Ghar Tak',
    subHero: 'Fresh Homemade Food • Delivered Across Karachi',
    viewDailyMenu: "View Today's Menu",
    orderNow: 'Order Now',
    dailyMenuHeading: "TODAY'S MENU",
    dailyMenuSub: 'Freshly prepared daily home dishes in limited quantity. Pre-book early!',
    patientSpecialHeading: 'PATIENT SPECIAL',
    patientSpecialSub: 'Mild, hygienic, low oil & low spice homestyle diet meals prepared with special care.',
    rotiHeading: 'HOMEMADE ROTI',
    rotiSub: 'Soft, freshly made tawa phulkas crafted with 100% whole wheat.',
    sweetsHeading: 'SWEETS & DESSERTS',
    sweetsSub: 'Rich traditional homemade desserts made with pure ingredients.',
    rotiParathaHeading: 'ROTI & PARATHA',
    rotiParathaSub: 'Flaky stuffed parathas and savory kababs fresh off the tawa.',
    sidesHeading: 'SIDES & CONDIMENTS',
    sidesSub: 'Fresh homemade raitas, crisp salads, and authentic chutneys.',
    onOrderHeading: 'ON ORDER SPECIALS',
    onOrderSub: 'Prepared fresh against advance booking. Perfect for family gatherings & dastarkhwans.',
    frozenHeading: 'FROZEN SPECIALS',
    frozenSub: 'Convenient homemade frozen packs ready to fry or simmer at home.',
    kababHeading: 'HOT KABAB (READY TO EAT)',
    kababSub: 'Freshly pan-fried crispy and tender kababs.',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart ✓',
    available: 'Available',
    soldOut: 'Sold Out',
    cart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyDesc: 'Discover our delicious homemade menu and add your favorite dishes.',
    cartItems: 'Items in Cart',
    itemTotal: 'Item Total',
    deliveryFee: 'Delivery Charges',
    deliveryFeeCalculated: 'Delivery charges according to Karachi area',
    totalAmount: 'Total Payable',
    checkout: 'Proceed to Checkout',
    customerDetails: 'Customer Details',
    fullName: 'Full Name',
    phoneNum: 'Mobile / WhatsApp Number',
    deliveryAddress: 'Complete Delivery Address',
    selectArea: 'Select Karachi Area',
    paymentNotice: 'ONLINE PAYMENT ONLY',
    noCodNotice: 'This business does NOT accept Cash on Delivery (COD).',
    jazzCashInfo: 'JazzCash Account: 0300 2934707',
    enterTxnId: 'JazzCash Transaction ID (TID) / Sender Name',
    orderNotes: 'Special Instructions / Cooking Preferences (Optional)',
    submitOrder: 'Place Order & Send via WhatsApp',
    operatingNotice: 'Operating From: Gulshan-e-Iqbal, Block 6, Karachi • Delivery All Over Karachi',
    whatsappContact: 'WhatsApp: 0336 2046434',
    adminLogin: 'Admin Panel',
    aiAssistant: 'AI Food Assistant',
    askAiPlaceholder: 'Ask about today\'s menu, biryani price, delivery charges...',
    send: 'Send',
    close: 'Close',
    pieces: 'Pieces',
    piece: 'Piece',
    halfKg: '½ KG',
    oneKg: '1 KG',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderSuccessDesc: 'Thank you for choosing The Royal Kitchen. Please send the payment screenshot on WhatsApp to confirm cooking.',
  },
  ur: {
    siteTitle: 'دی رائل کچن',
    tagline: 'گھر کا کھانا گھر تک',
    subHero: 'تازہ گھریلو کھانا • پورے کراچی میں ترسیل',
    viewDailyMenu: 'آج کا مینو دیکھیں',
    orderNow: 'ابھی آرڈر کریں',
    dailyMenuHeading: 'آج کا مینو',
    dailyMenuSub: 'روزانہ تازہ تیار کردہ گھریلو کھانے محدود مقدار میں۔ پہلے سے بک کروائیں!',
    patientSpecialHeading: 'مریضوں کیلئے خاص کھانا',
    patientSpecialSub: 'ہلکی مرچ، کم تیل اور حفظان صحت کے مطابق خصوصی دیکھ بھال سے تیار کردہ پرہیزی کھانا۔',
    rotiHeading: 'گھریلو روٹی',
    rotiSub: 'خالص گندم سے توے پر بنے گرم، نرم اور تازہ پھلکے۔',
    sweetsHeading: 'میٹھے پکوان',
    sweetsSub: 'خالص اجزاء اور دودھ سے تیار کردہ لذیذ شاہی میٹھے۔',
    rotiParathaHeading: 'روٹی اور پراٹھے',
    rotiParathaSub: 'خستہ بھرے ہوئے پراٹھے اور دہکتے کوئلوں پر تیار کباب۔',
    sidesHeading: 'رائتہ و سلاد',
    sidesSub: 'تازہ زیرہ رائتہ، کچومر سلاد اور روایتی پودینہ چٹنی۔',
    onOrderHeading: 'آن آرڈر خاص پکوان',
    onOrderSub: 'پیشگی آرڈر پر تیار کیے جانے والے خاص پکوان۔ فیملی اور دعوتوں کیلئے بہترین۔',
    frozenHeading: 'فروزن آئٹمز',
    frozenSub: 'گھر کے بنے صاف ستھرے فروزن پیکٹس، فریزر میں محفوظ رکھیں اور جب چاہیں تلیں۔',
    kababHeading: 'تازہ گرم کباب',
    kababSub: 'گرما گرم اور لذیذ تلے ہوئے کباب۔',
    addToCart: 'آرڈر میں شامل کریں',
    addedToCart: 'شامل کر دیا گیا ✓',
    available: 'دستیاب ہے',
    soldOut: 'ختم ہوچکا ہے',
    cart: 'آپ کی کارٹ',
    cartEmpty: 'آپ کی کارٹ خالی ہے',
    cartEmptyDesc: 'ہمارا گھریلو مینو دیکھیں اور اپنی پسندیدہ ڈشز منتخب کریں۔',
    cartItems: 'شامل اشیاء',
    itemTotal: 'کھانوں کی کل رقم',
    deliveryFee: 'ڈیلیوری چارجز',
    deliveryFeeCalculated: 'کراچی کے علاقے کے مطابق ڈیلیوری چارجز',
    totalAmount: 'کل واجب الادا رقم',
    checkout: 'آرڈر مکمل کریں',
    customerDetails: 'گاہک کی تفصیلات',
    fullName: 'پورا نام',
    phoneNum: 'موبائل / واٹس ایپ نمبر',
    deliveryAddress: 'مکمل پتہ',
    selectArea: 'کراچی کا علاقہ منتخب کریں',
    paymentNotice: 'صرف آن لائن ادائیگی قبول ہے',
    noCodNotice: 'کیش آن ڈیلیوری (COD) کی سہولت موجود نہیں ہے۔',
    jazzCashInfo: 'جاز کیش اکاؤنٹ: 0300 2934707',
    enterTxnId: 'جاز کیش ٹرانزیکشن آئی ڈی (TID) یا بھیجنے والے کا نام',
    orderNotes: 'کوئی خاص ہدایت (مثلاً کم مرچ وغیرہ)',
    submitOrder: 'آرڈر بک کریں اور واٹس ایپ پر بھیجیں',
    operatingNotice: 'مقام: گلشن اقبال، بلاک 6، کراچی • پورے کراچی میں ڈیلیوری',
    whatsappContact: 'واٹس ایپ: 0336 2046434',
    adminLogin: 'ایڈمن پینل',
    aiAssistant: 'اے آئی فوڈ اسسٹنٹ',
    askAiPlaceholder: 'آج کا مینو، بریانی کی قیمت، ڈیلیوری یا مریض کے کھانے کے بارے میں پوچھیں...',
    send: 'بھیجیں',
    close: 'بند کریں',
    pieces: 'عدد',
    piece: 'عدد',
    halfKg: 'آدھا کلو',
    oneKg: 'ایک کلو',
    orderSuccessTitle: 'آرڈر کامیابی سے موصول ہوگیا!',
    orderSuccessDesc: 'دی رائل کچن منتخب کرنے کا شکریہ۔ کھانا پکانے کی تصدیق کیلئے پیمنٹ اسکرین شاٹ واٹس ایپ پر شیئر کریں۔',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isUrdu: false,
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('trk_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('trk_language', lang);
  };

  const isUrdu = language === 'ur';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
  }, [language, isUrdu]);

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isUrdu, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
