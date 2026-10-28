export type Category = 
  | 'All'
  | 'Solar & Power Backup'
  | 'Water & Home Tech'
  | 'Phones & Computers'
  | 'Agri & Food Processing'
  | 'Fashion & Beauty'
  | 'Vehicles & Auto';

export type ProductCondition = 'Brand New' | 'Like New' | 'Gently Used' | 'Refurbished';

export type ListingPlan = 'Basic' | 'Featured' | 'VIP';

export interface Seller {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  businessName?: string;
  location: string;
  isVerified: boolean;
  verificationBadge: string;
  totalListings: number;
  totalListingFeesPaid: number;
  joinedDate: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  condition: ProductCondition;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerLocation: string;
  sellerVerified: boolean;
  sellerBadge: string;
  isFeatured: boolean;
  status: 'active' | 'sold' | 'inactive';
  viewsCount: number;
  whatsappClicks: number;
  callClicks: number;
  listingPlan: ListingPlan;
  listingFee: number;
  createdAt: string;
  specs?: Record<string, string>;
  problemSolved?: string; // Highlights what everyday challenge it solves
}

export interface OrderInquiry {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface MarketplaceStats {
  totalActiveListings: number;
  totalSellers: number;
  totalListingRevenue: number;
  totalWhatsappLeads: number;
  totalViews: number;
}
