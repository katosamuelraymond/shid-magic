import fs from 'fs';
import path from 'path';
import { Product, Seller, OrderInquiry, MarketplaceStats } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'marketplace.json');

interface DatabaseSchema {
  sellers: Seller[];
  products: Product[];
  orders: OrderInquiry[];
}

const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-ug-1',
    name: 'Kato Solar & Energy Systems',
    phone: '+256772123456',
    whatsappNumber: '256772123456',
    businessName: 'Kato Solar & Electricals Ltd',
    location: 'Kampala CBD, Pioneer Mall, 1st Floor Shop 14',
    isVerified: true,
    verificationBadge: 'Physical Shop Inspected & Verified',
    totalListings: 4,
    totalListingFeesPaid: 120000,
    joinedDate: '2026-06-12',
  },
  {
    id: 'seller-ug-2',
    name: 'Mwebaze Hardware & Water Tech',
    phone: '+256701987654',
    whatsappNumber: '256701987654',
    businessName: 'Mwebaze Engineering Supplies',
    location: 'Nakasero Hardware Market, Plot 18 Luwum Street',
    isVerified: true,
    verificationBadge: 'Verified Hardware Merchant',
    totalListings: 3,
    totalListingFeesPaid: 90000,
    joinedDate: '2026-07-04',
  },
  {
    id: 'seller-ug-3',
    name: 'Apex Tech Hub Uganda',
    phone: '+256782554433',
    whatsappNumber: '256782554433',
    businessName: 'Apex Premium Gadgets',
    location: 'Acacia Mall Kisementi, 2nd Floor, Shop 28',
    isVerified: true,
    verificationBadge: 'Authorized Retailer',
    totalListings: 3,
    totalListingFeesPaid: 105000,
    joinedDate: '2026-08-19',
  },
  {
    id: 'seller-ug-4',
    name: 'AgriPro Solutions Uganda',
    phone: '+256750332211',
    whatsappNumber: '256750332211',
    businessName: 'AgriPro Farm Technology',
    location: 'Ntinda Shopping Centre, Block B Ground Floor',
    isVerified: true,
    verificationBadge: 'Verified Agribusiness Partner',
    totalListings: 2,
    totalListingFeesPaid: 70000,
    joinedDate: '2026-09-01',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ug-prod-1',
    title: '1000W Solar Hybrid Generator & Inverter (1200Wh Lithium + Panel)',
    slug: '1000w-solar-hybrid-generator-power-backup-kampala',
    description: 'Automatic pure sine wave inverter with lithium battery and solar panel. Switches on instantly during blackouts to power your Wi-Fi, TV, and lights.',
    problemSolved: 'Stops Umeme load-shedding. Keeps Wi-Fi, 43" TV, and lights powered for 14 hours.',
    price: 1850000,
    originalPrice: 2200000,
    category: 'Solar & Power Backup',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-1',
    sellerName: 'Kato Solar & Energy',
    sellerPhone: '+256772123456',
    sellerWhatsapp: '256772123456',
    sellerLocation: 'Pioneer Mall, 1st Floor, Kampala Road',
    sellerVerified: true,
    sellerBadge: 'Physical Shop Inspected & Verified',
    isFeatured: true,
    status: 'active',
    viewsCount: 642,
    whatsappClicks: 89,
    callClicks: 34,
    listingPlan: 'VIP',
    listingFee: 35000,
    createdAt: '2026-10-25T08:00:00.000Z',
    specs: {
      'Inverter Capacity': '1000 Watts Pure Sine Wave',
      'Battery Type': 'Grade-A LiFePO4 Lithium (1200Wh)',
      'Backup Duration': 'Up to 14 Hours (TV + Wi-Fi + Lights)',
      'Solar Panel': '100W Monocrystalline included',
      'Warranty': '24 Months Replacement Shop Warranty',
    },
  },
  {
    id: 'ug-prod-2',
    title: 'Automatic 0.5HP Home Water Pressure Booster Pump (Silent Switch)',
    slug: 'automatic-water-pressure-booster-pump-kampala',
    description: 'Heavy-duty booster pump connects directly to overhead gravity tanks. Enjoy powerful hotel-grade shower flow and rapid tank filling.',
    problemSolved: 'Solves weak shower pressure. Automatically pumps whenever any tap or shower opens.',
    price: 380000,
    originalPrice: 450000,
    category: 'Water & Home Tech',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-2',
    sellerName: 'Mwebaze Hardware & Water Tech',
    sellerPhone: '+256701987654',
    sellerWhatsapp: '256701987654',
    sellerLocation: 'Plot 18 Luwum Street, Nakasero',
    sellerVerified: true,
    sellerBadge: 'Verified Hardware Merchant',
    isFeatured: true,
    status: 'active',
    viewsCount: 489,
    whatsappClicks: 62,
    callClicks: 21,
    listingPlan: 'Featured',
    listingFee: 25000,
    createdAt: '2026-10-26T09:30:00.000Z',
    specs: {
      'Power': '0.5 HP (370W) Energy Efficient',
      'Max Head / Lift': '32 Metres',
      'Control': 'Automatic Intelligent Pressure Switch',
      'Noise Level': 'Ultra-Quiet Silent Motor',
      'Warranty': '1 Year Full Warranty',
    },
  },
  {
    id: 'ug-prod-3',
    title: 'Starlink Gen 3 Standard Satellite Internet Kit (High-Speed Broadband)',
    slug: 'starlink-gen-3-satellite-internet-kit-uganda',
    description: 'Complete satellite kit with Wi-Fi 6 router. Enjoy 200+ Mbps low-latency broadband anywhere in Uganda even where phone network is weak.',
    problemSolved: 'Unlimited 200+ Mbps internet anywhere in Uganda. Farms, lodges, and upcountry.',
    price: 2650000,
    originalPrice: 2950000,
    category: 'Phones & Computers',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-3',
    sellerName: 'Apex Tech Hub Uganda',
    sellerPhone: '+256782554433',
    sellerWhatsapp: '256782554433',
    sellerLocation: 'Acacia Mall Kisementi, 2nd Floor',
    sellerVerified: true,
    sellerBadge: 'Authorized Retailer',
    isFeatured: true,
    status: 'active',
    viewsCount: 712,
    whatsappClicks: 95,
    callClicks: 41,
    listingPlan: 'VIP',
    listingFee: 35000,
    createdAt: '2026-10-26T14:15:00.000Z',
    specs: {
      'Download Speeds': '150 - 250 Mbps',
      'Wi-Fi Standard': 'Wi-Fi 6 Tri-Band Router',
      'Coverage Area': 'Up to 3,200 sq ft',
      'Weather Resistance': 'IP67 Heavy-duty rain/heat proof',
      'Support': 'Free setup assistance by seller',
    },
  },
  {
    id: 'ug-prod-4',
    title: 'Solar-Powered 528 Egg Automatic Poultry Incubator (Dual Power)',
    slug: 'solar-automatic-poultry-incubator-528-eggs-uganda',
    description: 'Digital climate sensors and automatic egg turner with 98% hatch rate. Dual 12V/240V power keeps eggs safe during power blackouts.',
    problemSolved: 'Stops chick losses from power cuts. Operates on solar battery and 240V power.',
    price: 2400000,
    originalPrice: 2800000,
    category: 'Agri & Food Processing',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-4',
    sellerName: 'AgriPro Solutions Uganda',
    sellerPhone: '+256750332211',
    sellerWhatsapp: '256750332211',
    sellerLocation: 'Ntinda Shopping Centre, Block B',
    sellerVerified: true,
    sellerBadge: 'Verified Agribusiness Partner',
    isFeatured: true,
    status: 'active',
    viewsCount: 390,
    whatsappClicks: 48,
    callClicks: 19,
    listingPlan: 'Featured',
    listingFee: 25000,
    createdAt: '2026-10-27T10:00:00.000Z',
    specs: {
      'Capacity': '528 Chicken / 1300 Quail / 380 Duck Eggs',
      'Dual Power': 'Automatic AC (240V) & DC (12V Solar Battery)',
      'Hatch Rate': '98% verified efficiency',
      'Sensors': 'Digital Swiss micro-climate sensors',
    },
  },
  {
    id: 'ug-prod-5',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium (Dual SIM)',
    slug: 'apple-iphone-15-pro-max-256gb-natural-titanium-kampala',
    description: '100% original sealed unit, verified by admin. Physical dual SIM (Nano + eSIM). 100% battery health, brand new in sealed box with 1-year shop warranty.',
    problemSolved: '100% scam-proof phone purchase with physical shop inspection in Kampala. No fakes.',
    price: 4850000,
    originalPrice: 5300000,
    category: 'Phones & Computers',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-3',
    sellerName: 'Apex Tech Hub Uganda',
    sellerPhone: '+256782554433',
    sellerWhatsapp: '256782554433',
    sellerLocation: 'Acacia Mall Kisementi, 2nd Floor',
    sellerVerified: true,
    sellerBadge: 'Authorized Retailer',
    isFeatured: true,
    status: 'active',
    viewsCount: 512,
    whatsappClicks: 71,
    callClicks: 26,
    listingPlan: 'Featured',
    listingFee: 25000,
    createdAt: '2026-10-27T11:45:00.000Z',
    specs: {
      'Storage': '256 GB',
      'Color': 'Natural Titanium',
      'SIM': 'Dual SIM Supported',
      'Warranty': '1 Year Full Apple & Shop Warranty',
    },
  },
  {
    id: 'ug-prod-6',
    title: '7-Stage Reverse Osmosis Alkaline Water Purifier (Direct Pure Drinking Water - No Boiling)',
    slug: 'reverse-osmosis-home-water-purifier-kampala',
    description: 'Stop spending money on charcoal and gas boiling drinking water! This premium 7-stage system removes 99.9% of bacteria, heavy metals, chlorine, and sediment from NWSC tap water or borehole water, adding healthy minerals and alkaline balance. Direct drinking water for the whole family.',
    problemSolved: 'Saves you over UGX 60,000 every month spent on boiling water fuel, and ensures 100% safe drinking water for your children.',
    price: 650000,
    originalPrice: 780000,
    category: 'Water & Home Tech',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    ],
    sellerId: 'seller-ug-2',
    sellerName: 'Mwebaze Hardware & Water Tech',
    sellerPhone: '+256701987654',
    sellerWhatsapp: '256701987654',
    sellerLocation: 'Plot 18 Luwum Street, Nakasero',
    sellerVerified: true,
    sellerBadge: 'Verified Hardware Merchant',
    isFeatured: false,
    status: 'active',
    viewsCount: 310,
    whatsappClicks: 42,
    callClicks: 14,
    listingPlan: 'Basic',
    listingFee: 15000,
    createdAt: '2026-10-27T15:20:00.000Z',
    specs: {
      'Filtration Stages': '7 Stages with Alkaline Re-mineralizer',
      'Output': '75 Gallons (280 Litres) Per Day',
      'Installation': 'Standard kitchen sink tap included',
      'Replacement Filters': 'Readily available in Kampala',
    },
  },
];

const INITIAL_ORDERS: OrderInquiry[] = [
  {
    id: 'ug-ord-1',
    productId: 'ug-prod-1',
    productTitle: '1000W All-in-One Solar Hybrid Generator & Inverter',
    productPrice: 1850000,
    buyerName: 'Robert Mugisha',
    buyerPhone: '+256772998877',
    buyerLocation: 'Naalya Housing Estate, Block 6',
    notes: 'Please bring with installation technician. I will pay via MTN MoMo.',
    status: 'contacted',
    createdAt: '2026-10-28T07:30:00.000Z',
  },
  {
    id: 'ug-ord-2',
    productId: 'ug-prod-2',
    productTitle: 'Automatic 0.5HP Home Water Pressure Booster Pump',
    productPrice: 380000,
    buyerName: 'Grace Nalubega',
    buyerPhone: '+256703112233',
    buyerLocation: 'Kira Town, near Kira Police',
    notes: 'Can you deliver today afternoon by SafeBoda?',
    status: 'pending',
    createdAt: '2026-10-28T10:15:00.000Z',
  },
];

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Always initialize or load
  if (!fs.existsSync(DATA_FILE)) {
    const initialData: DatabaseSchema = {
      sellers: INITIAL_SELLERS,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    // If empty or outdated, seed with Ugandan products
    if (!data.products || data.products.length === 0 || !data.products[0].id.startsWith('ug-')) {
      const updated: DatabaseSchema = {
        sellers: INITIAL_SELLERS,
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), 'utf-8');
      return updated;
    }
    return data;
  } catch (err) {
    const initialData: DatabaseSchema = {
      sellers: INITIAL_SELLERS,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveData(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getAllProducts(options?: {
  category?: string;
  search?: string;
  featuredOnly?: boolean;
  condition?: string;
  sellerId?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular';
}): Product[] {
  const db = ensureDataFile();
  let list = [...db.products];

  if (options?.category && options.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }

  if (options?.condition && options.condition !== 'All') {
    list = list.filter((p) => p.condition === options.condition);
  }

  if (options?.sellerId) {
    list = list.filter((p) => p.sellerId === options.sellerId);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.isFeatured && p.status === 'active');
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.problemSolved && p.problemSolved.toLowerCase().includes(q)) ||
        p.sellerLocation.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
    );
  }

  if (options?.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (options?.sortBy === 'popular') {
    list.sort((a, b) => (b.viewsCount + b.whatsappClicks * 3) - (a.viewsCount + a.whatsappClicks * 3));
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list;
}

export function getProductById(id: string): Product | null {
  const db = ensureDataFile();
  return db.products.find((p) => p.id === id) || null;
}

export function createProduct(input: Omit<Product, 'id' | 'viewsCount' | 'whatsappClicks' | 'callClicks' | 'createdAt' | 'slug'>): Product {
  const db = ensureDataFile();
  const id = 'ug-prod-' + Date.now();
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + id.slice(-4);

  const newProduct: Product = {
    ...input,
    id,
    slug,
    viewsCount: 0,
    whatsappClicks: 0,
    callClicks: 0,
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);

  const seller = db.sellers.find((s) => s.id === input.sellerId);
  if (seller) {
    seller.totalListings += 1;
    seller.totalListingFeesPaid += input.listingFee || 0;
  }

  saveData(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDataFile();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.products[idx] = { ...db.products[idx], ...updates };
  saveData(db);
  return db.products[idx];
}

export function deleteProduct(id: string): boolean {
  const db = ensureDataFile();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  db.products.splice(idx, 1);
  saveData(db);
  return true;
}

export function trackEvent(productId: string, eventType: 'view' | 'whatsapp' | 'call'): boolean {
  const db = ensureDataFile();
  const prod = db.products.find((p) => p.id === productId);
  if (!prod) return false;

  if (eventType === 'view') {
    prod.viewsCount += 1;
  } else if (eventType === 'whatsapp') {
    prod.whatsappClicks += 1;
  } else if (eventType === 'call') {
    prod.callClicks += 1;
  }

  saveData(db);
  return true;
}

export function getAllSellers(): Seller[] {
  const db = ensureDataFile();
  return db.sellers;
}

export function getSellerById(id: string): Seller | null {
  const db = ensureDataFile();
  return db.sellers.find((s) => s.id === id) || null;
}

export function createSeller(input: Omit<Seller, 'id' | 'totalListings' | 'totalListingFeesPaid' | 'joinedDate'>): Seller {
  const db = ensureDataFile();
  const id = 'seller-ug-' + Date.now();
  const newSeller: Seller = {
    ...input,
    id,
    totalListings: 0,
    totalListingFeesPaid: 0,
    joinedDate: new Date().toISOString().split('T')[0],
  };

  db.sellers.push(newSeller);
  saveData(db);
  return newSeller;
}

export function updateSeller(id: string, updates: Partial<Seller>): Seller | null {
  const db = ensureDataFile();
  const idx = db.sellers.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.sellers[idx] = { ...db.sellers[idx], ...updates };
  saveData(db);
  return db.sellers[idx];
}

export function createOrderInquiry(input: Omit<OrderInquiry, 'id' | 'status' | 'createdAt'>): OrderInquiry {
  const db = ensureDataFile();
  const newOrder: OrderInquiry = {
    ...input,
    id: 'ug-ord-' + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveData(db);
  return newOrder;
}

export function getAllOrders(): OrderInquiry[] {
  const db = ensureDataFile();
  return db.orders;
}

export function updateOrderStatus(id: string, status: OrderInquiry['status']): OrderInquiry | null {
  const db = ensureDataFile();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;

  order.status = status;
  saveData(db);
  return order;
}

export function getMarketplaceStats(): MarketplaceStats {
  const db = ensureDataFile();
  const activeProducts = db.products.filter((p) => p.status === 'active');
  const totalRevenue = db.products.reduce((acc, p) => acc + (p.listingFee || 0), 0);
  const totalLeads = db.products.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);
  const totalViews = db.products.reduce((acc, p) => acc + p.viewsCount, 0);

  return {
    totalActiveListings: activeProducts.length,
    totalSellers: db.sellers.length,
    totalListingRevenue: totalRevenue,
    totalWhatsappLeads: totalLeads,
    totalViews: totalViews,
  };
}
