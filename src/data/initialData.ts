import { MenuItem, WebsiteSettings } from '../types';

export const initialSettings: WebsiteSettings = {
  restaurantName: 'The Royal Kitchen',
  tagline: 'Ghar Ka Khana Ghar Tak',
  taglineUrdu: 'گھر کا کھانا گھر تک',
  operatingFrom: 'Gulshan-e-Iqbal, Block 6, Karachi',
  operatingFromUrdu: 'گلشن اقبال، بلاک 6، کراچی',
  deliveryCoverage: 'Delivered Across Karachi',
  deliveryCoverageUrdu: 'پورے کراچی میں تیز ترسیل',
  jazzCashNumber: '0300 2934707',
  jazzCashTitle: 'The Royal Kitchen (Online Payment Only)',
  whatsappNumber: '0336 2046434',
  deliveryAreas: [
    { name: 'Gulshan-e-Iqbal', nameUrdu: 'گلشن اقبال', fee: 150 },
    { name: 'Gulistan-e-Jauhar', nameUrdu: 'گلستان جوہر', fee: 200 },
    { name: 'PECHS / Tariq Road', nameUrdu: 'پی ای سی ایچ ایس / طارق روڈ', fee: 250 },
    { name: 'Clifton / DHA (Defence)', nameUrdu: 'کلفٹن / ڈی ایچ اے', fee: 350 },
    { name: 'North Nazimabad', nameUrdu: 'نارتھ ناظم آباد', fee: 250 },
    { name: 'Nazimabad / Liaquatabad', nameUrdu: 'ناظم آباد / لیاقت آباد', fee: 220 },
    { name: 'Bahadurabad / Sharfabad', nameUrdu: 'بہادر آباد / شرف آباد', fee: 200 },
    { name: 'Federal B Area / Buffer Zone', nameUrdu: 'ایف بی ایریا / بفر زون', fee: 220 },
    { name: 'Malir / Cantt / Model Colony', nameUrdu: 'ملیر / کینٹ / ماڈل کالونی', fee: 320 },
    { name: 'Saddar / Garden / Soldier Bazar', nameUrdu: 'صدر / گارڈن / سولجر بازار', fee: 280 },
    { name: 'Korangi / Landhi', nameUrdu: 'کورنگی / لانڈھی', fee: 350 },
    { name: 'North Karachi / Surjani', nameUrdu: 'نارتھ کراچی / سرجانی', fee: 320 },
    { name: 'Site / Baldia / Orangi', nameUrdu: 'سائٹ / بلدیہ', fee: 350 },
  ],
  announcementText: '✨ Fresh homemade meal boxes prepared daily with 100% halal, hygienic ingredients. ONLINE PAYMENT ONLY.',
  announcementTextUrdu: '✨ روزانہ خالص اور حفظانِ صحت کے اصولوں کے مطابق تیار کردہ گھر کا لذیذ کھانا۔ صرف آن لائن ادائیگی قبول ہے۔',
  isAcceptingOrders: true,
  businessHours: '11:00 AM - 11:30 PM (Daily)',
  businessHoursUrdu: 'صبح 11:00 تا رات 11:30 (روزانہ)',
};

export const initialMenuItems: MenuItem[] = [
  // --- DAILY MENU (5 initial slots) ---
  {
    id: 'daily-1',
    name: 'Special Chicken Biryani',
    nameUrdu: 'اسپیشل چکن بریانی',
    description: 'Fragrant basmati sella rice infused with whole aromatic spices, succulent marinated chicken, and tender spiced potatoes.',
    descriptionUrdu: 'خوشبودار باسمتی چاول، مصالحہ دار چکن اور ذائقے دار آلو کے ساتھ روایتی کراچی دم بریانی۔',
    price: 380,
    variants: [
      { label: 'Single Plate (with Chicken piece)', labelUrdu: 'سنگل پلیٹ', price: 380 },
      { label: 'Special Double Plate', labelUrdu: 'ڈبل پلیٹ', price: 650 },
      { label: '½ KG Handi Box', labelUrdu: 'آدھا کلو', price: 1300 }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'daily',
    isAvailable: true,
    isActive: true,
    isDailyMenu: true,
    dailySlotIndex: 1
  },
  {
    id: 'daily-2',
    name: 'Fresh Chicken Karahi (Homemade)',
    nameUrdu: 'تازہ چکن کڑاہی (گھریلو انداز)',
    description: 'Slow-simmered chicken in fresh ripe tomatoes, green chilies, ginger julienne, and freshly ground crushed coriander.',
    descriptionUrdu: 'تازہ ٹماٹر، ہری مرچ، کٹا ہوا ادرک اور تازہ مصالحوں میں دم کی گئی روایتی چکن کڑاہی۔',
    price: 450,
    variants: [
      { label: 'Regular Portion (Single Serving)', labelUrdu: 'سنگل پورشن', price: 450 },
      { label: '½ KG Handi', labelUrdu: 'آدھا کلو', price: 1200 }
    ],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'daily',
    isAvailable: true,
    isActive: true,
    isDailyMenu: true,
    dailySlotIndex: 2
  },
  {
    id: 'daily-3',
    name: 'Homestyle Tarka Daal & Chawal',
    nameUrdu: 'گھریلو تڑکا دال اور چاول',
    description: 'Comforting yellow lentils tempered with golden garlic, cumin seeds and whole red chilies, served with fluffy basmati rice.',
    descriptionUrdu: 'لہسن، زیرہ اور گول لال مرچ کے دیسی تڑکے والی خوشبودار دال مع ابلے باسمتی چاول۔',
    price: 250,
    variants: [
      { label: 'Daal Bowl with Rice', labelUrdu: 'دال مع چاول', price: 250 },
      { label: 'Daal Bowl Only', labelUrdu: 'صرف دال', price: 160 }
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'daily',
    isAvailable: true,
    isActive: true,
    isDailyMenu: true,
    dailySlotIndex: 3
  },
  {
    id: 'daily-4',
    name: 'Steamed Basmati Rice',
    nameUrdu: 'خالص ابلے باسمتی چاول',
    description: 'Light, separate grain premium basmati rice perfectly steamed to accompany your favorite curries and lentils.',
    descriptionUrdu: 'کھلے کھلے، خوشبودار اور ہلکے ابلے ہوئے بہترین باسمتی چاول۔',
    price: 150,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    category: 'daily',
    isAvailable: true,
    isActive: true,
    isDailyMenu: true,
    dailySlotIndex: 4
  },
  {
    id: 'daily-5',
    name: 'Traditional Shahi Kheer',
    nameUrdu: 'روایتی شاہی کھیر',
    description: 'Slow-cooked rich milk and ground rice dessert garnished with crushed almonds, cardamom and silver leaf.',
    descriptionUrdu: 'خالص دودھ، چاول اور الائچی سے کڑھی ہوئی لذیذ شاہی کھیر، بادام و پستے کے چھڑکاؤ کے ساتھ۔',
    price: 180,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'daily',
    isAvailable: true,
    isActive: true,
    isDailyMenu: true,
    dailySlotIndex: 5
  },

  // --- PATIENT SPECIAL (3 initial slots) ---
  {
    id: 'patient-1',
    name: 'Steamed Mild Chicken Khichdi',
    nameUrdu: 'مریضوں کیلئے ہلکی چکن کھچڑی',
    description: 'Prepared with washed yellow moong daal, basmati rice, tender shredded chicken, minimal olive/pure oil and gentle digestive spices.',
    descriptionUrdu: 'مونگ دال، باسمتی چاول اور ابلے چکن کے ریشوں کے ساتھ بغیر تیز مصالحوں کے نرم و زود ہضم کھچڑی۔',
    price: 320,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    category: 'patient',
    isAvailable: true,
    isActive: true,
    isPatientSpecial: true,
    patientSlotIndex: 1
  },
  {
    id: 'patient-2',
    name: 'Clear Chicken Broth & Lauki Bowl',
    nameUrdu: 'ہلکی چکن یخنی اور لوکی سالن',
    description: 'Zero red chilli, heart-friendly minimal oil broth cooked with fresh bottle gourd (lauki), tender chicken, and cumin.',
    descriptionUrdu: 'بغیر لال مرچ، برائے نام تیل، تازہ لوکی اور نرم چکن کا زود ہضم اور مقوی شوربہ۔',
    price: 380,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    category: 'patient',
    isAvailable: true,
    isActive: true,
    isPatientSpecial: true,
    patientSlotIndex: 2
  },
  {
    id: 'patient-3',
    name: 'Yellow Moong Daal with 2 Soft Rotis',
    nameUrdu: 'پھیکی مونگ دال مع 2 نرم روٹیاں',
    description: 'Wholesome washed lentils cooked with mild rock salt and turmeric, accompanied by 2 freshly made feather-soft whole wheat rotis.',
    descriptionUrdu: 'ہلکے نمک اور ہلدی کے ساتھ بغیر مرچ کی مونگ دال مع 2 تازہ نرم پھلکے۔',
    price: 240,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    category: 'patient',
    isAvailable: true,
    isActive: true,
    isPatientSpecial: true,
    patientSlotIndex: 3
  },

  // --- ROTI ---
  {
    id: 'roti-1',
    name: 'Homemade Roti',
    nameUrdu: 'گھریلو تازہ روٹی',
    description: 'Freshly rolled and puffed thin whole-wheat phulka roti prepared hygienic on tawa.',
    descriptionUrdu: 'گندم کے خالص آٹے سے توے پر بنی گرم، نرم اور تازہ گھریلو پھلکا روٹی۔',
    price: 30,
    variants: [
      { label: '1 Piece', labelUrdu: '1 عدد', price: 30 },
      { label: '5 Pieces Pack', labelUrdu: '5 عدد پیکٹ', price: 150 },
      { label: '10 Pieces Pack', labelUrdu: '10 عدد پیکٹ', price: 300 }
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    category: 'roti',
    isAvailable: true,
    isActive: true
  },

  // --- SWEETS ---
  {
    id: 'sweet-1',
    name: 'Shahi Rice Kheer',
    nameUrdu: 'شاہی رائس کھیر',
    description: 'Authentic clay pot style creamy kheer enriched with green cardamom and dry fruits.',
    descriptionUrdu: 'روایتی کڑھے ہوئے دودھ اور الائچی کی خوشبو سے مزین شاہی کھیر۔',
    price: 180,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'sweets',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'sweet-2',
    name: 'Hot Gulab Jamun (4 Pieces)',
    nameUrdu: 'گرم گلاب جامن (4 دانے)',
    description: 'Soft milk-solid dumplings soaked in warm rose and cardamom scented sugar syrup.',
    descriptionUrdu: 'شیرے میں ڈوبے، منہ میں گھل جانے والے تازہ اور نرم گلاب جامن۔',
    price: 240,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    category: 'sweets',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'sweet-3',
    name: 'Special Gajar Ka Halwa',
    nameUrdu: 'اسپیشل گاجر کا حلوہ',
    description: 'Winter-special grated red carrots slow-cooked in pure milk and desi ghee, topped with khoya.',
    descriptionUrdu: 'دیسی گھی اور کھوئے سے تیار کردہ لذیذ و گرم گاجر کا حلوہ۔',
    price: 300,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    category: 'sweets',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'sweet-4',
    name: 'Shahi Mutanjan / Zarda',
    nameUrdu: 'شاہی متنجن / زردہ',
    description: 'Aromatic sweet rice infused with saffron hue, ashrafi sweets, cham cham and nuts.',
    descriptionUrdu: 'خوشبودار شیریں چاول، اشرفیوں، کھوئے اور میوہ جات کے ساتھ روایتی زردہ۔',
    price: 250,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    category: 'sweets',
    isAvailable: true,
    isActive: true
  },

  // --- ROTI & PARATHA ---
  {
    id: 'paratha-1',
    name: 'Crispy Aloo Paratha',
    nameUrdu: 'کرسپی آلو پراٹھا',
    description: 'Stuffed with spiced mashed potatoes, fresh coriander, green chilies and toasted with butter/ghee.',
    descriptionUrdu: 'چٹپٹے آلوؤں کے بھرپور مسالے اور گھی سے تیار کردہ خستہ آلو پراٹھا۔',
    price: 140,
    variants: [
      { label: '1 Piece', labelUrdu: '1 عدد', price: 140 },
      { label: '6 Pieces', labelUrdu: '6 عدد', price: 840 }
    ],
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    category: 'roti_paratha',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'paratha-2',
    name: 'Special Daal Paratha',
    nameUrdu: 'اسپیشل دال پراٹھا',
    description: 'Stuffed with savory spiced chana lentils and pan-fried to crisp perfection.',
    descriptionUrdu: 'مصالحہ دار بھنی ہوئی چنا دال کی فلنگ والا لذیذ و خستہ پراٹھا۔',
    price: 140,
    variants: [
      { label: '1 Piece', labelUrdu: '1 عدد', price: 140 },
      { label: '6 Pieces', labelUrdu: '6 عدد', price: 840 }
    ],
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=800&q=80',
    category: 'roti_paratha',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'paratha-3',
    name: 'Flavored Besan Paratha',
    nameUrdu: 'بیسن کا پراٹھا',
    description: 'Gram flour seasoned with ajwain, anardana, onions, and mint, toasted until flaky.',
    descriptionUrdu: 'اجوائن، اناردانہ، پیاز اور پودینے کے ذائقے دار مصالحے میں گوندھے بیسن کا خستہ پراٹھا۔',
    price: 140,
    variants: [
      { label: '1 Piece', labelUrdu: '1 عدد', price: 140 },
      { label: '6 Pieces', labelUrdu: '6 عدد', price: 840 }
    ],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'roti_paratha',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'paratha-4',
    name: 'Besan Roti (Missi Roti)',
    nameUrdu: 'بیسن کی روٹی (مسی روٹی)',
    description: 'Nutritious roasted chickpea flour flatbread with fresh herbs and spices.',
    descriptionUrdu: 'خالص بیسن اور گندم کے مرکب سے تیار کردہ زود ہضم اور مقوی روٹی۔',
    price: 100,
    variants: [
      { label: '1 Piece', labelUrdu: '1 عدد', price: 100 },
      { label: '6 Pieces', labelUrdu: '6 عدد', price: 600 }
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    category: 'roti_paratha',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'paratha-5',
    name: 'Grilled Seekh Kabab',
    nameUrdu: 'سیخ کباب',
    description: 'Tender minced chicken skewers blended with traditional spices, flame grilled.',
    descriptionUrdu: 'باریک قیمے اور شاہی گرم مصالحوں سے تیار کردہ دہکتے کوئلوں پر پکے سیخ کباب۔',
    price: 600,
    variants: [
      { label: '6 Pieces', labelUrdu: '6 عدد', price: 600 },
      { label: '12 Pieces', labelUrdu: '12 عدد', price: 1200 }
    ],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'roti_paratha',
    isAvailable: true,
    isActive: true
  },

  // --- SIDES ---
  {
    id: 'side-1',
    name: 'Fresh Zeera Raita',
    nameUrdu: 'تازہ زیرہ رائتہ',
    description: 'Thick creamy yogurt whipped with roasted cumin seeds and black salt.',
    descriptionUrdu: 'بھنے ہوئے زیرے اور کالے نمک سے مزین گاڑھا گھریلو دہی کا رائتہ۔',
    price: 80,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'sides',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'side-2',
    name: 'Fresh Kachumber Salad',
    nameUrdu: 'تازہ کچومر سلاد',
    description: 'Finely diced crisp cucumbers, red onions, tomatoes and lemon dressing.',
    descriptionUrdu: 'باریک کٹے کھیرے، پیاز، ٹماٹر اور لیموں کے رس سے سجا تازہ کچومر سلاد۔',
    price: 70,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    category: 'sides',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'side-3',
    name: 'Spicy Mint & Coriander Chutney',
    nameUrdu: 'پودینہ اور دھنیا کی چٹنی',
    description: 'Zesty green chutney hand-ground with fresh mint, coriander, and green chilies.',
    descriptionUrdu: 'تازہ پودینہ، ہرا دھنیا، لہسن اور ہری مرچ کی کھٹی میٹھی چٹپٹی چٹنی۔',
    price: 60,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80',
    category: 'sides',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: BIRYANI & PULAO ---
  {
    id: 'onorder-biryani-1',
    name: 'Special Chicken Biryani (Handi)',
    nameUrdu: 'چکن بریانی (آن آرڈر ہانڈی)',
    description: 'Freshly prepared upon your advance order with long-grain basmati and choice chicken cuts.',
    descriptionUrdu: 'آن آرڈر تازہ دم کی گئی چکن بریانی، بہترین خوشبودار چاول اور رسیلا چکن۔',
    price: 1300,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1300 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 2200 }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-2',
    name: 'Aloo Dum Biryani',
    nameUrdu: 'آلو دم بریانی',
    description: 'Aromatic layered rice cooked with tender spiced baby potatoes and Karachi biryani masala.',
    descriptionUrdu: 'زعفرانی خوشبو اور چٹپٹے مصالحہ دار آلوؤں کے ساتھ خاص کراچی دم بریانی۔',
    price: 1000,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1000 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 1800 }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-3',
    name: 'Special Chicken Pulao',
    nameUrdu: 'چکن یخنی پلاؤ',
    description: 'Rich yakhni infused rice with tender chicken, whole spices, and caramelized onions.',
    descriptionUrdu: 'اصلی یخنی، کھڑے گرم مصالحوں اور چکن کے ساتھ تیار کردہ روایتی پلاؤ۔',
    price: 1300,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1300 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 2200 }
    ],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-4',
    name: 'Chicken Matar Pulao',
    nameUrdu: 'چکن مٹر پلاؤ',
    description: 'Delicious combination of sweet green peas, tender chicken and seasoned basmati.',
    descriptionUrdu: 'میٹھے ہرے مٹر اور نرم چکن کے ساتھ تیار کردہ ہلکا اور لذیذ پلاؤ۔',
    price: 800,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 800 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 1500 }
    ],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-5',
    name: 'Chana Biryani',
    nameUrdu: 'چنا بریانی',
    description: 'Spiced chickpea biryani with zesty tomatoes, dried plum and fried onions.',
    descriptionUrdu: 'چٹپٹے سفید چنے، آلو بخارے اور تلی پیاز کے ذائقے والی لذیذ چنا بریانی۔',
    price: 800,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 800 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 1500 }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-6',
    name: 'Chana Pulao',
    nameUrdu: 'چنا پلاؤ',
    description: 'Fragrant mild cumin pulao with wholesome boiled chickpeas.',
    descriptionUrdu: 'سفید چنے اور زیرے کے تڑکے والا ہلکا اور مزیدار چنا پلاؤ۔',
    price: 800,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 800 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 1500 }
    ],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-biryani-7',
    name: 'Arabian Chicken Mandi',
    nameUrdu: 'عربین چکن مندی',
    description: 'Smoky spiced chicken steamed over flavored saffron rice with fried raisins and nuts.',
    descriptionUrdu: 'مخصوص عربی مصالحہ، کوئلے کا دھواں اور پستے بادام سے سجی ہوئی رسیلی چکن مندی۔',
    price: 1300,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1300 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 2500 }
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BIRYANI & PULAO',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: CHICKEN KARAHI ---
  {
    id: 'onorder-karahi-1',
    name: 'Chicken Karahi',
    nameUrdu: 'روایتی چکن کڑاہی',
    description: 'Fresh country chicken wok-fried in juicy tomatoes, green chillies and fresh ginger.',
    descriptionUrdu: 'تازہ ٹماٹر، ہری مرچ اور ادرک کے ساتھ کڑاہی میں بھنا ہوا لذیذ چکن۔',
    price: 1200,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1200 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-karahi-2',
    name: 'Chicken Coal Karahi',
    nameUrdu: 'چکن کوئلہ کڑاہی',
    description: 'Infused with rich authentic charcoal smoke aroma and roasted whole spices.',
    descriptionUrdu: 'دہکتے کوئلے کی مسحور کن خوشبو اور دیسی مصالحوں سے بھرپور کڑاہی۔',
    price: 1200,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1200 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-karahi-3',
    name: 'Chicken Tandoori Karahi',
    nameUrdu: 'چکن تندوری کڑاہی',
    description: 'Marinated in tangy tandoori spices and cooked down into a rich mouthwatering gravy.',
    descriptionUrdu: 'تندوری مسالے دار چکن کی چٹپٹی اور خوش رنگ کڑاہی۔',
    price: 1200,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1200 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-karahi-4',
    name: 'Chicken Dhaba Style Karahi',
    nameUrdu: 'چکن ڈھابہ اسٹائل کڑاہی',
    description: 'Highway dhaba style high-flame karahi with cracked black pepper and green chilies.',
    descriptionUrdu: 'ہائی وے ڈھابہ کے مخصوص کڑک مصالحوں اور کالی مرچ کی خاص کڑاہی۔',
    price: 1200,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1200 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-karahi-5',
    name: 'Creamy Chicken White Karahi',
    nameUrdu: 'کریمی چکن وائٹ کڑاہی',
    description: 'Velvety cream, yogurt, white pepper, and green cardamom cooked into tender chicken.',
    descriptionUrdu: 'تازہ بالائی، دہی، سفید مرچ اور بادامی گریوی والی شاہی وائٹ کڑاہی۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-karahi-6',
    name: 'Chicken Red Karahi',
    nameUrdu: 'چکن ریڈ کڑاہی',
    description: 'Extra fiery red karahi prepared with Kashmiri chilies and rich tomato reduction.',
    descriptionUrdu: 'کشمیری مرچ، خالص ٹماٹروں اور تیکھے مصالحوں کی چٹخارے دار ریڈ کڑاہی۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN KARAHI',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: BONELESS & KOFTA ---
  {
    id: 'onorder-boneless-1',
    name: 'Chicken Boneless Fry',
    nameUrdu: 'چکن بون لیس فرائی',
    description: 'Tender boneless chicken cubes stir-fried with cracked black pepper and green spices.',
    descriptionUrdu: 'بغیر ہڈی چکن کی بوٹیاں، کالی مرچ اور تیکھی ہری مرچوں میں خستہ فرائی۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BONELESS & KOFTA',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-boneless-2',
    name: 'Chicken Boneless Red Karahi',
    nameUrdu: 'چکن بون لیس ریڈ کڑاہی',
    description: 'Melt-in-mouth chicken breast fillets cooked in fiery red tomato and herb reduction.',
    descriptionUrdu: 'بون لیس چکن کے نرم ٹکڑے، خوشبودار گھی اور سرخ ٹماٹروں کی رچ گریوی۔',
    price: 2000,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 2000 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BONELESS & KOFTA',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-boneless-3',
    name: 'Traditional Chicken Kofta Curry',
    nameUrdu: 'چکن کوفتہ سالن',
    description: 'Handmade chicken meatballs simmered in a silky golden onion and yogurt sauce.',
    descriptionUrdu: 'ہاتھ سے بنے نرم چکن کوفتے، خوشبودار بادامی سالن اور گرم مصالحے کے ساتھ۔',
    price: 1500,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 3000 }
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'BONELESS & KOFTA',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: HANDI ---
  {
    id: 'onorder-handi-1',
    name: 'Traditional Chicken Handi',
    nameUrdu: 'روایتی چکن ہانڈی',
    description: 'Clay-pot cooked chicken boneless in rich onion, tomato and fenugreek gravy.',
    descriptionUrdu: 'مٹی کی ہانڈی میں دھیمی آنچ پر بنی قصوری میتھی اور مکھنی گریوی والی چکن ہانڈی۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'HANDI',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-handi-2',
    name: 'Chicken White Handi',
    nameUrdu: 'چکن وائٹ ہانڈی',
    description: 'Creamy delicacy cooked with crushed cashews, cream, mild white spices and butter.',
    descriptionUrdu: 'کاجو، بالائی، مکھن اور ہلکے مصالحوں سے تیار کردہ نفاست سے بھرپور وائٹ ہانڈی۔',
    price: 1800,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1800 }],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'HANDI',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: CHICKEN QORMA ---
  {
    id: 'onorder-qorma-1',
    name: 'Shahi Chicken Qorma',
    nameUrdu: 'شاہی چکن قورمہ',
    description: 'Authentic Karachi degi style qorma with fried onion दानेदार (danedar) gravy and kewra essence.',
    descriptionUrdu: 'خالص دیگی انداز، دانے دار گریوی، کیوڑہ اور الائچی کی مسحور کن خوشبو والا شاہی چکن قورمہ۔',
    price: 1500,
    variants: [
      { label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 },
      { label: '1 KG', labelUrdu: 'ایک کلو', price: 2800 }
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN QORMA',
    isAvailable: true,
    isActive: true
  },

  // --- ON ORDER: CHICKEN QEEMA ---
  {
    id: 'onorder-qeema-1',
    name: 'Special Chicken Qeema',
    nameUrdu: 'اسپیشل چکن قیمہ',
    description: 'Coarsely minced chicken sauteed with diced onions, tomatoes and whole spices.',
    descriptionUrdu: 'ہاتھ کے کٹے چکن کا لذیذ قیمہ، باریک پیاز اور ٹماٹر کے چٹپٹے مصالحے کے ساتھ۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN QEEMA',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-qeema-2',
    name: 'Chicken Dum Qeema (Coal Smoked)',
    nameUrdu: 'چکن دم قیمہ (کوئلہ دھواں)',
    description: 'Slow cooked ground chicken infused with charcoal smoke and fresh ginger.',
    descriptionUrdu: 'کوئلے کے دھوئیں سے مہکتا ہوا دم لگا چکن قیمہ، ہرا دھنیا اور ادرک گارنش۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN QEEMA',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-qeema-3',
    name: 'Chicken Hari Mirch Qeema',
    nameUrdu: 'چکن ہری مرچ قیمہ',
    description: 'Tossed with slit hot green chilies, cracked coriander and tangy lemon.',
    descriptionUrdu: 'تیز ہری مرچوں، کٹے دھنیے اور لیموں کے چٹخارے سے بھنا ہوا چکن قیمہ۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN QEEMA',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'onorder-qeema-4',
    name: 'Chicken Kali Mirch Qeema',
    nameUrdu: 'چکن کالی مرچ قیمہ',
    description: 'Light yogurt based ground chicken seasoned with freshly crushed black peppercorns.',
    descriptionUrdu: 'تازہ پسی کالی مرچ اور ہلکے دہی کی گریوی میں پکا زود ہضم چکن قیمہ۔',
    price: 1500,
    variants: [{ label: '½ KG', labelUrdu: 'آدھا کلو', price: 1500 }],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'on_order',
    subCategory: 'CHICKEN QEEMA',
    isAvailable: true,
    isActive: true
  },

  // --- FROZEN ITEMS ---
  {
    id: 'frozen-1',
    name: 'Frozen Chicken Kofta (12 Pieces)',
    nameUrdu: 'فروزن چکن کوفتے (12 عدد)',
    description: 'Hygienically prepared, seasoned chicken meatballs ready to simmer into your home curry.',
    descriptionUrdu: 'گھر کے بنے صاف ستھرے 12 عدد چکن کوفتے، فریزر سے نکال کر سالن میں ڈالنے کیلئے تیار۔',
    price: 1200,
    variants: [{ label: '12 Pieces Pack', labelUrdu: '12 عدد پیکٹ', price: 1200 }],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'frozen',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'frozen-2',
    name: 'Frozen Chicken Shami Kabab (12 Pieces)',
    nameUrdu: 'فروزن چکن شامی کباب (12 عدد)',
    description: 'Silky smooth chicken and chana dal patties infused with herbs, ready to egg-dip and fry.',
    descriptionUrdu: 'خالص چکن اور چنا دال کے ریشے دار 12 عدد شامی کباب، انڈے میں تلنے کیلئے تیار۔',
    price: 900,
    variants: [{ label: '12 Pieces Pack', labelUrdu: '12 عدد پیکٹ', price: 900 }],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'frozen',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'frozen-3',
    name: 'Frozen Beef Shami Kabab (12 Pieces)',
    nameUrdu: 'فروزن بیف شامی کباب (12 عدد)',
    description: 'Authentic homemade beef shami kababs prepared with tender beef and lentils.',
    descriptionUrdu: 'خالص بچھیا کے گوشت اور چنا دال سے تیار کردہ 12 عدد ریشے دار بیف شامی کباب۔',
    price: 1100,
    variants: [{ label: '12 Pieces Pack', labelUrdu: '12 عدد پیکٹ', price: 1100 }],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'frozen',
    isAvailable: true,
    isActive: true
  },

  // --- KABAB (Ready to Eat) ---
  {
    id: 'kabab-1',
    name: 'Chicken Shami Kabab (Ready to Eat)',
    nameUrdu: 'چکن شامی کباب (2 دانے)',
    description: 'Freshly pan-fried golden chicken shami kababs served hot.',
    descriptionUrdu: 'انڈے کی سنہری تہہ میں تلے ہوئے تازہ گرم چکن شامی کباب۔',
    price: 150,
    variants: [{ label: '2 Pieces', labelUrdu: '2 عدد', price: 150 }],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'kabab',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'kabab-2',
    name: 'Beef Shami Kabab (Ready to Eat)',
    nameUrdu: 'بیف شامی کباب (2 دانے)',
    description: 'Savory fried tender beef shami kababs with mint chutney.',
    descriptionUrdu: 'خالص بیف کے ریشے دار تلے ہوئے 2 عدد مزیدار شامی کباب۔',
    price: 200,
    variants: [{ label: '2 Pieces', labelUrdu: '2 عدد', price: 200 }],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'kabab',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'kabab-3',
    name: 'Chicken & Beef Chapli Kabab',
    nameUrdu: 'چکن و بیف چپلی کباب (2 دانے)',
    description: 'Crispy outer edge Peshawari style chapli kababs with crushed pomegranate and tomatoes.',
    descriptionUrdu: 'اناردانہ، کٹا دھنیا اور ٹماٹر کے ساتھ بنے روایتی پیشاوری چپلی کباب۔',
    price: 250,
    variants: [{ label: '2 Pieces', labelUrdu: '2 عدد', price: 250 }],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: 'kabab',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'kabab-4',
    name: 'Crispy Aloo Kabab',
    nameUrdu: 'کرسپی آلو کباب (2 دانے)',
    description: 'Mashed potatoes blended with spices and mint, coated and pan-fried to crisp perfection.',
    descriptionUrdu: 'ہری مرچ، پودینے اور مسالوں سے بنے خستہ و مزیدار تلے ہوئے آلو کباب۔',
    price: 100,
    variants: [{ label: '2 Pieces', labelUrdu: '2 عدد', price: 100 }],
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=800&q=80',
    category: 'kabab',
    isAvailable: true,
    isActive: true
  }
];
