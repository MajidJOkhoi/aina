export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number; // For live conversion
  name: string;
}

export interface AainaUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'creator' | 'admin';
  avatar_url?: string;
  body_profile?: {
    height_cm: number;
    bust_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    preferred_size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    photo_url?: string;
  };
  preferences: {
    categories: string[];
    favorite_colors: string[];
  };
}

export interface ProductVariant {
  sku: string;
  name: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface AainaProduct {
  id: string;
  seller_id: string;
  seller_name: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Apparel' | 'Footwear' | 'Home & Living' | 'Accessories';
  tags: string[];
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  variants: ProductVariant[];
  media: {
    primary_image: string;
    images: string[];
    video_url?: string;
    model_3d_type?: 'chair' | 'table' | 'lamp' | 'decor' | 'jacket';
    material_options?: { name: string; color: string; roughness: number; metalness: number }[];
    dimensions?: {
      width_cm: number;
      depth_cm: number;
      height_cm: number;
    };
  };
  aaina_mirror_enabled: boolean; // Virtual Try-On supported
  aaina_room_enabled: boolean;   // 3D & AR Placement supported
  in_stock: boolean;
  featured?: boolean;
}

export interface AainaReelTag {
  id: string;
  product_id: string;
  timestamp_start: number; // in seconds
  timestamp_end: number;   // in seconds
  position_x: number;      // percentage 0 - 100
  position_y: number;      // percentage 0 - 100
  label?: string;
}

export interface AainaReel {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_handle: string;
  creator_avatar: string;
  video_url: string;
  thumbnail: string;
  caption: string;
  sound_title: string;
  tags: string[];
  product_tags: AainaReelTag[];
  stats: {
    views: number;
    likes: number;
    shares: number;
    clicks: number;
    conversions: number;
  };
  liked_by_user?: boolean;
  saved_by_user?: boolean;
}

export interface AainaTryOnSession {
  id: string;
  user_id: string;
  product_id: string;
  input_photo_url: string;
  garment_image_url: string;
  output_image_url: string;
  size_recommended: string;
  fit_score: number; // e.g. 96%
  fit_feedback: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: AainaProduct;
  selectedVariant: ProductVariant;
  quantity: number;
  try_on_session_id?: string;
}

export interface AainaOrder {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  items: {
    product_id: string;
    title: string;
    variant_sku: string;
    variant_desc: string;
    image_url: string;
    qty: number;
    price: number;
    try_on_session_id?: string;
  }[];
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  payment_status: 'Paid' | 'Pending COD' | 'Installment Scheduled';
  payment_method: 'Aaina Pay' | 'Credit Card' | 'Klarna BNPL' | 'Cash on Delivery';
  currency: CurrencyCode;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shipping_address: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  tracking_number: string;
  created_at: string;
}

export interface LiveMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isHost?: boolean;
}
