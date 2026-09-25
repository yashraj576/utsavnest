export type StockStatus = 'in_stock' | 'out_of_stock' | 'low_stock';

export type ThemeMode = 'normal' | 'festive';

export type PaymentMethod = 'COD' | 'UPI';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  categoryLink: string;
  discountBadge?: string;
  imageUrl: string; // base64 or SVG
  enabled: boolean;
  orderIndex: number;
  startDate?: string;
  endDate?: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  iconName: string;
  imageUrl?: string;
  enabled: boolean;
  orderIndex?: number;
}

export interface ShippingSettings {
  enabled: boolean;
  freeShippingThreshold: number;
  standardShippingCharge: number;
  allIndiaDelivery: boolean;
  deliveryNoticeText: string;
}

export interface HomepageSectionsConfig {
  showHeroSlider: boolean;
  showCategoriesRow: boolean;
  showOffersStrip: boolean;
  showTrendingProducts: boolean;
  showShopByCategory: boolean;
  showFeaturedProducts: boolean;
  showPromotionalBanner: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  dimensions: string;
  material: string;
  stockStatus: StockStatus;
  stockQuantity?: number;
  enabled?: boolean; // visibility
  image: string;
  badge?: string; // e.g. "Bestseller", "New Arrival", "20% OFF"
  tags?: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  building: string; // House/Flat/Building
  street: string; // Street/Area
  city: string;
  district: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Rejected'
  | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  discount: number;
  shipping: number; // Always 0
  deliveryFee: number; // Always 0
  total: number;
  paymentMethod: PaymentMethod;
  upiIdUsed?: string;
  utrNumber?: string;
  paymentScreenshot?: string; // base64 or SVG data URL
  status: OrderStatus;
  statusNotes?: string;
}

export interface UPISettings {
  upiId: string;
  payeeName: string;
  qrImage: string; // base64 image or SVG
  instructions: string;
}

// Complete List of All 28 States + 8 Union Territories in India
export const INDIAN_STATES_AND_UTS: string[] = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];
