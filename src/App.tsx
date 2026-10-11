import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { AainaReelsFeed } from './components/reels/AainaReelsFeed';
import { AainaMirrorVTO } from './components/mirror/AainaMirrorVTO';
import { AainaRoom3D } from './components/room/AainaRoom3D';
import { AainaLiveShopping } from './components/live/AainaLiveShopping';
import { AainaStudio } from './components/studio/AainaStudio';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';

const MainContent: React.FC = () => {
  const { activeTab } = useMarketplace();

  return (
    <main className="min-h-[calc(100vh-280px)]">
      {activeTab === 'discover' && <ProductGrid />}
      {activeTab === 'reels' && <AainaReelsFeed />}
      {activeTab === 'mirror' && <AainaMirrorVTO />}
      {activeTab === 'room' && <AainaRoom3D />}
      {activeTab === 'live' && <AainaLiveShopping />}
      {activeTab === 'studio' && <AainaStudio />}
    </main>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#0B0B0F]">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />

        {/* Global Modals & Overlays */}
        <CartDrawer />
        <CheckoutModal />
        <ProductDetailModal />
        <OrderTrackingModal />
        <SearchModal />
        <Toast />
      </div>
    </MarketplaceProvider>
  );
}
