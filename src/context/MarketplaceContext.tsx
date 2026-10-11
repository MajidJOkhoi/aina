import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AainaProduct,
  AainaReel,
  AainaOrder,
  AainaTryOnSession,
  AainaUser,
  CartItem,
  CurrencyCode,
  ProductVariant,
} from '../types';
import { CURRENCIES, CURRENT_USER, MOCK_PRODUCTS, MOCK_REELS } from '../data/mockData';

export type NavigationTab = 'discover' | 'reels' | 'mirror' | 'room' | 'live' | 'studio' | 'orders';

interface MarketplaceContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;

  // Catalog
  products: AainaProduct[];
  selectedProductForDetail: AainaProduct | null;
  openProductDetail: (product: AainaProduct) => void;
  closeProductDetail: () => void;

  // Reels
  reels: AainaReel[];
  activeReelIndex: number;
  setActiveReelIndex: (idx: number) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  openReelByProduct: (productId: string) => void;

  // Mirror (VTO)
  activeMirrorProduct: AainaProduct | null;
  startMirrorTryOn: (product: AainaProduct) => void;
  savedTryOnSessions: AainaTryOnSession[];
  saveTryOnSession: (session: AainaTryOnSession) => void;

  // Room (3D / AR)
  activeRoomProduct: AainaProduct | null;
  startRoomExperience: (product: AainaProduct) => void;

  // Cart & Checkout
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: AainaProduct, variant?: ProductVariant, quantity?: number, tryOnSessionId?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Orders
  orders: AainaOrder[];
  createOrder: (orderData: Omit<AainaOrder, 'id' | 'created_at' | 'tracking_number'>) => AainaOrder;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  selectedTrackingOrder: AainaOrder | null;
  setSelectedTrackingOrder: (order: AainaOrder | null) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // User
  user: AainaUser;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const INITIAL_ORDERS: AainaOrder[] = [
  {
    id: 'ORD-78210',
    buyer_id: CURRENT_USER.id,
    buyer_name: CURRENT_USER.name,
    buyer_email: CURRENT_USER.email,
    items: [
      {
        product_id: 'prod_001',
        title: 'Aura Silk-Lined Bomber Jacket',
        variant_sku: 'JKT-BLU-M',
        variant_desc: 'Deep Midnight / Cobalt · Size M',
        image_url: '/src/assets/images/reel_streetwear_thumb_1791689693812.jpg',
        qty: 1,
        price: 185,
        try_on_session_id: 'vto_sess_102',
      },
    ],
    status: 'Shipped',
    payment_status: 'Paid',
    payment_method: 'Aaina Pay',
    currency: 'USD',
    subtotal: 185,
    discount: 18.5,
    shipping: 0,
    total: 166.5,
    shipping_address: {
      fullName: 'Majid Alij',
      street: '420 Orchard Street, Suite 5B',
      city: 'San Francisco, CA',
      postalCode: '94103',
      country: 'United States',
    },
    tracking_number: 'AAINA-EXP-992140',
    created_at: '2026-10-09T14:20:00Z',
  },
  {
    id: 'ORD-65419',
    buyer_id: CURRENT_USER.id,
    buyer_name: CURRENT_USER.name,
    buyer_email: CURRENT_USER.email,
    items: [
      {
        product_id: 'prod_005',
        title: 'Vektor-01 Vibram Low-Top Sneakers',
        variant_sku: 'SNK-WHT-42',
        variant_desc: 'Optic White / Concrete · EU 42',
        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
        qty: 1,
        price: 145,
      },
    ],
    status: 'Delivered',
    payment_status: 'Paid',
    payment_method: 'Klarna BNPL',
    currency: 'USD',
    subtotal: 145,
    discount: 0,
    shipping: 0,
    total: 145,
    shipping_address: {
      fullName: 'Majid Alij',
      street: '420 Orchard Street, Suite 5B',
      city: 'San Francisco, CA',
      postalCode: '94103',
      country: 'United States',
    },
    tracking_number: 'AAINA-FED-481920',
    created_at: '2026-10-04T09:12:00Z',
  },
];

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('discover');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [products] = useState<AainaProduct[]>(MOCK_PRODUCTS);
  const [reels, setReels] = useState<AainaReel[]>(MOCK_REELS);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<AainaProduct | null>(null);
  const [activeMirrorProduct, setActiveMirrorProduct] = useState<AainaProduct | null>(MOCK_PRODUCTS[0]);
  const [activeRoomProduct, setActiveRoomProduct] = useState<AainaProduct | null>(MOCK_PRODUCTS[1]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    return [
      {
        id: 'cart_item_default_1',
        product: MOCK_PRODUCTS[0],
        selectedVariant: MOCK_PRODUCTS[0].variants[1],
        quantity: 1,
        try_on_session_id: 'vto_demo_77',
      },
    ];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<AainaOrder[]>(INITIAL_ORDERS);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<AainaOrder | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(['prod_001', 'prod_002']);
  const [savedTryOnSessions, setSavedTryOnSessions] = useState<AainaTryOnSession[]>([
    {
      id: 'vto_demo_77',
      user_id: CURRENT_USER.id,
      product_id: 'prod_001',
      input_photo_url: '/src/assets/images/tryon_model_neutral_1791689718616.jpg',
      garment_image_url: '/src/assets/images/reel_streetwear_thumb_1791689693812.jpg',
      output_image_url: '/src/assets/images/reel_streetwear_thumb_1791689693812.jpg',
      size_recommended: 'M (Chest: 98cm)',
      fit_score: 96,
      fit_feedback: 'Optimal shoulder drape with relaxed sleeve taper.',
      created_at: new Date().toISOString(),
    },
  ]);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const formatPrice = (usdAmount: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = usdAmount * config.rateFromUSD;
    if (currency === 'PKR') {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const openProductDetail = (product: AainaProduct) => {
    setSelectedProductForDetail(product);
  };

  const closeProductDetail = () => {
    setSelectedProductForDetail(null);
  };

  const startMirrorTryOn = (product: AainaProduct) => {
    setActiveMirrorProduct(product);
    setActiveTab('mirror');
    closeProductDetail();
  };

  const startRoomExperience = (product: AainaProduct) => {
    setActiveRoomProduct(product);
    setActiveTab('room');
    closeProductDetail();
  };

  const openReelByProduct = (productId: string) => {
    const reelIndex = reels.findIndex(r => r.product_tags.some(tag => tag.product_id === productId));
    if (reelIndex !== -1) {
      setActiveReelIndex(reelIndex);
    }
    setActiveTab('reels');
    closeProductDetail();
  };

  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const liked = !r.liked_by_user;
          return {
            ...r,
            liked_by_user: liked,
            stats: { ...r.stats, likes: r.stats.likes + (liked ? 1 : -1) },
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const saved = !r.saved_by_user;
          if (saved) showToast('Reel saved to your profile collection');
          return {
            ...r,
            saved_by_user: saved,
            stats: { ...r.stats, shares: r.stats.shares + (saved ? 1 : 0) },
          };
        }
        return r;
      })
    );
  };

  const addToCart = (
    product: AainaProduct,
    variant?: ProductVariant,
    quantity: number = 1,
    tryOnSessionId?: string
  ) => {
    const selectedVar = variant || product.variants[0];
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedVariant.sku === selectedVar.sku
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      if (tryOnSessionId) {
        updated[existingIndex].try_on_session_id = tryOnSessionId;
      }
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product,
        selectedVariant: selectedVar,
        quantity,
        try_on_session_id: tryOnSessionId,
      };
      setCart([...cart, newItem]);
    }
    showToast(`Added ${product.title} to bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Aaina Wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const saveTryOnSession = (session: AainaTryOnSession) => {
    setSavedTryOnSessions(prev => [session, ...prev]);
    showToast('Virtual Try-On fit saved to your profile!', 'success');
  };

  const createOrder = (orderData: Omit<AainaOrder, 'id' | 'created_at' | 'tracking_number'>) => {
    const randId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const randTrack = `AAINA-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: AainaOrder = {
      ...orderData,
      id: randId,
      tracking_number: randTrack,
      created_at: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    setSelectedTrackingOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);
    return newOrder;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);

  return (
    <MarketplaceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        formatPrice,
        products,
        selectedProductForDetail,
        openProductDetail,
        closeProductDetail,
        reels,
        activeReelIndex,
        setActiveReelIndex,
        toggleLikeReel,
        toggleSaveReel,
        openReelByProduct,
        activeMirrorProduct,
        startMirrorTryOn,
        savedTryOnSessions,
        saveTryOnSession,
        activeRoomProduct,
        startRoomExperience,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        createOrder,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        selectedTrackingOrder,
        setSelectedTrackingOrder,
        wishlist,
        toggleWishlist,
        isSearchOpen,
        setIsSearchOpen,
        user: CURRENT_USER,
        toast,
        showToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
