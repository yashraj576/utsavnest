import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  Order,
  CartItem,
  UPISettings,
  OrderStatus,
  CustomerDetails,
  ThemeMode,
  Banner,
  StoreCategory,
  ShippingSettings,
  HomepageSectionsConfig,
  PaymentMethod,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_UPI_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_STORE_CATEGORIES,
  INITIAL_SHIPPING_SETTINGS,
  INITIAL_HOMEPAGE_SECTIONS,
} from '../data/initialData';

export type AppTab = 'home' | 'categories' | 'shop' | 'cart' | 'orders' | 'admin';

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  upiSettings: UPISettings;
  themeMode: ThemeMode;
  banners: Banner[];
  storeCategories: StoreCategory[];
  shippingSettings: ShippingSettings;
  homepageSections: HomepageSectionsConfig;

  activeTab: AppTab;
  activeCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  completedOrder: Order | null;
  wishlistIds: string[];

  // Admin secret login
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  triggerLogoTap: () => void;
  triggerLogoLongPress: () => void;

  // Navigation & Modals
  setActiveTab: (tab: AppTab) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (p: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setCompletedOrder: (o: Order | null) => void;
  toggleWishlist: (productId: string) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  calculateShippingFee: (subtotal: number) => number;

  // Theme & Appearance
  setThemeMode: (mode: ThemeMode) => void;

  // Banner Management
  addBanner: (banner: Omit<Banner, 'id' | 'orderIndex'>) => void;
  updateBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (reordered: Banner[]) => void;
  toggleBannerEnabled: (id: string) => void;

  // Category Management
  addCategory: (cat: Omit<StoreCategory, 'id'>) => void;
  updateCategory: (cat: StoreCategory) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryEnabled: (id: string) => void;
  reorderCategories: (reordered: StoreCategory[]) => void;

  // Homepage sections & shipping settings
  updateHomepageSections: (config: HomepageSectionsConfig) => void;
  updateShippingSettings: (settings: ShippingSettings) => void;

  // Product control (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductEnabled: (id: string) => void;

  // UPI settings control (Admin)
  updateUpiSettings: (settings: UPISettings) => void;

  // Order management (Checkout & Admin)
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    paymentDetails?: { utr?: string; screenshot?: string },
    discount?: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  deleteOrder: (orderId: string) => void;
  resetOrders: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Secret Admin Password provided by user
const ADMIN_PASSWORD = 'UtsavNest#7vQ!29_NX@84$Lm';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_theme_mode');
      return (stored as ThemeMode) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_banners');
      return stored ? JSON.parse(stored) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_categories');
      return stored ? JSON.parse(stored) : INITIAL_STORE_CATEGORIES;
    } catch {
      return INITIAL_STORE_CATEGORIES;
    }
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_shipping');
      return stored ? JSON.parse(stored) : INITIAL_SHIPPING_SETTINGS;
    } catch {
      return INITIAL_SHIPPING_SETTINGS;
    }
  });

  const [homepageSections, setHomepageSections] = useState<HomepageSectionsConfig>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_hp_sections');
      return stored ? JSON.parse(stored) : INITIAL_HOMEPAGE_SECTIONS;
    } catch {
      return INITIAL_HOMEPAGE_SECTIONS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_products');
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Remove legacy demo/seed orders
          const cleaned = parsed.filter(
            (o: Order) => o && o.id !== 'UN-2026-9812' && o.id !== 'UN-2026-9790'
          );
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [upiSettings, setUpiSettings] = useState<UPISettings>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_upi');
      return stored ? JSON.parse(stored) : INITIAL_UPI_SETTINGS;
    } catch {
      return INITIAL_UPI_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('utsavnest_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Hidden Admin auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('utsavnest_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Tap tracking for 7 quick taps within 2.5 seconds window
  const tapTimesRef = useRef<number[]>([]);
  const lastTapTimeRef = useRef<number>(0);

  // LocalStorage synchronizations
  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_theme_mode', themeMode);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_banners', JSON.stringify(banners));
    } catch (e) {
      console.error(e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_categories', JSON.stringify(storeCategories));
    } catch (e) {
      console.error(e);
    }
  }, [storeCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_shipping', JSON.stringify(shippingSettings));
    } catch (e) {
      console.error(e);
    }
  }, [shippingSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_hp_sections', JSON.stringify(homepageSections));
    } catch (e) {
      console.error(e);
    }
  }, [homepageSections]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_upi', JSON.stringify(upiSettings));
    } catch (e) {
      console.error(e);
    }
  }, [upiSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('utsavnest_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const calculateShippingFee = (_subtotal: number): number => {
    // UtsavNest provides FREE DELIVERY across all of India. Delivery fee is ALWAYS ₹0.
    return 0;
  };

  // Banners
  const addBanner = (bannerData: Omit<Banner, 'id' | 'orderIndex'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner_${Date.now()}`,
      orderIndex: banners.length,
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (updated: Banner) => {
    setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const reorderBanners = (reordered: Banner[]) => {
    setBanners(reordered);
  };

  const toggleBannerEnabled = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  // Categories
  const addCategory = (catData: Omit<StoreCategory, 'id'>) => {
    const newCat: StoreCategory = {
      ...catData,
      id: `cat_${Date.now()}`,
    };
    setStoreCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (updated: StoreCategory) => {
    setStoreCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const deleteCategory = (id: string) => {
    setStoreCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCategoryEnabled = (id: string) => {
    setStoreCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const reorderCategories = (reordered: StoreCategory[]) => {
    setStoreCategories(reordered);
  };

  // Sections & Shipping
  const updateHomepageSections = (config: HomepageSectionsConfig) => {
    setHomepageSections(config);
  };

  const updateShippingSettings = (settings: ShippingSettings) => {
    setShippingSettings(settings);
  };

  // Hidden admin access: 7 quick taps within 2.5 seconds
  const triggerLogoTap = () => {
    const now = Date.now();
    // Guard against duplicate synthetic events for the same contact
    if (now - lastTapTimeRef.current < 60) {
      return;
    }
    lastTapTimeRef.current = now;

    // Filter to taps strictly within the last 2500ms (2.5 seconds)
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t <= 2500), now];

    // After 7 valid quick taps, immediately open the Admin Login modal
    if (tapTimesRef.current.length >= 7) {
      tapTimesRef.current = [];
      setIsAdminLoginModalOpen(true);
    }
  };

  const triggerLogoLongPress = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setIsAdminLoginModalOpen(false);
      try {
        sessionStorage.setItem('utsavnest_admin_auth', 'true');
      } catch {}
      setActiveTab('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('utsavnest_admin_auth');
    } catch {}
    setActiveTab('home');
  };

  // Product controls
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod_${Date.now()}`,
      enabled: newProdData.enabled !== false,
      stockQuantity: newProdData.stockQuantity ?? 20,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct && selectedProduct.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const toggleProductEnabled = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, enabled: !(p.enabled !== false) } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const updateUpiSettings = (settings: UPISettings) => {
    setUpiSettings(settings);
  };

  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod = 'COD',
    paymentDetails?: { utr?: string; screenshot?: string },
    discount = 0
  ): Order => {
    // Calculate subtotal accurately from each item (price * quantity)
    const itemsSubtotal = cart.reduce(
      (sum, item) => sum + (Number(item.product.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const validDiscount = Math.max(0, Number(discount) || 0);
    // FREE delivery across India: deliveryFee is always 0
    const finalTotal = Math.max(0, itemsSubtotal - validDiscount);

    const newOrder: Order = {
      id: `UN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      customer,
      subtotal: itemsSubtotal,
      discount: validDiscount,
      shipping: 0,
      deliveryFee: 0,
      total: finalTotal,
      paymentMethod,
      upiIdUsed: paymentMethod === 'UPI' ? upiSettings.upiId : undefined,
      utrNumber: paymentMethod === 'UPI' ? paymentDetails?.utr || '' : undefined,
      paymentScreenshot: paymentMethod === 'UPI' ? paymentDetails?.screenshot || '' : undefined,
      status: 'Pending',
      statusNotes:
        paymentMethod === 'COD'
          ? 'Cash on Delivery order placed. Cash to be collected at doorstep.'
          : 'Payment submitted via manual UPI. Awaiting merchant confirmation.',
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      try {
        localStorage.setItem('utsavnest_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save orders to localStorage', e);
      }
      return next;
    });

    clearCart();
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              ...(notes !== undefined ? { statusNotes: notes } : {}),
            }
          : order
      );
      try {
        localStorage.setItem('utsavnest_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist order status to localStorage', e);
      }
      return updated;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem('utsavnest_orders', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to delete order from localStorage', e);
      }
      return next;
    });
  };

  const resetOrders = () => {
    setOrders([]);
    try {
      localStorage.setItem('utsavnest_orders', JSON.stringify([]));
    } catch (e) {
      console.error('Failed to reset orders in localStorage', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        cart,
        upiSettings,
        themeMode,
        banners,
        storeCategories,
        shippingSettings,
        homepageSections,
        activeTab,
        activeCategory,
        searchQuery,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        completedOrder,
        wishlistIds,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        triggerLogoTap,
        triggerLogoLongPress,
        setActiveTab,
        setActiveCategory,
        setSearchQuery,
        setSelectedProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setCompletedOrder,
        toggleWishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        calculateShippingFee,
        setThemeMode,
        addBanner,
        updateBanner,
        deleteBanner,
        reorderBanners,
        toggleBannerEnabled,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryEnabled,
        reorderCategories,
        updateHomepageSections,
        updateShippingSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductEnabled,
        updateUpiSettings,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        resetOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
