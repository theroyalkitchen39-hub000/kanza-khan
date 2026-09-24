export interface PriceVariant {
  label: string;
  labelUrdu?: string;
  price: number;
}

export type MenuCategoryType = 
  | 'daily'
  | 'patient'
  | 'roti'
  | 'sweets'
  | 'roti_paratha'
  | 'sides'
  | 'on_order'
  | 'frozen'
  | 'kabab';

export interface MenuItem {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  price: number;
  variants?: PriceVariant[];
  image: string;
  category: MenuCategoryType;
  subCategory?: string;
  isAvailable: boolean;
  isActive: boolean;
  isDailyMenu?: boolean;
  isPatientSpecial?: boolean;
  dailySlotIndex?: number;
  patientSlotIndex?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface CartItem {
  cartItemId: string; // unique for item + variant combo
  item: MenuItem;
  selectedVariant?: PriceVariant;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  deliveryCharges: number;
  items: {
    id: string;
    name: string;
    variant?: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: 'JazzCash';
  jazzCashTxnId?: string;
  jazzCashSenderNumber?: string;
  specialInstructions?: string;
  status: 'pending' | 'confirmed' | 'cooking' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: number;
}

export interface DeliveryArea {
  name: string;
  nameUrdu: string;
  fee: number;
}

export interface WebsiteSettings {
  restaurantName: string;
  tagline: string;
  taglineUrdu: string;
  operatingFrom: string;
  operatingFromUrdu: string;
  deliveryCoverage: string;
  deliveryCoverageUrdu: string;
  jazzCashNumber: string;
  jazzCashTitle: string;
  whatsappNumber: string;
  deliveryAreas: DeliveryArea[];
  announcementText: string;
  announcementTextUrdu: string;
  isAcceptingOrders: boolean;
  businessHours: string;
  businessHoursUrdu: string;
}

export type Language = 'en' | 'ur';
