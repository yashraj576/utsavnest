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
  INITIAL_UPI_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_STORE_CATEGORIES,
  INITIAL_SHIPPING_SETTINGS,
  INITIAL_HOMEPAGE_SECTIONS,
} from '../data/initialData';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

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

// Secret Admin Password
const ADMIN_PASSWORD = 'UtsavNest#7vQ!29_NX@84$Lm';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('utsavnest_theme_mode') as ThemeMode) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>(INITIAL_STORE_CATEGORIES);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(INITIAL_SHIPPING_SETTINGS);
  const [homepageSections, setHomepageSections] = useState<HomepageSectionsConfig>(INITIAL_HOMEPAGE_SECTIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [upiSettings, setUpiSettingsState] = useState<UPISettings>(INITIAL_UPI_SETTINGS);

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

  // Tap tracking
  const tapTimesRef = useRef<number[]>([]);
  const lastTapTimeRef = useRef<number>(0);

  // --- Real-time Firebase Listeners ---
  useEffect(() => {
    // 1. Products Sync
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Product));
        setProducts(loaded);
      } else {
        // First-time database population
        INITIAL_PRODUCTS.forEach((p) => {
          setDoc(doc(db, 'products', p.id), p).catch(console.error);
        });
      }
    }, (err) => console.error('Products sync error:', err));

    // 2. Orders Sync
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const loaded: Order[] = [];
      snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Order));
      // Sort newest orders first
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(loaded);
    }, (err) => console.error('Orders sync error:', err));

    // 3. Settings Sync (Banners, Categories, UPI, Settings)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.banners) setBanners(data.banners);
        if (data.categories) setStoreCategories(data.categories);
        if (data.shipping) setShippingSettings(data.shipping);
        if (data.sections) setHomepageSections(data.sections);
        if (data.upi) setUpiSettingsState(data.upi);
      } else {
        // Initialize global settings
        setDoc(doc(db, 'settings', 'global'), {
          banners: INITIAL_BANNERS,
          categories: INITIAL_STORE_CATEGORIES,
          shipping: INITIAL_SHIPPING_SETTINGS,
          sections: INITIAL_HOMEPAGE_SECTIONS,
          upi: INITIAL_UPI_SETTINGS
        }).catch(console.error);
      }
    }, (err) => console.error('Settings sync error:', err));

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Local device sync for Cart & Wishlist
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
    try {
      localStorage.setItem('utsavnest_theme_mode', mode);
    } catch (e) {
      console.error(e);
    }
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

  const calculateShippingFee = (_subtotal: number): number => 0;

  // Banners to Firestore
  const updateBannersInFirestore = async (newBanners: Banner[]) => {
    setBanners(newBanners);
    try {
      await setDoc(doc(db, 'settings', 'global'), { banners: newBanners }, { merge: true });
    } catch (e) {
      console.error('Failed to sync banners:', e);
    }
  };

  const addBanner = (bannerData: Omit<Banner, 'id' | 'orderIndex'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner_${Date.now()}`,
      orderIndex: banners.length,
    };
    updateBannersInFirestore([...banners, newBanner]);
  };

  const updateBanner = (updated: Banner) => {
    const next = banners.map((b) => (b.id === updated.id ? updated : b));
    updateBannersInFirestore(next);
  };

  const deleteBanner = (id: string) => {
    const next = banners.filter((b) => b.id !== id);
    updateBannersInFirestore(next);
  };

  const reorderBanners = (reordered: Banner[]) => {
    updateBannersInFirestore(reordered);
  };

  const toggleBannerEnabled = (id: string) => {
    const next = banners.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b));
    updateBannersInFirestore(next);
  };

  // Categories to Firestore
  const updateCategoriesInFirestore = async (newCats: StoreCategory[]) => {
    setStoreCategories(newCats);
    try {
      await setDoc(doc(db, 'settings', 'global'), { categories: newCats }, { merge: true });
    } catch (e) {
      console.error('Failed to sync categories:', e);
    }
  };

  const addCategory = (catData: Omit<StoreCategory, 'id'>) => {
    const newCat: StoreCategory = {
      ...catData,
      id: `cat_${Date.now()}`,
    };
    updateCategoriesInFirestore([...storeCategories, newCat]);
  };

  const updateCategory = (updated: StoreCategory) => {
    const next = storeCategories.map((c) => (c.id === updated.id ? updated : c));
    updateCategoriesInFirestore(next);
  };

  const deleteCategory = (id: string) => {
    const next = storeCategories.filter((c) => c.id !== id);
    updateCategoriesInFirestore(next);
  };

  const toggleCategoryEnabled = (id: string) => {
    const next = storeCategories.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    updateCategoriesInFirestore(next);
  };

  const reorderCategories = (reordered: StoreCategory[]) => {
    updateCategoriesInFirestore(reordered);
  };

  // Settings to Firestore
  const updateHomepageSections = async (config: HomepageSectionsConfig) => {
    setHomepageSections(config);
    try {
      await setDoc(doc(db, 'settings', 'global'), { sections: config }, { merge: true });
    } catch (e) {
      console.error('Failed to sync sections:', e);
    }
  };

  const updateShippingSettings = async (settings: ShippingSettings) => {
    setShippingSettings(settings);
    try {
      await setDoc(doc(db, 'settings', 'global'), { shipping: settings }, { merge: true });
    } catch (e) {
      console.error('Failed to sync shipping settings:', e);
    }
  };

  const updateUpiSettings = async (settings: UPISettings) => {
    setUpiSettingsState(settings);
    try {
      await setDoc(doc(db, 'settings', 'global'), { upi: settings }, { merge: true });
    } catch (e) {
      console.error('Failed to sync UPI settings:', e);
    }
  };

  // Admin secret taps
  const triggerLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 60) return;
    lastTapTimeRef.current = now;
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t <= 2500), now];
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

  // Products to Firestore
  const addProduct = async (newProdData: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id,
      enabled: newProdData.enabled !== false,
      stockQuantity: newProdData.stockQuantity ?? 20,
      rating: 5.0,
      reviewsCount: 1,
    };
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (e) {
      console.error('Firestore addProduct error:', e);
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      await setDoc(doc(db, 'products', updated.id), updated);
    } catch (e) {
      console.error('Firestore updateProduct error:', e);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
    if (selectedProduct && selectedProduct.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const toggleProductEnabled = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const updated = { ...target, enabled: !(target.enabled !== false) };
    try {
      await setDoc(doc(db, 'products', productId), updated);
    } catch (e) {
      console.error('Firestore toggleProductEnabled error:', e);
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error('Firestore deleteProduct error:', e);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  // Orders to Firestore
  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod = 'COD',
    paymentDetails?: { utr?: string; screenshot?: string },
    discount = 0
  ): Order => {
    const itemsSubtotal = cart.reduce(
      (sum, item) => sum + (Number(item.product.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const validDiscount = Math.max(0, Number(discount) || 0);
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

    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
      console.error('Firestore placeOrder error:', err);
    });

    clearCart();
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    const updated = {
      ...target,
      status,
      ...(notes !== undefined ? { statusNotes: notes } : {})
    };
    try {
      await setDoc(doc(db, 'orders', orderId), updated);
    } catch (e) {
      console.error('Firestore updateOrderStatus error:', e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.error('Firestore deleteOrder error:', e);
    }
  };

  const resetOrders = async () => {
    try {
      const batch = writeBatch(db);
      orders.forEach((o) => {
        batch.delete(doc(db, 'orders', o.id));
      });
      await batch.commit();
    } catch (e) {
      console.error('Firestore resetOrders error:', e);
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
