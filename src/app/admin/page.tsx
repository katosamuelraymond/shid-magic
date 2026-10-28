'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  PlusCircle,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  LogOut,
  ShieldCheck,
  Camera,
  Trash2,
  Share2,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  TrendingDown,
  Layers,
  FileText,
  Calendar,
  ExternalLink,
  ChevronDown,
  Sparkles,
  X,
  Loader2,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { Product, Seller, OrderInquiry, Category, ProductCondition, ListingPlan } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';

export default function AdminPage() {
  const router = useRouter();

  // Navigation State
  const [activeNav, setActiveNav] = useState<'dashboard' | 'merchants' | 'upload' | 'products' | 'orders'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Global Header Search
  const [globalSearch, setGlobalSearch] = useState('');

  // Selected Flyer Modal
  const [selectedProductForFlyer, setSelectedProductForFlyer] = useState<Product | null>(null);

  // Filters
  const [merchantFilter, setMerchantFilter] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'suspended' | 'sold'>('all');

  // Modals
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);

  // New Merchant Form State
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantBusiness, setNewMerchantBusiness] = useState('');
  const [newMerchantPhone, setNewMerchantPhone] = useState('');
  const [newMerchantWhatsapp, setNewMerchantWhatsapp] = useState('');
  const [newMerchantLocation, setNewMerchantLocation] = useState('');
  const [newMerchantPlan, setNewMerchantPlan] = useState<ListingPlan>('Featured');
  const [newMerchantPhotography, setNewMerchantPhotography] = useState(true);
  const [newMerchantNotes, setNewMerchantNotes] = useState('');
  const [newMerchantDurationDays, setNewMerchantDurationDays] = useState(30);

  // Upload Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Solar & Power Backup');
  const [prodCondition, setProdCondition] = useState<ProductCondition>('Brand New');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodProblemSolved, setProdProblemSolved] = useState('');
  const [prodImageUrls, setProdImageUrls] = useState<string[]>(['']);
  const [prodSellerId, setProdSellerId] = useState('');
  const [prodListingPlan, setProdListingPlan] = useState<ListingPlan>('Featured');
  const [prodListingFee, setProdListingFee] = useState(25000);
  const [prodIsPinnedTop, setProdIsPinnedTop] = useState(false);
  const [prodSpecs, setProdSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Warranty', value: '1 Year Full Replacement' },
  ]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, sellRes, ordRes] = await Promise.all([
        fetch('/api/products?includeHidden=true').then((r) => r.json()),
        fetch('/api/sellers').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (sellRes.success) {
        setSellers(sellRes.sellers);
        if (sellRes.sellers.length > 0 && !prodSellerId) {
          setProdSellerId(sellRes.sellers[0].id);
        }
      }
      if (ordRes.success) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showNotification('Failed to load data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard shortcut Ctrl+K focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('admin-global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Action: Suspend / Scrap Off Merchant or Activate
  const handleToggleSuspendSeller = async (sellerId: string, currentStatus: string, sellerName: string) => {
    const willSuspend = currentStatus === 'active';
    const confirmMsg = willSuspend
      ? `Are you sure you want to suspend "${sellerName}"? This will IMMEDIATELY hide all their goods from the public platform until they pay!`
      : `Reactivate "${sellerName}"? All their goods will be put back online immediately.`;

    if (!confirm(confirmMsg)) return;

    setActionLoading(sellerId);
    try {
      const res = await fetch('/api/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sellerId,
          action: 'toggle-suspend',
          suspend: willSuspend,
          reason: willSuspend ? 'Subscription expired or awaiting renewal' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        loadData();
      } else {
        showNotification(data.error || 'Failed to update seller', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 1-Click Action: Renew Subscription Period (Paid)
  const handleRenewSeller = async (seller: any) => {
    const feeText = prompt(
      `Enter renewal listing fee paid by "${seller.name}" (UGX):`,
      seller.packagePlan === 'VIP' ? '35000' : seller.packagePlan === 'Featured' ? '25000' : '15000'
    );
    if (feeText === null) return;
    const feePaid = parseInt(feeText, 10) || 0;

    setActionLoading(seller.id);
    try {
      const res = await fetch('/api/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: seller.id,
          action: 'renew',
          days: 30,
          feePaid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Renewed "${seller.name}" for 30 days! All products reactivated online.`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to renew subscription', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 1-Click Action: Send WhatsApp Payment Reminder with Live Stats Link
  const handleSendPaymentReminder = (seller: any) => {
    const amountDue = seller.packagePlan === 'VIP' ? 'UGX 35,000 (VIP Top Banner)' : seller.packagePlan === 'Featured' ? 'UGX 25,000 (Featured)' : 'UGX 15,000 (Basic)';
    const phone = (seller.whatsappNumber || seller.phone).replace(/[^0-9]/g, '');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shidmagic.com';
    const statsUrl = `${origin}/merchant/${seller.id}`;
    const message = `Hello ${seller.name} (${seller.businessName || 'ShidMagic Merchant'}),\n\nYour product listing subscription period on ShidMagic Uganda has expired.\n\nYour items have generated ${seller.totalViews || 0} buyer views and ${seller.totalLeads || 0} WhatsApp inquiries so far! You can inspect your live views here:\n${statsUrl}\n\nTo keep your goods online and at the top for buyers in Kampala, please send your renewal payment of ${amountDue} via MTN MoMo / Airtel Money to 0772123456 (Kato Samuel Raymond).\n\nReply here with your confirmation SMS once paid so we keep your products active. Thank you!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 1-Click Action: Send Live Views Performance Report to Merchant
  const handleSendViewsReport = (seller: any) => {
    const phone = (seller.whatsappNumber || seller.phone).replace(/[^0-9]/g, '');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shidmagic.com';
    const statsUrl = `${origin}/merchant/${seller.id}`;
    const message = `*ShidMagic Performance Report for ${seller.name}*\nShop: ${seller.businessName || seller.location}\n\n*Total Real Buyer Views:* ${seller.totalViews || 0} views\n*WhatsApp Buyer Leads:* ${seller.totalLeads || 0} inquiries\n*Active Listings:* ${seller.activeListingsCount || 0} online\n*Subscription Status:* ${seller.isExpired ? 'Expired' : `${seller.daysRemaining} days remaining`}\n\n*View your live performance and individual product views here:*\n${statsUrl}\n\nNeed to add more goods or renew? Reply directly to this WhatsApp!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Create New Merchant
  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName || !newMerchantPhone) return;

    setActionLoading('create-merchant');
    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMerchantName,
          businessName: newMerchantBusiness,
          phone: newMerchantPhone,
          whatsappNumber: newMerchantWhatsapp || newMerchantPhone,
          location: newMerchantLocation || 'Kampala CBD',
          packagePlan: newMerchantPlan,
          photographyService: newMerchantPhotography,
          durationDays: newMerchantDurationDays,
          notes: newMerchantNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Merchant "${newMerchantName}" registered successfully!`);
        setShowAddMerchantModal(false);
        setNewMerchantName('');
        setNewMerchantBusiness('');
        setNewMerchantPhone('');
        setNewMerchantWhatsapp('');
        setNewMerchantLocation('');
        setNewMerchantNotes('');
        loadData();
      } else {
        showNotification(data.error || 'Failed to create merchant', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Merchant
  const handleDeleteMerchant = async (sellerId: string, name: string) => {
    if (!confirm(`DANGER: Are you sure you want to delete merchant "${name}"? This will delete all their registered listings and cannot be undone.`)) {
      return;
    }
    setActionLoading(sellerId);
    try {
      const res = await fetch(`/api/sellers?id=${sellerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Merchant "${name}" and their products were deleted.`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to delete merchant', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Pin to Top Banner (Adverts)
  const handleTogglePinTop = async (product: Product) => {
    const newPinned = !product.isPinnedTop;
    setActionLoading(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinnedTop: newPinned }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(newPinned ? 'Product pinned to top spotlight banner!' : 'Product unpinned from top banner.');
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Sold Status
  const handleToggleSold = async (product: Product) => {
    const newStatus = product.status === 'sold' ? 'active' : 'sold';
    setActionLoading(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Product marked as ${newStatus}`);
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Delete listing "${title}"?`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Listing deleted successfully');
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Create Product Upload
  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice || !prodSellerId) {
      showNotification('Please fill in title, price, and select a merchant', 'error');
      return;
    }

    const seller = sellers.find((s) => s.id === prodSellerId);
    if (!seller) return;

    setActionLoading('upload-prod');
    try {
      const cleanedImages = prodImageUrls.map((u) => u.trim()).filter((u) => u.length > 0);
      const specsMap: Record<string, string> = {};
      prodSpecs.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specsMap[s.key.trim()] = s.value.trim();
        }
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prodTitle.trim(),
          category: prodCategory,
          condition: prodCondition,
          price: Number(prodPrice),
          originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
          description: prodDescription.trim(),
          problemSolved: prodProblemSolved.trim(),
          images: cleanedImages.length > 0 ? cleanedImages : [
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
          ],
          sellerId: seller.id,
          sellerName: seller.name,
          sellerPhone: seller.phone,
          sellerWhatsapp: seller.whatsappNumber || seller.phone,
          sellerLocation: seller.location,
          sellerVerified: seller.isVerified,
          sellerBadge: seller.verificationBadge,
          listingPlan: prodListingPlan,
          listingFee: prodListingFee,
          isFeatured: prodListingPlan === 'Featured' || prodListingPlan === 'VIP',
          isPinnedTop: prodIsPinnedTop || prodListingPlan === 'VIP',
          status: 'active',
          specs: specsMap,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Product uploaded and published online successfully!');
        setProdTitle('');
        setProdPrice('');
        setProdOriginalPrice('');
        setProdDescription('');
        setProdProblemSolved('');
        setProdImageUrls(['']);
        loadData();
        setActiveNav('products');
      } else {
        showNotification(data.error || 'Failed to upload product', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const activeSellersCount = sellers.filter((s) => s.status === 'active').length;
  const suspendedSellersCount = sellers.filter((s) => s.status === 'suspended').length;
  const expiredSellers = sellers.filter((s) => s.isExpired);
  const activeProductsCount = products.filter((p) => p.status === 'active').length;
  const suspendedProductsCount = products.filter((p) => p.status === 'suspended').length;
  const totalRevenue = sellers.reduce((acc, s) => acc + (s.totalListingFeesPaid || 0), 0) +
    products.reduce((acc, p) => acc + (p.listingFee || 0), 0);
  const totalLeads = products.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);
  const totalViews = products.reduce((acc, p) => acc + p.viewsCount, 0);

  // Filtered views
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      if (merchantFilter === 'active' && s.status !== 'active') return false;
      if (merchantFilter === 'suspended' && s.status !== 'suspended') return false;
      if (merchantFilter === 'expired' && !s.isExpired) return false;
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        return (
          s.name.toLowerCase().includes(q) ||
          (s.businessName && s.businessName.toLowerCase().includes(q)) ||
          s.phone.includes(q) ||
          s.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sellers, merchantFilter, globalSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productFilter === 'active' && p.status !== 'active') return false;
      if (productFilter === 'suspended' && p.status !== 'suspended') return false;
      if (productFilter === 'sold' && p.status !== 'sold') return false;
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        return (
          p.title.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.problemSolved && p.problemSolved.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, productFilter, globalSearch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-row font-sans">
      {/* ================= LEFT SIDEBAR SHELL ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#070d18] text-slate-300 transition-all duration-200 border-r border-[#162032] ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Header with Brand & Collapse Toggle */}
        <div>
          <div className="flex h-16 items-center justify-between px-4 border-b border-[#162032]">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm flex-shrink-0">
                  SM
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-black text-white tracking-tight leading-tight truncate">
                    ShidMagic Admin
                  </h1>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 truncate">
                    Concierge & Operations
                  </p>
                </div>
              </div>
            )}

            {isSidebarCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                SM
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg p-1 text-slate-400 hover:bg-[#162032] hover:text-white transition"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* GROUP 1: MAIN */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  MAIN
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-[#111927] hover:text-white'
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Dashboard</span>}
                </button>
              </div>
            </div>

            {/* GROUP 2: FINANCE & MERCHANTS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  FINANCE & CLIENTS
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveNav('merchants')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === 'merchants'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-[#111927] hover:text-white'
                  }`}
                  title="Clients & Merchants CRM"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Client CRM Directory</span>}
                  </div>
                  {!isSidebarCollapsed && expiredSellers.length > 0 && (
                    <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-black text-white">
                      {expiredSellers.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-[#111927] hover:text-white transition pl-4"
                  title="Record Listing Fee & Onboard"
                >
                  <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  {!isSidebarCollapsed && <span>+ Record Listing Fee</span>}
                </button>

                <button
                  onClick={() => {
                    setActiveNav('merchants');
                    setMerchantFilter('expired');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-[#111927] hover:text-white transition pl-4"
                  title="Manage Expirations"
                >
                  <Clock className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                  {!isSidebarCollapsed && <span>Manage Expirations</span>}
                </button>
              </div>
            </div>

            {/* GROUP 3: CATALOG & ADVERTS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  CATALOG & ADVERTS
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveNav('products')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === 'products'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-[#111927] hover:text-white'
                  }`}
                  title="All Goods"
                >
                  <Package className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>All Listed Goods</span>}
                </button>

                <button
                  onClick={() => setActiveNav('upload')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition pl-4 ${
                    activeNav === 'upload'
                      ? 'text-blue-400 font-bold bg-[#111927]'
                      : 'text-slate-400 hover:bg-[#111927] hover:text-white'
                  }`}
                  title="Upload Goods for Client"
                >
                  <PlusCircle className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                  {!isSidebarCollapsed && <span>+ Upload Goods for Client</span>}
                </button>
              </div>
            </div>

            {/* GROUP 4: LEADS & INQUIRIES */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  INQUIRIES
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveNav('orders')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeNav === 'orders'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-[#111927] hover:text-white'
                  }`}
                  title="Customer Leads"
                >
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Customer Reservations</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: User Profile & Sign Out (Matching Screenshot) */}
        <div className="p-3 border-t border-[#162032] bg-[#050912]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 border border-blue-400/30">
              SK
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">samuel kato</p>
                <p className="text-[10px] text-slate-400 truncate">
                  katosamuelraymond...
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-1.5 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN APPLICATION CANVAS ================= */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          isSidebarCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-2xs">
          {/* Global Search with Ctrl+K shortcut */}
          <div className="relative w-72 sm:w-96">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="admin-global-search"
              type="text"
              placeholder="Search pages, clients, products..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-14 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-2xs"
            />
            <span className="absolute right-2.5 top-2.5 rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 pointer-events-none">
              Ctrl K
            </span>
          </div>

          {/* Top Right Tools & Profile */}
          <div className="flex items-center gap-3">
            {/* Live Marketplace link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Live Marketplace</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setActiveNav('merchants');
                  setMerchantFilter('expired');
                }}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition relative"
                title={`${expiredSellers.length} expired subscriptions`}
              >
                <Bell className="h-4 w-4" />
                {expiredSellers.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white">
                    {expiredSellers.length}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                SK
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">samuel kato</p>
                <p className="text-[10px] text-slate-500 leading-tight">Admin Operator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Floating Notification */}
        {notification && (
          <div
            className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 shadow-xl text-xs font-bold flex items-center gap-2 border ${
              notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Page Greeting & Operational Header (Matching Screenshot) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                  Operator
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Operational Command Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, samuel
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Live overview of merchants, listings, flat listing fees, and real-time buyer analytics across Uganda.
              </p>
            </div>

            {/* Date Pill (Matching Screenshot) */}
            <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Wed, Oct 28, 2026</span>
            </div>
          </div>

          {/* ================= SECTION: FINANCIAL OVERVIEW (EXACT SCREENSHOT LAYOUT) ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">Financial Overview</h2>
                <p className="text-[11px] text-slate-500">
                  Real-time UGX cashflow and concierge listing fee queue for October 2026
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Net October 2026:{' '}
                <span className="text-emerald-700 font-black">{formatPrice(totalRevenue)}</span>
              </span>
            </div>

            {/* 4 Colored Metric Cards (Vertical Left Accent Bars) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Green Accent (Current Month Income) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs border-l-4 border-l-emerald-500 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      CURRENT MONTH INCOME
                    </span>
                    <span className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      $
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {formatPrice(totalRevenue)}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Recorded in October 2026</p>
              </div>

              {/* Card 2: Red Accent (Month Suspended / Unpaid) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs border-l-4 border-l-rose-500 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      SUSPENDED / HIDDEN
                    </span>
                    <span className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                      <TrendingDown className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {suspendedSellersCount} Clients
                  </p>
                </div>
                <p className="text-[11px] text-rose-600 font-semibold mt-2">
                  {suspendedProductsCount} goods scrapped off public view
                </p>
              </div>

              {/* Card 3: Amber Accent (Expiring / Pending Subscriptions) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs border-l-4 border-l-amber-500 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      PENDING CASH REQUESTS
                    </span>
                    <span className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {expiredSellers.length}
                  </p>
                </div>
                <p className="text-[11px] text-amber-700 font-medium mt-2">
                  Awaiting 30-day renewal payments
                </p>
              </div>

              {/* Card 4: Blue Accent (Active Verified Goods) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs border-l-4 border-l-blue-500 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      LIVE ONLINE GOODS
                    </span>
                    <span className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      <Package className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {activeProductsCount}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Live for buyers across Uganda
                </p>
              </div>
            </div>
          </section>

          {/* ================= SECTION: OPERATIONS, MERCHANTS & ACCESS ================= */}
          <section className="space-y-3">
            <h2 className="text-sm font-black text-slate-900">People, Operations & Access</h2>

            {/* 4 Small Summary Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ACTIVE MERCHANTS
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{activeSellersCount}</p>
                </div>
                <span className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="h-4 w-4" />
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    PINNED ADVERTS
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {products.filter((p) => p.isPinnedTop).length}
                  </p>
                </div>
                <span className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    WHATSAPP LEADS
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{totalLeads}</p>
                </div>
                <span className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <MessageCircle className="h-4 w-4" />
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    REAL BUYER VIEWS
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
                <span className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Eye className="h-4 w-4" />
                </span>
              </div>
            </div>
          </section>

          {/* ================= TAB 1: DASHBOARD HOME TABLE ================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recent Merchant Activity</h3>
                  <p className="text-xs text-slate-500">
                    Quick visibility toggle, payment renewals, and performance monitoring.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
                >
                  + Add New Client
                </button>
              </div>

              {/* Table of merchants */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Merchant & Location</th>
                      <th className="p-3.5">Phone / WhatsApp</th>
                      <th className="p-3.5">Plan & Expiry</th>
                      <th className="p-3.5">Live Stats</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Visibility Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sellers.slice(0, 5).map((seller) => {
                      const isSuspended = seller.status === 'suspended';
                      return (
                        <tr key={seller.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{seller.name}</p>
                            <p className="text-[11px] text-slate-500">{seller.businessName || 'Merchant'}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{seller.location}</span>
                            </p>
                          </td>

                          <td className="p-3.5">
                            <p className="font-mono text-slate-800">{seller.phone}</p>
                            <a
                              href={`https://wa.me/${(seller.whatsappNumber || seller.phone).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-700 hover:underline"
                            >
                              WA: {seller.whatsappNumber || seller.phone}
                            </a>
                          </td>

                          <td className="p-3.5">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {seller.packagePlan}
                            </span>
                            <div className="text-[10px] mt-1">
                              {seller.isExpired ? (
                                <span className="font-bold text-rose-600">EXPIRED</span>
                              ) : (
                                <span className="text-emerald-700 font-semibold">
                                  {seller.daysRemaining}d left
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="font-bold text-slate-800">{seller.totalViews || 0} views</p>
                            <p className="text-[10px] text-slate-500">{seller.totalLeads || 0} inquiries</p>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-black ${
                                isSuspended
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isSuspended ? 'HIDDEN' : 'ONLINE'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1.5">
                            {isSuspended ? (
                              <button
                                onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 transition"
                              >
                                Put Online
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition"
                              >
                                Scrap Off
                              </button>
                            )}

                            <Link
                              href={`/merchant/${seller.id}`}
                              target="_blank"
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3 text-emerald-700" />
                              <span>Live Stats</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 2: FULL CLIENT CRM ================= */}
          {activeNav === 'merchants' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900">Clients & Merchants CRM</h2>
                  <p className="text-xs text-slate-500">
                    Full CRUD operations, 1-click scrap off/hide, renewal payments, and WhatsApp reports.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs self-start sm:self-auto"
                >
                  + Register New Merchant
                </button>
              </div>

              {/* Filter tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setMerchantFilter('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    merchantFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All ({sellers.length})
                </button>
                <button
                  onClick={() => setMerchantFilter('active')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    merchantFilter === 'active'
                      ? 'bg-emerald-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Online Active ({activeSellersCount})
                </button>
                <button
                  onClick={() => setMerchantFilter('expired')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    merchantFilter === 'expired'
                      ? 'bg-rose-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Expired Subscriptions ({expiredSellers.length})
                </button>
                <button
                  onClick={() => setMerchantFilter('suspended')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    merchantFilter === 'suspended'
                      ? 'bg-slate-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Hidden / Suspended ({suspendedSellersCount})
                </button>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Merchant / Business</th>
                      <th className="p-3.5">Contacts</th>
                      <th className="p-3.5">Plan & Expiry</th>
                      <th className="p-3.5">Listings & Leads</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSellers.map((seller) => {
                      const isSuspended = seller.status === 'suspended';
                      return (
                        <tr key={seller.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{seller.name}</p>
                            <p className="text-[11px] text-slate-500">{seller.businessName}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{seller.location}</span>
                            </p>
                          </td>

                          <td className="p-3.5">
                            <p className="font-mono text-slate-800">{seller.phone}</p>
                            <a
                              href={`https://wa.me/${(seller.whatsappNumber || seller.phone).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-700 hover:underline"
                            >
                              WA: {seller.whatsappNumber}
                            </a>
                          </td>

                          <td className="p-3.5">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {seller.packagePlan}
                            </span>
                            <div className="text-[10px] mt-1">
                              {seller.isExpired ? (
                                <span className="font-bold text-rose-600">EXPIRED</span>
                              ) : (
                                <span className="text-emerald-700 font-semibold">
                                  {seller.daysRemaining}d left
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="font-bold text-slate-800">{seller.totalViews || 0} views</p>
                            <p className="text-[10px] text-slate-500">{seller.totalLeads || 0} WhatsApp leads</p>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-black ${
                                isSuspended
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isSuspended ? 'HIDDEN' : 'ONLINE'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            {isSuspended ? (
                              <button
                                onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 transition"
                              >
                                Put Online
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition"
                              >
                                Scrap Off
                              </button>
                            )}

                            <Link
                              href={`/merchant/${seller.id}`}
                              target="_blank"
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                              title="Client Live Analytics"
                            >
                              <Eye className="h-3 w-3 text-emerald-700" />
                              <span>Live Stats</span>
                            </Link>

                            <button
                              onClick={() => handleSendViewsReport(seller)}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100"
                              title="Send WhatsApp Report"
                            >
                              Report
                            </button>

                            <button
                              onClick={() => handleRenewSeller(seller)}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                              title="Renew +30 Days"
                            >
                              Renew
                            </button>

                            <button
                              onClick={() => handleDeleteMerchant(seller.id, seller.name)}
                              className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Client"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ALL PRODUCTS CATALOG ================= */}
          {activeNav === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900">All Listed Goods</h2>
                  <p className="text-xs text-slate-500">
                    Pin items to the top moving adverts banner, toggle sold/active, or generate WhatsApp flyers.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('upload')}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs self-start sm:self-auto"
                >
                  + Upload Goods for Client
                </button>
              </div>

              {/* Product table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Product Details</th>
                      <th className="p-3.5">Price (UGX)</th>
                      <th className="p-3.5">Merchant</th>
                      <th className="p-3.5">Top Banner Advert</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="h-10 w-10 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5 flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-sm">
                              <p className="font-bold text-slate-900 truncate">{p.title}</p>
                              <p className="text-[10px] text-slate-500">{p.category} • {p.condition}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-black text-slate-900">
                          {formatPrice(p.price)}
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{p.sellerName}</p>
                          <p className="text-[10px] text-slate-500">{p.sellerPhone}</p>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleTogglePinTop(p)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                              p.isPinnedTop
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {p.isPinnedTop ? '★ Top Banner' : '+ Pin Advert'}
                          </button>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-black ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'sold'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {p.viewsCount || 0} views • {p.whatsappClicks || 0} leads
                          </div>
                        </td>

                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleSold(p)}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                          >
                            {p.status === 'sold' ? 'Activate' : 'Mark Sold'}
                          </button>

                          <button
                            onClick={() => setSelectedProductForFlyer(p)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                            title="Generate WhatsApp Status Flyer"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: UPLOAD TERMINAL ================= */}
          {activeNav === 'upload' && (
            <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                  Concierge Upload Form
                </span>
                <h2 className="mt-1 text-base sm:text-lg font-black text-slate-900">
                  Publish Goods for Client & Record Listing Fee
                </h2>
                <p className="text-xs text-slate-500">
                  Select the merchant, attach product photos, set the price, and describe the problem solved.
                </p>
              </div>

              <form onSubmit={handleUploadProduct} className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      1. Select Merchant / Client *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddMerchantModal(true)}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      + Register New Client First
                    </button>
                  </div>

                  <select
                    value={prodSellerId}
                    onChange={(e) => setProdSellerId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.businessName || s.location}) - Phone: {s.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1000W All-in-One Solar Hybrid Generator & Inverter"
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as Category)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Solar & Power Backup">Solar & Power Backup</option>
                      <option value="Water & Home Tech">Water & Home Tech</option>
                      <option value="Phones & Computers">Phones & Computers</option>
                      <option value="Agri & Food Processing">Agri & Food Processing</option>
                      <option value="Fashion & Beauty">Fashion & Beauty</option>
                      <option value="Vehicles & Auto">Vehicles & Auto</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Selling Price (UGX) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1850000"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Original Price (UGX - Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2200000"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Condition *
                    </label>
                    <select
                      value={prodCondition}
                      onChange={(e) => setProdCondition(e.target.value as ProductCondition)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Gently Used">Gently Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What Problem Does This Solve in Uganda? *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stops Umeme blackouts. Powers Wi-Fi and TV for 14 hours."
                    value={prodProblemSolved}
                    onChange={(e) => setProdProblemSolved(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Full specifications, inclusions, shop warranty details..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Product Photos (Multi-Image Showcase)
                    </label>
                    <button
                      type="button"
                      onClick={() => setProdImageUrls([...prodImageUrls, ''])}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      + Add Image URL
                    </button>
                  </div>

                  {prodImageUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={url}
                        onChange={(e) => {
                          const updated = [...prodImageUrls];
                          updated[idx] = e.target.value;
                          setProdImageUrls(updated);
                        }}
                        className="flex-1 rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                      />
                      {prodImageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setProdImageUrls(prodImageUrls.filter((_, i) => i !== idx))}
                          className="rounded-lg p-2 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Package Selection */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Listing Package Plan
                    </span>
                    <span className="text-xs font-black text-blue-600">
                      Listing Fee: {formatPrice(prodListingFee)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setProdListingPlan('Basic');
                        setProdListingFee(15000);
                        setProdIsPinnedTop(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        prodListingPlan === 'Basic'
                          ? 'border-blue-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">Basic</p>
                      <p className="text-[10px] text-slate-500">UGX 15,000 / mo</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProdListingPlan('Featured');
                        setProdListingFee(25000);
                        setProdIsPinnedTop(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        prodListingPlan === 'Featured'
                          ? 'border-blue-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">Featured</p>
                      <p className="text-[10px] text-slate-500">UGX 25,000 / mo</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProdListingPlan('VIP');
                        setProdListingFee(35000);
                        setProdIsPinnedTop(true);
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        prodListingPlan === 'VIP'
                          ? 'border-blue-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">★ VIP Spotlight</p>
                      <p className="text-[10px] text-slate-500">UGX 35,000 / mo</p>
                    </button>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pinTopCheckbox"
                      checked={prodIsPinnedTop}
                      onChange={(e) => setProdIsPinnedTop(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor="pinTopCheckbox" className="text-xs font-bold text-slate-800">
                      Pin this item to the moving top hero banner on the client marketplace
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === 'upload-prod'}
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-700 transition shadow-xs disabled:opacity-50"
                >
                  {actionLoading === 'upload-prod' ? 'Publishing...' : 'Publish Product to Live Marketplace'}
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 5: LEADS & INQUIRIES ================= */}
          {activeNav === 'orders' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Customer Reservations & Leads</h2>
                <p className="text-xs text-slate-500">
                  Buyer callback requests and verified reservation leads.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Product Title</th>
                      <th className="p-3.5">Buyer Contacts & Location</th>
                      <th className="p-3.5">Notes</th>
                      <th className="p-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No buyer leads recorded yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-mono text-[11px] text-slate-500">{ord.id}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{ord.productTitle}</p>
                            <p className="text-[10px] text-slate-500">{formatPrice(ord.productPrice)}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{ord.buyerName}</p>
                            <p className="font-mono text-[10px] text-slate-600">{ord.buyerPhone}</p>
                            <p className="text-[10px] text-slate-400">{ord.buyerLocation}</p>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-600">{ord.notes || '—'}</td>
                          <td className="p-3.5 text-right">
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                              {ord.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: REGISTER NEW MERCHANT ================= */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Register New Merchant / Client</h3>
                <p className="text-xs text-slate-500">Record merchant details, listing fee plan, and camera visits.</p>
              </div>
              <button onClick={() => setShowAddMerchantModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merchant Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kato Samuel Raymond"
                  value={newMerchantName}
                  onChange={(e) => setNewMerchantName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business / Shop Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kato Solar & Electricals Ltd"
                  value={newMerchantBusiness}
                  onChange={(e) => setNewMerchantBusiness(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (Calls) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+256772123456"
                    value={newMerchantPhone}
                    onChange={(e) => setNewMerchantPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="256772123456"
                    value={newMerchantWhatsapp}
                    onChange={(e) => setNewMerchantWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Location in Kampala *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pioneer Mall, 1st Floor Shop 14, Kampala Road"
                  value={newMerchantLocation}
                  onChange={(e) => setNewMerchantLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Listing Package
                  </label>
                  <select
                    value={newMerchantPlan}
                    onChange={(e) => setNewMerchantPlan(e.target.value as ListingPlan)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Basic">Basic (UGX 15,000)</option>
                    <option value="Featured">Featured (UGX 25,000)</option>
                    <option value="VIP">VIP Spotlight (UGX 35,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subscription Period
                  </label>
                  <select
                    value={newMerchantDurationDays}
                    onChange={(e) => setNewMerchantDurationDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                  >
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={60}>60 Days (2 Months)</option>
                    <option value={90}>90 Days (3 Months)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="photographyCheckbox"
                  checked={newMerchantPhotography}
                  onChange={(e) => setNewMerchantPhotography(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <label htmlFor="photographyCheckbox" className="text-xs font-semibold text-slate-700">
                  Photography service booked (We will visit shop or take photos)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator Notes (Internal)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Paid cash UGX 25,000 on visit. Verified ID card."
                  value={newMerchantNotes}
                  onChange={(e) => setNewMerchantNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMerchantModal(false)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create-merchant'}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 shadow-xs"
                >
                  {actionLoading === 'create-merchant' ? 'Registering...' : 'Register Merchant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FLYER GENERATOR ================= */}
      {selectedProductForFlyer && (
        <FlyerModal
          isOpen={true}
          product={selectedProductForFlyer}
          onClose={() => setSelectedProductForFlyer(null)}
        />
      )}
    </div>
  );
}
