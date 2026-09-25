import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Product,
  Order,
  OrderStatus,
  StockStatus,
  UPISettings,
  Banner,
  StoreCategory,
  ShippingSettings,
  HomepageSectionsConfig,
  ThemeMode,
  INDIAN_STATES_AND_UTS,
} from '../types';
import {
  ShieldCheck,
  Package,
  QrCode,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  UploadCloud,
  Save,
  X,
  LogOut,
  LayoutDashboard,
  Palette,
  Truck,
  ArrowUp,
  ArrowDown,
  Copy,
  Layers,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Flame,
  CheckCircle2,
  Image as ImageIcon,
  Sliders,
  Banknote,
  Calendar,
  RotateCcw,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { createProductSvg, createBannerSvg } from '../data/initialData';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    resetOrders,
    upiSettings,
    updateUpiSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductEnabled,
    updateOrderStatus,
    deleteOrder,
    isAdminAuthenticated,
    logoutAdmin,
    setActiveTab,
    // Theme & Appearance
    themeMode,
    setThemeMode,
    homepageSections,
    updateHomepageSections,
    // Banners
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    toggleBannerEnabled,
    // Categories
    storeCategories,
    addCategory,
    deleteCategory,
    toggleCategoryEnabled,
    reorderCategories,
    // Shipping
    shippingSettings,
    updateShippingSettings,
  } = useApp();

  type AdminTab =
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'categories'
    | 'banners'
    | 'sections'
    | 'appearance'
    | 'upi'
    | 'shipping';

  const [adminSection, setAdminSection] = useState<AdminTab>('dashboard');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // --- Product Add/Edit Modal State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Home Decor',
    price: 1999,
    originalPrice: 2499,
    description: '',
    dimensions: '12" Diameter',
    material: 'Natural Stoneware & Brass',
    stockStatus: 'in_stock' as StockStatus,
    stockQuantity: 25,
    enabled: true,
    badge: 'Curated',
    image: '',
  });

  // --- Banner Add/Edit Modal State ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Shop Collection',
    categoryLink: 'Home Decor',
    discountBadge: 'NEW SEASON',
    imageUrl: '',
    startDate: '',
    endDate: '',
    enabled: true,
  });

  // --- Category Add Modal State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');

  // --- UPI Form State ---
  const [upiForm, setUpiForm] = useState<UPISettings>({ ...upiSettings });
  const [upiSavedNotice, setUpiSavedNotice] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // --- Shipping Form State ---
  const [shippingForm, setShippingForm] = useState<ShippingSettings>({ ...shippingSettings });
  const [shippingSavedNotice, setShippingSavedNotice] = useState(false);

  // --- Sections Form State ---
  const [sectionsForm, setSectionsForm] = useState<HomepageSectionsConfig>({ ...homepageSections });
  const [sectionsSavedNotice, setSectionsSavedNotice] = useState(false);

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-[#E7DECD] text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-[#B45309] mx-auto" />
        <h2 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
          Session Required
        </h2>
        <p className="text-xs text-[#78716C]">
          Administrative verification required to view store control dashboard.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 rounded-xl bg-[#78350F] text-white text-xs font-bold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Dynamic stats calculation strictly from actual order records in database
  // Pending = not counted as completed revenue
  // Rejected = ₹0 revenue
  // Cancelled = ₹0 revenue
  // Confirmed = counted
  // Shipped = counted
  // Delivered = counted
  // Each Order ID is counted only once
  const completedRevenueOrders = orders.filter(
    (o) => o && (o.status === 'Confirmed' || o.status === 'Shipped' || o.status === 'Delivered')
  );
  const countedOrderIds = new Set<string>();
  const totalRevenue = completedRevenueOrders.reduce((sum, o) => {
    if (countedOrderIds.has(o.id)) return sum;
    countedOrderIds.add(o.id);
    return sum + (Number(o.total) || 0);
  }, 0);

  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o && o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o && o.status === 'Confirmed').length;
  const shippedOrders = orders.filter((o) => o && o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o && o.status === 'Delivered').length;
  const rejectedOrders = orders.filter((o) => o && o.status === 'Rejected').length;
  const cancelledOrders = orders.filter((o) => o && o.status === 'Cancelled').length;
  const inStockCount = products.filter((p) => p.stockStatus === 'in_stock').length;

  const handleResetTestOrders = () => {
    const confirmed = window.confirm(
      'Are you sure? This will permanently remove test orders and reset sales statistics to ₹0.'
    );
    if (confirmed) {
      resetOrders();
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'all') return true;
    return order.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  // --- Product Handlers ---
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      dimensions: p.dimensions,
      material: p.material,
      stockStatus: p.stockStatus,
      stockQuantity: p.stockQuantity ?? 25,
      enabled: p.enabled !== false,
      badge: p.badge || '',
      image: p.image,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: storeCategories.find((c) => c.name !== 'All')?.name || 'Home Decor',
      price: 1899,
      originalPrice: 2499,
      description: '',
      dimensions: 'Standard Size',
      material: 'Handcrafted',
      stockStatus: 'in_stock',
      stockQuantity: 25,
      enabled: true,
      badge: 'New Arrival',
      image: createProductSvg('New Item', '#B45309', 'vase'),
    });
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productForm,
      });
    } else {
      addProduct({
        ...productForm,
        rating: 5.0,
        reviewsCount: 1,
        tags: ['Curated', productForm.category],
      });
    }
    setIsProductModalOpen(false);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductForm((prev) => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Banner Handlers ---
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      buttonText: 'Shop Collection',
      categoryLink: storeCategories.find((c) => c.name !== 'All')?.name || 'Home Decor',
      discountBadge: 'SPECIAL OFFER',
      imageUrl: createBannerSvg('Seasonal Collection', 'Curated Living', 'amber'),
      startDate: '',
      endDate: '',
      enabled: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle,
      buttonText: b.buttonText,
      categoryLink: b.categoryLink,
      discountBadge: b.discountBadge || '',
      imageUrl: b.imageUrl,
      startDate: b.startDate || '',
      endDate: b.endDate || '',
      enabled: b.enabled,
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner({
        ...editingBanner,
        ...bannerForm,
      });
    } else {
      addBanner(bannerForm);
    }
    setIsBannerModalOpen(false);
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerForm((prev) => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const reordered = [...banners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderBanners(reordered);
  };

  // --- Category Handlers ---
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      iconName: newCatIcon,
      enabled: true,
    });
    setNewCatName('');
    setIsCategoryModalOpen(false);
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= storeCategories.length) return;
    const reordered = [...storeCategories];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderCategories(reordered);
  };

  // --- UPI Handlers ---
  const handleUpiQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUpiForm((prev) => ({ ...prev, qrImage: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    updateUpiSettings(upiForm);
    setUpiSavedNotice(true);
    setTimeout(() => setUpiSavedNotice(false), 2500);
  };

  // --- Shipping Handlers ---
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingSettings({
      ...shippingForm,
      standardShippingCharge: 0, // Enforce zero delivery fee
      freeShippingThreshold: 0,
    });
    setShippingSavedNotice(true);
    setTimeout(() => setShippingSavedNotice(false), 2500);
  };

  // --- Sections Handlers ---
  const handleSaveSections = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageSections(sectionsForm);
    setSectionsSavedNotice(true);
    setTimeout(() => setSectionsSavedNotice(false), 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200 pb-24">
      {/* Top Banner with Merchant Controls & Exit */}
      <div className="bg-[#78350F] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A] block">
              Store Control Panel
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium capitalize">
              Mode: {themeMode === 'festive' ? 'Festive / Diwali' : 'Normal / Everyday'}
            </span>
          </div>
          <h1 className="font-serif-luxury text-lg sm:text-2xl font-bold">
            UtsavNest Administration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logoutAdmin}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Lock & Exit to Store"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Admin</span>
          </button>
        </div>
      </div>

      {/* 9 Dedicated Admin Tabs from Requirement 18:
          Dashboard | Products | Orders | Categories | Banners | Homepage Sections | Store Appearance | UPI Settings | Shipping Settings */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 border-b border-[#E7DECD] scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package, badge: pendingOrders },
          { id: 'categories', label: `Categories (${storeCategories.length})`, icon: Layers },
          { id: 'banners', label: `Banners (${banners.length})`, icon: ImageIcon },
          { id: 'sections', label: 'Homepage Sections', icon: Sliders },
          { id: 'appearance', label: 'Store Appearance', icon: Palette },
          { id: 'upi', label: 'UPI Settings', icon: QrCode },
          { id: 'shipping', label: 'Shipping Settings', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = adminSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setAdminSection(tab.id as AdminTab)}
              className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#78350F] text-white shadow-2xs'
                  : 'bg-white text-[#78716C] hover:bg-[#FAF4E8] border border-[#E7DECD]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 1. DASHBOARD TAB */}
      {adminSection === 'dashboard' && (
        <div className="mt-4 space-y-4">
          {/* Core Financial & Catalog Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3.5 rounded-xl border border-[#E7DECD] shadow-2xs">
              <span className="text-[10px] text-[#78716C] font-semibold block uppercase">
                Total Sales / Revenue
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#78350F] tabular-nums">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-[#A8A29E] block mt-0.5">
                Confirmed, Shipped & Delivered
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E7DECD] shadow-2xs">
              <span className="text-[10px] text-[#78716C] font-semibold block uppercase">
                Total Orders
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#D97706] tabular-nums">
                {totalOrdersCount}
              </span>
              <span className="text-[9px] text-[#A8A29E] block mt-0.5">
                {pendingOrders} awaiting review
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E7DECD] shadow-2xs">
              <span className="text-[10px] text-[#78716C] font-semibold block uppercase">
                Active Categories
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#15803D] tabular-nums">
                {storeCategories.filter((c) => c.enabled).length}
              </span>
              <span className="text-[9px] text-[#A8A29E] block mt-0.5">
                of {storeCategories.length} total categories
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E7DECD] shadow-2xs">
              <span className="text-[10px] text-[#78716C] font-semibold block uppercase">
                Catalog Items
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#1C1917] tabular-nums">
                {products.length}
              </span>
              <span className="text-[9px] text-[#A8A29E] block mt-0.5">
                {inStockCount} in stock
              </span>
            </div>
          </div>

          {/* Dynamic Order Status Breakdown per Requirement 5:
              Total Orders, Total Sales, Pending, Confirmed, Shipped, Delivered, Rejected, Cancelled */}
          <div className="bg-white p-4 rounded-xl border border-[#E7DECD] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury font-bold text-sm text-[#1C1917]">
                  Order Status Breakdown
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Calculated dynamically from real order database records
                </p>
              </div>
              <button
                onClick={() => setAdminSection('orders')}
                className="text-xs text-[#78350F] font-bold hover:underline"
              >
                Manage Orders →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending</span>
                <span className="font-mono text-base font-bold text-amber-900 block mt-0.5">
                  {pendingOrders}
                </span>
                <span className="text-[9px] text-amber-700">₹0 in revenue</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Confirmed</span>
                <span className="font-mono text-base font-bold text-emerald-900 block mt-0.5">
                  {confirmedOrders}
                </span>
                <span className="text-[9px] text-emerald-700">In revenue</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
                <span className="text-[10px] font-bold text-sky-800 uppercase block">Shipped</span>
                <span className="font-mono text-base font-bold text-sky-900 block mt-0.5">
                  {shippedOrders}
                </span>
                <span className="text-[9px] text-sky-700">In revenue</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Delivered</span>
                <span className="font-mono text-base font-bold text-purple-900 block mt-0.5">
                  {deliveredOrders}
                </span>
                <span className="text-[9px] text-purple-700">In revenue</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Rejected</span>
                <span className="font-mono text-base font-bold text-rose-900 block mt-0.5">
                  {rejectedOrders}
                </span>
                <span className="text-[9px] text-rose-700">₹0 in revenue</span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-700 uppercase block">Cancelled</span>
                <span className="font-mono text-base font-bold text-stone-800 block mt-0.5">
                  {cancelledOrders}
                </span>
                <span className="text-[9px] text-stone-600">₹0 in revenue</span>
              </div>
            </div>
          </div>

          {/* Pre-Launch Test Orders Reset Panel per Requirement 7 */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pre-Launch Order Reset</span>
              </div>
              <p className="text-xs text-amber-800">
                Remove all test/sample orders before public launch. Resets sales to ₹0 and order count to 0 without affecting catalog products or settings.
              </p>
            </div>
            <button
              onClick={handleResetTestOrders}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Test Orders</span>
            </button>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white p-4 rounded-xl border border-[#E7DECD] shadow-2xs space-y-3">
            <h3 className="font-serif-luxury font-bold text-sm text-[#1C1917]">
              Merchant Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                onClick={() => setAdminSection('orders')}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] hover:bg-[#F5EEDC] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#78350F] block">Review Customer Orders</span>
                  <span className="text-[10px] text-[#78716C]">{pendingOrders} pending review</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78350F]" />
              </button>

              <button
                onClick={() => setAdminSection('banners')}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] hover:bg-[#F5EEDC] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#78350F] block">Manage Hero Banners</span>
                  <span className="text-[10px] text-[#78716C]">{banners.length} promotional banners</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78350F]" />
              </button>

              <button
                onClick={() => setAdminSection('appearance')}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] hover:bg-[#F5EEDC] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#78350F] block">Switch Store Theme</span>
                  <span className="text-[10px] text-[#78716C]">Current: {themeMode}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78350F]" />
              </button>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-4 rounded-xl border border-[#E7DECD] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury font-bold text-sm text-[#1C1917]">
                Recent Orders
              </h3>
              <button
                onClick={() => setAdminSection('orders')}
                className="text-xs text-[#78350F] font-bold hover:underline"
              >
                View All Orders →
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#78716C]">No orders placed yet.</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DECD] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#1C1917]">{o.id}</span>
                        <span className="text-[10px] text-[#78716C]">· {o.customer.fullName}</span>
                      </div>
                      <span className="text-[10px] text-[#78716C]">
                        {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'} · {o.items.length} items
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#78350F] block font-mono">₹{o.total}</span>
                      <span className="text-[10px] font-semibold text-[#B45309]">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {adminSection === 'products' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                Product Management ({products.length})
              </h2>
              <p className="text-xs text-[#78716C]">
                Add, edit, enable/disable visibility, or delete products.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-3.5 py-1.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#92400E]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => {
              const isEnabled = p.enabled !== false;
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-xl border p-3 shadow-2xs flex gap-3 items-center justify-between transition-all ${
                    isEnabled ? 'border-[#E7DECD]' : 'border-stone-200 opacity-60 bg-stone-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg bg-[#FAF4E8] shrink-0 border border-[#E7DECD] p-1 flex items-center justify-center overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#B45309] uppercase block truncate">
                        {p.category}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isEnabled ? 'Live' : 'Hidden'}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-[#1C1917] truncate">{p.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-xs text-[#78350F]">₹{p.price}</span>
                      <span className="text-[10px] text-stone-400 line-through">₹{p.originalPrice}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          p.stockStatus === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.stockStatus === 'low_stock'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.stockStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => toggleProductEnabled(p.id)}
                      className={`px-2 py-0.5 text-[10px] rounded font-bold transition-colors ${
                        isEnabled
                          ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                      title="Toggle Visibility"
                    >
                      {isEnabled ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F] flex items-center justify-center"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete "${p.title}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1 rounded-lg bg-[#FAF7F2] hover:bg-rose-50 text-rose-600 flex items-center justify-center"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {adminSection === 'orders' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                Customer Orders ({orders.length})
              </h2>
              <p className="text-xs text-[#78716C]">
                Review all COD and UPI orders with customer shipping details, payment proof, and status control.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleResetTestOrders}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Permanently remove all test orders and reset sales to ₹0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Test Orders</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'rejected', 'cancelled'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                        orderStatusFilter === status
                          ? 'bg-[#78350F] text-white'
                          : 'bg-white text-[#78716C] border border-[#E7DECD] hover:bg-[#FAF4E8]'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E7DECD] p-8 text-center text-xs text-[#78716C]">
              No orders found matching this filter.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusColors: Record<string, string> = {
                Pending: 'bg-amber-100 text-amber-800 border-amber-300',
                Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                Shipped: 'bg-sky-100 text-sky-800 border-sky-300',
                Delivered: 'bg-purple-100 text-purple-800 border-purple-300',
                Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
                Cancelled: 'bg-stone-100 text-stone-700 border-stone-300',
              };

              const isRevenueCounted =
                order.status === 'Confirmed' ||
                order.status === 'Shipped' ||
                order.status === 'Delivered';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#E7DECD] p-3.5 sm:p-4 shadow-2xs space-y-3"
                >
                  {/* Top Bar: ID, Date, Payment Method & Status */}
                  <div className="flex items-center justify-between border-b border-[#F5EEDC] pb-2 flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#1C1917] block">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.paymentMethod === 'COD'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Payment'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A8A29E]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                          statusColors[order.status] || 'bg-stone-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete order ${order.id}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-1 text-[#A8A29E] hover:text-[#DC2626]"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Revenue status callout & Quick Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DECD]/70 text-xs">
                    <div className="flex items-center gap-1.5">
                      {order.status === 'Rejected' && (
                        <span className="font-semibold text-rose-700 flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5 text-rose-600" />
                          <span>Order Rejected (Excluded from sales revenue)</span>
                        </span>
                      )}
                      {order.status === 'Cancelled' && (
                        <span className="font-semibold text-stone-700 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-stone-500" />
                          <span>Order Cancelled (Excluded from sales revenue)</span>
                        </span>
                      )}
                      {order.status === 'Pending' && (
                        <span className="font-semibold text-amber-800 flex items-center gap-1">
                          <span>⏳ Awaiting Confirmation (Not yet counted in revenue)</span>
                        </span>
                      )}
                      {isRevenueCounted && (
                        <span className="font-semibold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Counted in Sales Revenue: ₹{order.total.toLocaleString('en-IN')}</span>
                        </span>
                      )}
                    </div>

                    {/* Working Status Controls: Direct One-Click Buttons */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-[#78716C] mr-0.5">Quick Set:</span>
                      {order.status !== 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status !== 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold"
                        >
                          Ship
                        </button>
                      )}
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold"
                        >
                          Deliver
                        </button>
                      )}
                      {order.status !== 'Rejected' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Rejected')}
                          className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[11px] font-bold"
                          title="Reject this order and exclude from revenue"
                        >
                          Reject
                        </button>
                      )}
                      {order.status !== 'Cancelled' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                          className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 text-[11px] font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Customer, Payment Proof & Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Customer Info */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg space-y-0.5">
                      <span className="font-bold text-[#78350F] text-[10px] uppercase block">
                        Customer & Delivery Address
                      </span>
                      <p className="font-bold text-[#1C1917]">{order.customer.fullName}</p>
                      {order.customer.phone && (
                        <p className="text-[#57534E]">📞 {order.customer.phone}</p>
                      )}
                      <p className="text-[#57534E]">✉️ {order.customer.email}</p>
                      <p className="text-[#57534E] text-[11px] pt-1 leading-snug">
                        📍 {order.customer.building ? `${order.customer.building}, ` : ''}
                        {order.customer.street ? `${order.customer.street}, ` : ''}
                        {order.customer.city}
                        {order.customer.district ? `, ${order.customer.district}` : ''}
                        <br />
                        <strong>{order.customer.state}</strong> -{' '}
                        <span className="font-mono">{order.customer.pinCode}</span>
                      </p>
                      {order.customer.notes && (
                        <p className="text-[10px] text-[#78716C] italic pt-0.5">
                          Note: "{order.customer.notes}"
                        </p>
                      )}
                    </div>

                    {/* Payment Verification */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg space-y-1.5">
                      <span className="font-bold text-[#78350F] text-[10px] uppercase block">
                        Payment Information
                      </span>
                      <p className="text-xs font-semibold text-[#1C1917]">
                        Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'}
                      </p>

                      {order.paymentMethod === 'COD' ? (
                        <div className="p-2 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                          Collect ₹{order.total} cash or UPI payment from customer upon delivery.
                        </div>
                      ) : (
                        <>
                          {order.utrNumber && (
                            <div>
                              <span className="text-[10px] text-[#78716C] block">UTR Reference:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-stone-200 truncate">
                                  {order.utrNumber}
                                </span>
                                <button
                                  onClick={() => handleCopy(order.utrNumber || '')}
                                  className="p-0.5 text-[#78350F]"
                                  title="Copy UTR"
                                >
                                  {copiedUtr === order.utrNumber ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {order.paymentScreenshot && (
                            <div>
                              <span className="text-[10px] text-[#78716C] block mb-0.5">
                                Screenshot:
                              </span>
                              <div
                                onClick={() => setSelectedScreenshot(order.paymentScreenshot || null)}
                                className="w-16 h-12 rounded bg-white border border-stone-300 overflow-hidden cursor-pointer flex items-center justify-center hover:opacity-90"
                              >
                                <img
                                  src={order.paymentScreenshot}
                                  alt="Receipt"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Order Items & Amounts */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-[#78350F] text-[10px] uppercase block">
                        Order Breakdown
                      </span>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span className="truncate pr-1 text-[#292524]">
                              {item.quantity}x {item.product.title}
                            </span>
                            <span className="font-mono shrink-0">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-[#15803D] pt-1 border-t border-stone-200 font-semibold">
                        <span>Delivery Fee:</span>
                        <span>₹0 (FREE)</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs text-[#78350F] pt-0.5 border-t border-stone-200">
                        <span>Grand Total:</span>
                        <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. CATEGORIES TAB */}
      {adminSection === 'categories' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                Category Management ({storeCategories.length})
              </h2>
              <p className="text-xs text-[#78716C]">
                Add, reorder, toggle visibility, or delete store categories.
              </p>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#92400E]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-2">
            {storeCategories.map((cat, index) => (
              <div
                key={cat.id}
                className="bg-white p-3 rounded-xl border border-[#E7DECD] shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#1C1917]">{cat.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      cat.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {cat.enabled ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    ({products.filter((p) => p.category === cat.name).length} items)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMoveCategory(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveCategory(index, 'down')}
                    disabled={index === storeCategories.length - 1}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleCategoryEnabled(cat.id)}
                    className="px-2 py-1 text-[11px] rounded font-bold bg-[#FAF7F2] text-[#78350F] hover:bg-[#F5EEDC]"
                  >
                    {cat.enabled ? 'Hide' : 'Show'}
                  </button>

                  {cat.name !== 'All' && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BANNERS TAB */}
      {adminSection === 'banners' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                Homepage Banners ({banners.length})
              </h2>
              <p className="text-xs text-[#78716C]">
                Create, customize, reorder, or schedule top hero promotional banners.
              </p>
            </div>
            <button
              onClick={handleOpenAddBanner}
              className="px-3.5 py-1.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#92400E]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="space-y-3">
            {banners.map((b, index) => (
              <div
                key={b.id}
                className={`bg-white rounded-xl border p-3.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  b.enabled ? 'border-[#E7DECD]' : 'border-stone-200 opacity-60 bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-24 sm:w-32 h-16 rounded-lg bg-stone-900 shrink-0 overflow-hidden border border-[#E7DECD] relative">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    {b.discountBadge && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[#FEF3C7] text-[8px] font-bold px-1 rounded">
                        {b.discountBadge}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          b.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {b.enabled ? 'Active' : 'Disabled'}
                      </span>
                      <span className="text-[10px] text-[#B45309] font-semibold">
                        Link: {b.categoryLink}
                      </span>
                      {b.startDate && b.endDate && (
                        <span className="text-[9px] text-[#78716C] flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {b.startDate} to {b.endDate}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-luxury font-bold text-sm text-[#1C1917] truncate mt-0.5">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-[#78716C] truncate">{b.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleMoveBanner(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveBanner(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleBannerEnabled(b.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      b.enabled
                        ? 'bg-amber-100 text-[#78350F] hover:bg-amber-200'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {b.enabled ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleOpenEditBanner(b)}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EEDC] text-[#78350F]"
                    title="Edit Banner"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete banner "${b.title}"?`)) {
                        deleteBanner(b.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-rose-50 text-rose-600"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HOMEPAGE SECTIONS TAB */}
      {adminSection === 'sections' && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DECD] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                  Homepage Layout Sections
                </h3>
                <p className="text-xs text-[#78716C]">
                  Show or hide modular sections on the customer-facing storefront homepage.
                </p>
              </div>
              {sectionsSavedNotice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  ✓ Saved
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSections} className="space-y-2.5">
              {[
                { key: 'showHeroSlider', label: 'Top Hero Banner Slider' },
                { key: 'showCategoriesRow', label: 'Horizontal Categories Icons Row' },
                { key: 'showOffersStrip', label: 'All-India Free Delivery & Trust Strip' },
                { key: 'showTrendingProducts', label: 'Trending / Popular Products Section' },
                { key: 'showShopByCategory', label: 'Shop by Category Tiles' },
                { key: 'showFeaturedProducts', label: 'Featured / New Arrivals Collection' },
                { key: 'showPromotionalBanner', label: 'Bottom Promotional Banner' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] cursor-pointer hover:bg-[#F5EEDC]"
                >
                  <span className="text-xs font-semibold text-[#1C1917]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(sectionsForm as any)[item.key]}
                    onChange={(e) =>
                      setSectionsForm({
                        ...sectionsForm,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#78350F] focus:ring-[#78350F]"
                  />
                </label>
              ))}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#92400E]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Sections Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. STORE APPEARANCE TAB */}
      {adminSection === 'appearance' && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DECD] shadow-2xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                Visual Branding Switcher
              </span>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1C1917]">
                Store Theme Mode
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Switch between everyday general e-commerce and seasonal festive styling.
                Default is Normal / Everyday. Updates instantly across the website and persists in localStorage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option 1: Normal / Everyday (Default) */}
              <div
                onClick={() => setThemeMode('normal')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  themeMode === 'normal'
                    ? 'border-[#78350F] bg-[#FAF4E8] shadow-sm'
                    : 'border-[#E7DECD] bg-white hover:border-[#D7CDBB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E7DECD] text-[#78350F]">
                    Everyday Mode (Default)
                  </span>
                  {themeMode === 'normal' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#15803D]">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </span>
                  )}
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                  Normal / Everyday Theme
                </h3>
                <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                  Clean, modern minimalist Indian e-commerce aesthetic. Warm cream backgrounds, subtle gold accents,
                  neutral lifestyle styling suitable for selling home decor, fashion, accessories, gifts, and lifestyle items.
                </p>
              </div>

              {/* Option 2: Festive / Diwali */}
              <div
                onClick={() => setThemeMode('festive')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  themeMode === 'festive'
                    ? 'border-[#B45309] bg-[#FEF3C7]/40 shadow-sm'
                    : 'border-[#E7DECD] bg-white hover:border-[#D7CDBB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FDE68A] text-[#78350F] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#EA580C]" /> Festive Mode
                  </span>
                  {themeMode === 'festive' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#15803D]">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </span>
                  )}
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                  Festive / Diwali Theme
                </h3>
                <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                  Celebratory golden glow, warm diya motifs, festive banners, and ceremonial accents perfect for
                  Diwali, Navratri, and festive wedding promotions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. UPI SETTINGS TAB */}
      {adminSection === 'upi' && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DECD] shadow-2xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                Payment Settings
              </span>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1C1917]">
                UPI / Online Payment Configuration
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Update your active UPI ID and QR code. Customers who choose UPI will view this QR and upload their UTR reference.
              </p>
            </div>

            {upiSavedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> UPI settings successfully updated.
              </div>
            )}

            <form onSubmit={handleSaveUpi} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">
                  UPI VPA ID *
                </label>
                <input
                  type="text"
                  required
                  value={upiForm.upiId}
                  onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                  placeholder="e.g. yourname@okhdfcbank"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white font-mono focus:outline-none focus:border-[#78350F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">
                  Payee Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={upiForm.payeeName}
                  onChange={(e) => setUpiForm({ ...upiForm, payeeName: e.target.value })}
                  placeholder="e.g. UtsavNest Artisanal Living"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                />
              </div>

              {/* QR Code Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">
                  UPI QR Code Image *
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={upiForm.qrImage} alt="UPI QR" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D7CDBB] text-xs font-bold text-[#78350F] cursor-pointer hover:bg-[#F5EEDC]">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload New QR Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpiQrUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="block text-[10px] text-[#78716C] mt-1">
                      Upload GPay, PhonePe, Paytm or BHIM merchant QR image.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">
                  Customer Instructions
                </label>
                <textarea
                  rows={2}
                  value={upiForm.instructions}
                  onChange={(e) => setUpiForm({ ...upiForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#92400E]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save UPI Settings</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. SHIPPING SETTINGS TAB */}
      {adminSection === 'shipping' && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DECD] shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-[#B45309]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
                  Pan-India Courier Network
                </span>
              </div>
              <h2 className="font-serif-luxury font-bold text-base sm:text-lg text-[#1C1917]">
                Shipping & Delivery Rules
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                UtsavNest delivers across all of India with <strong>100% Free Delivery (₹0 Delivery Fee)</strong>.
              </p>
            </div>

            {shippingSavedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Shipping rules successfully saved.
              </div>
            )}

            <form onSubmit={handleSaveShipping} className="space-y-3.5 max-w-lg">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shippingForm.allIndiaDelivery}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, allIndiaDelivery: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#78350F] focus:ring-[#78350F]"
                  />
                  <span className="text-xs font-bold text-[#1C1917]">
                    Enable All-India Delivery Across All States & UTs (Active)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">
                  Delivery Notice Banner Text *
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.deliveryNoticeText}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, deliveryNoticeText: e.target.value })
                  }
                  placeholder="e.g. 🚚 Free Delivery Across India (₹0 Shipping)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                />
              </div>

              <div className="bg-[#FAF4E8] p-3 rounded-xl border border-[#E7DECD] text-xs text-[#78350F] space-y-1">
                <span className="font-bold block">Current Active Delivery Charge: ₹0</span>
                <span className="text-[11px] text-[#57534E]">
                  As per UtsavNest policy, customer checkout always charges ₹0 for shipping across all Indian addresses.
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#78350F] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#92400E]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Shipping Settings</span>
              </button>
            </form>

            {/* List of supported regions */}
            <div className="mt-4 pt-4 border-t border-[#F5EEDC]">
              <span className="text-xs font-bold text-[#78350F] block mb-1.5">
                Supported Indian States & Union Territories ({INDIAN_STATES_AND_UTS.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-[#FAF7F2] border border-[#E7DECD] text-[10px] text-[#57534E]">
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <span key={st} className="px-2 py-0.5 rounded bg-white border border-[#E7DECD]">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#E7DECD] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECD]">
              <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-[#D7CDBB] bg-white font-medium"
                  >
                    {storeCategories
                      .filter((c) => c.name !== 'All')
                      .map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Stock Status *</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockStatus: e.target.value as StockStatus })
                    }
                    className="w-full px-2 py-2 rounded-xl border border-[#D7CDBB] bg-white font-medium"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Old Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Stock Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, 20% OFF, Handloom"
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Dimensions</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Product Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl border border-[#E7DECD] p-1 shrink-0 flex items-center justify-center">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <label className="py-2 px-3 rounded-xl bg-white border border-[#D7CDBB] font-bold text-[#78350F] cursor-pointer hover:bg-[#FAF7F2]">
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.enabled}
                    onChange={(e) => setProductForm({ ...productForm, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#78350F] focus:ring-[#78350F]"
                  />
                  <span className="font-bold text-[#1C1917]">Product visible in storefront catalog</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#D7CDBB] font-bold text-[#78716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#78350F] text-white font-bold hover:bg-[#92400E]"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER ADD / EDIT MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#E7DECD] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECD]">
              <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerFormSubmit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Curated Living & Home"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Subtitle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted decor & timeless textures"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Button Text *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop Collection"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Button Destination *</label>
                  <select
                    value={bannerForm.categoryLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, categoryLink: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-[#D7CDBB] bg-white font-medium"
                  >
                    {storeCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Discount / Tag Badge</label>
                <input
                  type="text"
                  placeholder="e.g. NEW SEASON, UP TO 30% OFF"
                  value={bannerForm.discountBadge}
                  onChange={(e) => setBannerForm({ ...bannerForm, discountBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={bannerForm.startDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D7CDBB] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#44403C] uppercase mb-0.5">End Date (Optional)</label>
                  <input
                    type="date"
                    value={bannerForm.endDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#D7CDBB] bg-white"
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">Banner Graphic</label>
                <div className="space-y-2">
                  <div className="w-full h-24 rounded-xl bg-stone-900 border border-[#E7DECD] overflow-hidden relative">
                    <img src={bannerForm.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="py-2 px-3 rounded-xl bg-white border border-[#D7CDBB] font-bold text-[#78350F] cursor-pointer hover:bg-[#FAF7F2]">
                      <span>Upload Banner Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Presets */}
                    <button
                      type="button"
                      onClick={() =>
                        setBannerForm((prev) => ({
                          ...prev,
                          imageUrl: createBannerSvg(prev.title || 'Curated', 'Artisanal', 'amber'),
                        }))
                      }
                      className="px-2 py-1 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]"
                    >
                      Amber
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBannerForm((prev) => ({
                          ...prev,
                          imageUrl: createBannerSvg(prev.title || 'Living', 'Artisanal', 'emerald'),
                        }))
                      }
                      className="px-2 py-1 bg-emerald-100 text-emerald-900 rounded font-semibold text-[10px]"
                    >
                      Emerald
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBannerForm((prev) => ({
                          ...prev,
                          imageUrl: createBannerSvg(prev.title || 'Style', 'Artisanal', 'cream'),
                        }))
                      }
                      className="px-2 py-1 bg-stone-200 text-stone-900 rounded font-semibold text-[10px]"
                    >
                      Neutral
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.enabled}
                    onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#78350F] focus:ring-[#78350F]"
                  />
                  <span className="font-bold text-[#1C1917]">Display banner on homepage</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#D7CDBB] font-bold text-[#78350F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#78350F] text-white font-bold hover:bg-[#92400E]"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl p-5 max-w-sm w-full border border-[#E7DECD] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECD]">
              <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                Add Store Category
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fragrances, Pottery, Textiles"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D7CDBB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] uppercase mb-0.5">
                  Category Icon
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-[#D7CDBB] bg-white font-medium"
                >
                  {['Sparkles', 'Home', 'Shirt', 'Watch', 'Gift', 'Flame', 'Coffee', 'Heart', 'Palette'].map(
                    (ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#D7CDBB] font-bold text-[#78716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#78350F] text-white font-bold hover:bg-[#92400E]"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREENSHOT LIGHTBOX */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="bg-white rounded-2xl p-3 max-w-sm w-full max-h-[85vh] flex flex-col items-center relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-bold text-[#78350F]">Payment Screenshot Proof</span>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 text-stone-500 hover:text-black rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 w-full flex-1 overflow-auto flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Payment screenshot"
                className="max-h-[65vh] object-contain rounded-lg shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
