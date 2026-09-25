import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroSlider } from './components/HeroSlider';
import { HomeSections } from './components/HomeSections';
import { ShopPage } from './components/ShopPage';
import { CategoriesView } from './components/CategoriesView';
import { TrackOrderPage } from './components/TrackOrderPage';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab, homepageSections } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292524] selection:bg-[#F59E0B]/20 selection:text-[#78350F] pb-16 md:pb-0">
      {/* Mobile-First Header */}
      <Navbar />

      {/* Horizontally Scrollable Categories (Always visible on Homepage & Shop) */}
      {(activeTab === 'home' || activeTab === 'shop') && homepageSections.showCategoriesRow && <CategoryBar />}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {homepageSections.showHeroSlider && <HeroSlider />}
            <HomeSections />
          </>
        )}

        {activeTab === 'categories' && <CategoriesView />}
        {activeTab === 'shop' && <ShopPage />}
        {activeTab === 'orders' && <TrackOrderPage />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Modals, Overlays & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminLoginModal />

      {/* Mobile-First Clean Footer (Zero admin text) */}
      <Footer />

      {/* Fixed Mobile Bottom Navigation: Home | Categories | Search | Cart | Orders */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
