import {
  Product,
  Order,
  UPISettings,
  Banner,
  StoreCategory,
  ShippingSettings,
  HomepageSectionsConfig,
} from '../types';

export const INITIAL_SHIPPING_SETTINGS: ShippingSettings = {
  enabled: true,
  freeShippingThreshold: 0,
  standardShippingCharge: 0,
  allIndiaDelivery: true,
  deliveryNoticeText: '🚚 Free Delivery Across India (₹0 Shipping)',
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionsConfig = {
  showHeroSlider: true,
  showCategoriesRow: true,
  showOffersStrip: true,
  showTrendingProducts: true,
  showShopByCategory: true,
  showFeaturedProducts: true,
  showPromotionalBanner: true,
};

// Generates crisp, modern SVG banner illustrations as base64 Data URIs
export const createBannerSvg = (title: string, subtitle: string, gradientType: 'amber' | 'emerald' | 'cream' | 'indigo'): string => {
  const gradients = {
    amber: {
      bg1: '#78350F',
      bg2: '#92400E',
      accent: '#F59E0B',
      light: '#FEF3C7',
    },
    emerald: {
      bg1: '#064E3B',
      bg2: '#047857',
      accent: '#34D399',
      light: '#D1FAE5',
    },
    cream: {
      bg1: '#292524',
      bg2: '#44403C',
      accent: '#D97706',
      light: '#FAF4E8',
    },
    indigo: {
      bg1: '#1E1B4B',
      bg2: '#3730A3',
      accent: '#818CF8',
      light: '#E0E7FF',
    },
  };

  const g = gradients[gradientType];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${g.bg1}" />
          <stop offset="100%" stop-color="${g.bg2}" />
        </linearGradient>
        <radialGradient id="auraGlow" cx="80%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${g.accent}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${g.accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="480" fill="url(#bgGrad)" />
      <circle cx="950" cy="180" r="280" fill="url(#auraGlow)" />
      
      <!-- Architectural Modern Shapes -->
      <g opacity="0.15" stroke="#FFFFFF" stroke-width="1.5" fill="none">
        <circle cx="1020" cy="240" r="160" />
        <circle cx="1020" cy="240" r="220" />
        <rect x="850" y="80" width="280" height="320" rx="40" />
      </g>

      <!-- Decorative Silhouette Vase / Vessel -->
      <g transform="translate(920, 140)">
        <path d="M 60 200 C 30 150, 40 90, 70 70 L 60 40 L 100 40 L 90 70 C 120 90, 130 150, 100 200 Z" fill="${g.accent}" opacity="0.85" />
        <ellipse cx="80" cy="40" rx="20" ry="6" fill="${g.light}" />
        <circle cx="130" cy="180" r="14" fill="#FBBF24" opacity="0.9" />
        <circle cx="35" cy="190" r="10" fill="#FDE047" opacity="0.8" />
      </g>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner_1',
    title: 'Curated Living & Home',
    subtitle: 'Handcrafted decor, pure brass accents & timeless textures for every space',
    buttonText: 'Shop Home Decor',
    categoryLink: 'Home Decor',
    discountBadge: 'NEW SEASON',
    imageUrl: createBannerSvg('Curated Living', 'Modern Indian Homes', 'amber'),
    enabled: true,
    orderIndex: 0,
  },
  {
    id: 'banner_2',
    title: 'Artisanal Style & Living',
    subtitle: 'Ethical craftsmanship, sustainable textiles and expressive lifestyle picks',
    buttonText: 'Explore Fashion',
    categoryLink: 'Fashion',
    discountBadge: 'UP TO 30% OFF',
    imageUrl: createBannerSvg('Artisanal Style', 'Everyday Elegance', 'cream'),
    enabled: true,
    orderIndex: 1,
  },
  {
    id: 'banner_3',
    title: 'The Art of Gifting',
    subtitle: 'Thoughtful curated gift boxes and keepsake decor delivered all across India',
    buttonText: 'View Gift Picks',
    categoryLink: 'Gifts',
    discountBadge: 'PAN-INDIA DELIVERY',
    imageUrl: createBannerSvg('The Art of Gifting', 'All-India Express', 'emerald'),
    enabled: true,
    orderIndex: 2,
  },
];

export const INITIAL_STORE_CATEGORIES: StoreCategory[] = [
  { id: 'cat_all', name: 'All', iconName: 'Sparkles', enabled: true, orderIndex: 0 },
  { id: 'cat_home', name: 'Home Decor', iconName: 'Home', enabled: true, orderIndex: 1 },
  { id: 'cat_fashion', name: 'Fashion', iconName: 'Shirt', enabled: true, orderIndex: 2 },
  { id: 'cat_beauty', name: 'Beauty & Wellness', iconName: 'Sparkles', enabled: true, orderIndex: 3 },
  { id: 'cat_acc', name: 'Accessories', iconName: 'Watch', enabled: true, orderIndex: 4 },
  { id: 'cat_gifts', name: 'Gifts', iconName: 'Gift', enabled: true, orderIndex: 5 },
  { id: 'cat_festive', name: 'Festive & Puja', iconName: 'Flame', enabled: true, orderIndex: 6 },
  { id: 'cat_life', name: 'Lifestyle', iconName: 'Coffee', enabled: true, orderIndex: 7 },
];

export const createProductSvg = (title: string, accentColor: string, type: 'uruli' | 'toran' | 'lantern' | 'diya' | 'rangoli' | 'hamper' | 'vase' | 'apparel' | 'acc'): string => {
  let innerGraphic = '';

  if (type === 'vase') {
    innerGraphic = `
      <!-- Modern Minimalist Ceramic Vase -->
      <path d="M 170 120 L 230 120 L 220 160 C 260 210, 250 260, 220 270 L 180 270 C 150 260, 140 210, 180 160 Z" fill="${accentColor}" stroke="#44403C" stroke-width="2"/>
      <ellipse cx="200" cy="120" rx="30" ry="8" fill="#FDE68A"/>
      <!-- Pampas grass / dried botanicals -->
      <path d="M 200 120 Q 230 60 250 40" stroke="#78716C" stroke-width="3" fill="none"/>
      <circle cx="250" cy="40" r="10" fill="#D97706" opacity="0.6"/>
      <path d="M 200 120 Q 180 70 160 50" stroke="#78716C" stroke-width="3" fill="none"/>
      <circle cx="160" cy="50" r="10" fill="#B45309" opacity="0.6"/>
    `;
  } else if (type === 'apparel') {
    innerGraphic = `
      <!-- Handcrafted Silk Stole / Scarf -->
      <rect x="130" y="90" width="140" height="170" rx="14" fill="${accentColor}" stroke="#78350F" stroke-width="2"/>
      <!-- Traditional Ajrakh / Zari Pattern Lines -->
      <line x1="130" y1="120" x2="270" y2="120" stroke="#FEF3C7" stroke-width="3"/>
      <line x1="130" y1="230" x2="270" y2="230" stroke="#FEF3C7" stroke-width="4" stroke-dasharray="6,4"/>
      <g fill="#FEF3C7">
        <circle cx="170" cy="160" r="8"/>
        <circle cx="230" cy="160" r="8"/>
        <circle cx="200" cy="195" r="10"/>
      </g>
      <!-- Tassels -->
      ${[140, 165, 190, 215, 240, 260].map(x => `<line x1="${x}" y1="260" x2="${x}" y2="280" stroke="#B45309" stroke-width="2.5"/>`).join('')}
    `;
  } else if (type === 'acc') {
    innerGraphic = `
      <!-- Artisanal Jute / Leather Tote Bag -->
      <rect x="130" y="130" width="140" height="130" rx="16" fill="${accentColor}" stroke="#44403C" stroke-width="2"/>
      <path d="M 160 130 C 160 70, 240 70, 240 130" fill="none" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
      <!-- Brass buckle charm -->
      <circle cx="200" cy="170" r="12" fill="#F59E0B" stroke="#78350F" stroke-width="2"/>
      <rect x="150" y="210" width="100" height="15" rx="3" fill="#FAF4E8" opacity="0.4"/>
    `;
  } else if (type === 'uruli') {
    innerGraphic = `
      <ellipse cx="200" cy="210" rx="140" ry="55" fill="#B45309" opacity="0.4" />
      <path d="M 70 190 C 70 260, 330 260, 330 190 C 330 205, 70 205, 70 190 Z" fill="url(#brassGrad)" stroke="#78350F" stroke-width="2"/>
      <ellipse cx="200" cy="190" rx="130" ry="40" fill="#F59E0B" opacity="0.3"/>
      <ellipse cx="200" cy="190" rx="120" ry="32" fill="#0284C7" opacity="0.25"/>
      <circle cx="160" cy="190" r="14" fill="#EA580C"/>
      <circle cx="160" cy="190" r="8" fill="#FBBF24"/>
      <circle cx="230" cy="195" r="15" fill="#D97706"/>
      <circle cx="195" cy="180" r="12" fill="#E11D48"/>
      <circle cx="130" cy="185" r="8" fill="#D97706"/>
      <ellipse cx="130" cy="177" rx="4" ry="7" fill="#FEF08A"/>
      <circle cx="265" cy="185" r="8" fill="#D97706"/>
      <ellipse cx="265" cy="177" rx="4" ry="7" fill="#FEF08A"/>
      <path d="M 200 135 C 190 150, 190 170, 200 175 C 210 170, 210 150, 200 135 Z" fill="url(#brassGrad)"/>
    `;
  } else if (type === 'toran') {
    innerGraphic = `
      <rect x="40" y="100" width="320" height="14" rx="4" fill="#991B1B"/>
      <path d="M 50 107 Q 100 140 150 107 Q 200 140 250 107 Q 300 140 350 107" fill="none" stroke="#F59E0B" stroke-width="4"/>
      ${[70, 120, 170, 200, 230, 280, 330].map((x, i) => `
        <line x1="${x}" y1="107" x2="${x}" y2="${160 + (i % 2) * 35}" stroke="#D97706" stroke-width="2"/>
        <circle cx="${x}" cy="${130 + (i % 2) * 20}" r="11" fill="${i % 2 === 0 ? '#EA580C' : '#F59E0B'}"/>
        <circle cx="${x}" cy="${130 + (i % 2) * 20}" r="6" fill="#FEF08A"/>
        <path d="M ${x - 8} ${150 + (i % 2) * 35} L ${x + 8} ${150 + (i % 2) * 35} L ${x + 11} ${165 + (i % 2) * 35} L ${x - 11} ${165 + (i % 2) * 35} Z" fill="url(#brassGrad)"/>
      `).join('')}
    `;
  } else if (type === 'lantern') {
    innerGraphic = `
      <line x1="200" y1="40" x2="200" y2="100" stroke="#B45309" stroke-width="3" stroke-dasharray="3,3"/>
      <path d="M 170 100 L 230 100 L 215 80 L 185 80 Z" fill="url(#brassGrad)"/>
      <polygon points="150,130 250,130 230,230 170,230" fill="url(#lanternAmber)" stroke="#78350F" stroke-width="2"/>
      <circle cx="200" cy="180" r="28" fill="#FEF3C7" opacity="0.9"/>
      <ellipse cx="200" cy="180" rx="10" ry="18" fill="#F59E0B"/>
      <path d="M 160 140 L 240 220 M 240 140 L 160 220" stroke="#78350F" stroke-width="1.5" opacity="0.4"/>
      <rect x="170" y="230" width="60" height="12" rx="3" fill="url(#brassGrad)"/>
    `;
  } else {
    // Hamper / Gift Box
    innerGraphic = `
      <rect x="110" y="140" width="180" height="120" rx="10" fill="#FFFDF9" stroke="#E5E7EB" stroke-width="2"/>
      <rect x="100" y="125" width="200" height="24" rx="6" fill="url(#brassGrad)"/>
      <rect x="190" y="125" width="20" height="135" fill="#991B1B"/>
      <ellipse cx="185" cy="115" rx="16" ry="10" fill="#B91C1C" transform="rotate(-25 185 115)"/>
      <ellipse cx="215" cy="115" rx="16" ry="10" fill="#B91C1C" transform="rotate(25 215 115)"/>
      <circle cx="200" cy="118" r="6" fill="#F59E0B"/>
      <circle cx="150" cy="150" r="18" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
      <rect x="230" y="140" width="30" height="35" rx="4" fill="#991B1B"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="festiveBg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#FFFDF9"/>
          <stop offset="60%" stop-color="#FAF4E8"/>
          <stop offset="100%" stop-color="#F2E6CE"/>
        </radialGradient>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="45%" stop-color="#D97706"/>
          <stop offset="85%" stop-color="#92400E"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
        <linearGradient id="lanternAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#festiveBg)"/>
      <circle cx="200" cy="160" r="130" fill="${accentColor}" opacity="0.08"/>
      ${innerGraphic}
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createDiwaliProductSvg = createProductSvg;

export const createSampleUpiQrSvg = (upiId: string, payee: string): string => {
  const qrSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
      <rect width="320" height="320" fill="#FFFFFF" rx="16"/>
      <rect x="16" y="16" width="288" height="288" fill="none" stroke="#E2E8F0" stroke-width="2" rx="12"/>
      <rect x="36" y="36" width="56" height="56" fill="#1C1917" rx="6"/>
      <rect x="44" y="44" width="40" height="40" fill="#FFFFFF" rx="4"/>
      <rect x="52" y="52" width="24" height="24" fill="#B45309" rx="2"/>
      <rect x="228" y="36" width="56" height="56" fill="#1C1917" rx="6"/>
      <rect x="236" y="44" width="40" height="40" fill="#FFFFFF" rx="4"/>
      <rect x="244" y="52" width="24" height="24" fill="#B45309" rx="2"/>
      <rect x="36" y="228" width="56" height="56" fill="#1C1917" rx="6"/>
      <rect x="44" y="236" width="40" height="40" fill="#FFFFFF" rx="4"/>
      <rect x="52" y="244" width="24" height="24" fill="#B45309" rx="2"/>
      <g fill="#1C1917">
        <rect x="108" y="40" width="14" height="14"/>
        <rect x="130" y="40" width="14" height="24"/>
        <rect x="160" y="40" width="20" height="14"/>
        <rect x="190" y="40" width="16" height="16"/>
        <rect x="108" y="70" width="24" height="14"/>
        <rect x="145" y="70" width="14" height="20"/>
        <rect x="180" y="70" width="20" height="14"/>
        <rect x="40" y="110" width="16" height="20"/>
        <rect x="70" y="110" width="24" height="14"/>
        <rect x="110" y="105" width="18" height="18"/>
        <rect x="140" y="110" width="40" height="12"/>
        <rect x="200" y="105" width="16" height="24"/>
        <rect x="230" y="110" width="24" height="14"/>
        <rect x="265" y="110" width="16" height="16"/>
        <rect x="40" y="145" width="25" height="15"/>
        <rect x="80" y="145" width="15" height="25"/>
        <rect x="230" y="145" width="30" height="15"/>
        <rect x="270" y="145" width="15" height="20"/>
        <rect x="40" y="185" width="18" height="18"/>
        <rect x="75" y="185" width="20" height="12"/>
        <rect x="115" y="180" width="35" height="15"/>
        <rect x="165" y="185" width="25" height="15"/>
        <rect x="205" y="180" width="15" height="25"/>
        <rect x="235" y="185" width="20" height="15"/>
        <rect x="110" y="235" width="18" height="18"/>
        <rect x="140" y="235" width="25" height="12"/>
        <rect x="180" y="230" width="15" height="25"/>
        <rect x="210" y="235" width="20" height="15"/>
        <rect x="245" y="235" width="15" height="18"/>
        <rect x="110" y="265" width="35" height="15"/>
        <rect x="160" y="265" width="20" height="15"/>
        <rect x="195" y="265" width="30" height="15"/>
        <rect x="240" y="265" width="25" height="15"/>
      </g>
      <rect x="122" y="125" width="76" height="70" rx="10" fill="#FFFFFF" stroke="#B45309" stroke-width="2"/>
      <path d="M 160 135 L 188 145 L 188 165 C 188 180, 160 190, 160 190 C 160 190, 132 180, 132 165 L 132 145 Z" fill="#F59E0B"/>
      <text x="160" y="167" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#78350F" text-anchor="middle">UPI</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`;
};

export const INITIAL_UPI_SETTINGS: UPISettings = {
  upiId: 'utsavnest@okhdfcbank',
  payeeName: 'UtsavNest Artisanal Living',
  qrImage: createSampleUpiQrSvg('utsavnest@okhdfcbank', 'UtsavNest Artisanal Living'),
  instructions: 'Scan with Google Pay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR/UPI reference code below and upload a payment screenshot for instant order verification.',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Sculpted Ceramic Fluted Vase (Sandstone)',
    category: 'Home Decor',
    price: 1899,
    originalPrice: 2499,
    description: 'Minimalist architectural fluted ceramic flower vase with matte sandstone glaze. Hand-thrown by artisanal potters, perfect for dried botanicals and console accents.',
    dimensions: '6" Diameter x 10" Height, 1.2 kg',
    material: 'Natural Stoneware with Matte Glaze',
    stockStatus: 'in_stock',
    badge: 'Bestseller',
    image: createProductSvg('Ceramic Vase', '#B45309', 'vase'),
    tags: ['Home Decor', 'Ceramic', 'Minimalist'],
    rating: 4.9,
    reviewsCount: 114,
  },
  {
    id: 'prod_2',
    title: 'Handloom Mulberry Silk Jacquard Stole',
    category: 'Fashion',
    price: 2499,
    originalPrice: 3200,
    description: 'Woven with certified pure mulberry silk with subtle zari borders. Soft drape with antique gold luster, an enduring wardrobe staple for weddings and evenings.',
    dimensions: '28" Width x 78" Length',
    material: '100% Pure Mulberry Silk & Antique Zari',
    stockStatus: 'in_stock',
    badge: 'Handloom',
    image: createProductSvg('Silk Stole', '#991B1B', 'apparel'),
    tags: ['Fashion', 'Handloom Silk', 'Luxury'],
    rating: 4.8,
    reviewsCount: 82,
  },
  {
    id: 'prod_3',
    title: 'Heritage Brass Peacock Uruli Bowl',
    category: 'Home Decor',
    price: 3499,
    originalPrice: 4299,
    description: 'Masterfully hand-cast in pure brass by generational artisans from Moradabad. Features an intricately sculpted royal peacock crown with a hammered water basin for blossoms and scented floating wicks.',
    dimensions: '14" Diameter x 8" Height, 2.4 kg pure brass',
    material: '100% Solid Cast Brass with Antique Gold Lacquer finish',
    stockStatus: 'in_stock',
    badge: 'Artisanal',
    image: createProductSvg('Peacock Brass Uruli', '#B45309', 'uruli'),
    tags: ['Home Decor', 'Brass Handcrafted', 'Classic'],
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: 'prod_4',
    title: 'Hand-Stitched Top-Grain Leather & Canvas Tote',
    category: 'Accessories',
    price: 2999,
    originalPrice: 3999,
    description: 'Structured everyday carry tote crafted with heavy-weight organic cotton canvas and vegetable-tanned full grain leather straps. Includes padded laptop sleeve.',
    dimensions: '16" x 14" x 5", Strap Drop 10"',
    material: 'Organic Canvas & Full-Grain Saddle Leather',
    stockStatus: 'in_stock',
    badge: 'Top Pick',
    image: createProductSvg('Canvas Leather Tote', '#78350F', 'acc'),
    tags: ['Accessories', 'Everyday Carry', 'Leather'],
    rating: 4.9,
    reviewsCount: 96,
  },
  {
    id: 'prod_5',
    title: 'Noor Jali Intricate Hanging Lantern',
    category: 'Home Decor',
    price: 2799,
    originalPrice: 3500,
    description: 'Architectural pierced brass lantern casting warm geometric starburst shadow patterns across walls. Includes a safe brass candle holder cup and heavy link brass ceiling chain.',
    dimensions: '7.5" x 7.5" x 14" Height (with 18" hanging chain)',
    material: 'Hand-pierced Antique Brass sheet with protective polish',
    stockStatus: 'in_stock',
    badge: 'Warm Glow',
    image: createProductSvg('Noor Jali Lantern', '#F59E0B', 'lantern'),
    tags: ['Lighting', 'Hand-Pierced'],
    rating: 5.0,
    reviewsCount: 76,
  },
  {
    id: 'prod_6',
    title: 'The Connoisseur Curated Gift Hamper',
    category: 'Gifts',
    price: 4499,
    originalPrice: 5600,
    description: 'A presentation gift box draped in silk containing 1 Handcrafted Brass Bowl, 4 Scented Soy Wax Candles, Organic Forest Honey Jar, and Raw Almonds in artisanal brass jars.',
    dimensions: '16" x 12" x 6" Rigid Keepsake Gift Box',
    material: 'Artisanal Brass, Pure Soy Wax, Organic Treats',
    stockStatus: 'in_stock',
    badge: 'Luxury Box',
    image: createProductSvg('Grand Hamper', '#92400E', 'hamper'),
    tags: ['Luxury Gifting', 'Hamper'],
    rating: 5.0,
    reviewsCount: 41,
  },
  {
    id: 'prod_7',
    title: 'Kuber Brass Akhand Diya (Pair of 2)',
    category: 'Festive & Puja',
    price: 1499,
    originalPrice: 1999,
    description: 'Traditional heavy-gauge Akhand Diya paired with borosilicate heat-resistant glass chimneys. Designed to keep the sacred flame burning continuously in breezes.',
    dimensions: '4.5" Diameter x 6.5" Height each (Pair of 2)',
    material: 'Solid Brass with Borosilicate Wind-Proof Glass',
    stockStatus: 'in_stock',
    badge: '25% OFF',
    image: createProductSvg('Kuber Deepa Diya', '#EA580C', 'diya'),
    tags: ['Puja Essential', 'Pair Set'],
    rating: 4.9,
    reviewsCount: 162,
  },
  {
    id: 'prod_8',
    title: 'Velvet & Antique Brass Bell Doorway Toran',
    category: 'Home Decor',
    price: 1899,
    originalPrice: 2499,
    description: 'Plush crimson velvet garland with golden gota borders, hand-strung silk marigolds, and sonorous antique brass temple bells for welcoming entrances.',
    dimensions: '42" Length (Standard Doorway), 9" Drop length',
    material: 'Rich Crimson Velvet, Handcrafted Brass Bells, Gold Gota',
    stockStatus: 'in_stock',
    badge: 'Handmade',
    image: createProductSvg('Velvet Toran', '#DC2626', 'toran'),
    tags: ['Entrance Decor', 'Auspicious'],
    rating: 4.8,
    reviewsCount: 94,
  },
];

export const INITIAL_ORDERS: Order[] = [];

