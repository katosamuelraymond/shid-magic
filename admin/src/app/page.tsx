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
  Menu,
  Loader2,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  Building2,
  ArrowUpRight,
  CreditCard,
  CheckSquare,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { Product, Seller, OrderInquiry, Category, ProductCondition, ListingPlan } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';

export default function AdminPage() {
  const router = useRouter();

  // Navigation State
  const [activeNav, setActiveNav] = useState<'dashboard' | 'merchants' | 'upload' | 'products' | 'orders'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Action: Suspend / Scrap Off Merchant or Activate
  const handleToggleSuspendSeller = async (sellerId: string, currentStatus: string, sellerName: string) => {
    const shouldSuspend = currentStatus === 'active';
    const confirmMsg = shouldSuspend
      ? `Are you sure you want to SUSPEND "${sellerName}"? All their goods will be immediately hidden from public view.`
      : `Reactivate "${sellerName}"? All their goods will be brought back online.`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(`suspend-${sellerId}`);
    try {
      const res = await fetch('/api/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_suspension',
          sellerId,
          suspend: shouldSuspend,
          reason: shouldSuspend ? 'Monthly fee unpaid / Under review' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          shouldSuspend
            ? `Client ${sellerName} suspended. ${data.affectedProducts} listings scrapped off public view.`
            : `Client ${sellerName} reactivated and online.`
        );
        loadData();
      } else {
        showNotification(data.error || 'Action failed', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 1-Click Action: Renew Subscription (30 Days)
  const handleRenewSeller = async (sellerId: string, sellerName: string, packagePlan: string) => {
    const defaultFee = packagePlan === 'VIP' ? 35000 : packagePlan === 'Featured' ? 25000 : 15000;
    const feeStr = window.prompt(`Enter listing fee collected in UGX for ${sellerName} (30 days renewal):`, defaultFee.toString());
    if (feeStr === null) return;
    const fee = parseInt(feeStr, 10) || 0;

    setActionLoading(`renew-${sellerId}`);
    try {
      const res = await fetch('/api/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'renew_subscription',
          sellerId,
          days: 30,
          feePaid: fee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Subscription renewed for 30 days! UGX ${fee.toLocaleString()} added to platform revenue.`);
        loadData();
      } else {
        showNotification(data.error || 'Renewal failed', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Pinned Top Advert
  const handleTogglePinTop = async (productId: string, currentPinned: boolean, title: string) => {
    setActionLoading(`pin-${productId}`);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPinnedTop: !currentPinned,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(!currentPinned ? `Pinned "${title}" to top spotlight banner!` : `Unpinned "${title}" from banner.`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to update pin state', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Listing
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Permanently remove "${title}"?`)) return;
    setActionLoading(`del-prod-${id}`);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Listing "${title}" deleted.`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to delete listing', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit New Merchant
  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName.trim() || !newMerchantPhone.trim() || !newMerchantLocation.trim()) {
      showNotification('Please fill in Name, Phone, and Shop Location', 'error');
      return;
    }

    setActionLoading('create-merchant');
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + Number(newMerchantDurationDays));

      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMerchantName.trim(),
          businessName: newMerchantBusiness.trim() || newMerchantName.trim(),
          phone: newMerchantPhone.trim(),
          whatsappNumber: newMerchantWhatsapp.trim() || newMerchantPhone.trim(),
          location: newMerchantLocation.trim(),
          packagePlan: newMerchantPlan,
          photographyService: newMerchantPhotography,
          notes: newMerchantNotes.trim() || undefined,
          isVerified: true,
          verificationBadge: 'Physical Shop Inspected & Verified',
          subscriptionExpiresAt: expDate.toISOString(),
          status: 'active',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Merchant "${data.seller.name}" registered and activated for ${newMerchantDurationDays} days!`);
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

  // Submit Product Upload
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice || !prodSellerId) {
      showNotification('Please fill in Title, Price, and select a Client Shop', 'error');
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

  const handleNavClick = (tab: 'dashboard' | 'merchants' | 'upload' | 'products' | 'orders') => {
    setActiveNav(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-slate-900 flex flex-row font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ================= LEFT EXECUTIVE OBSIDIAN SIDEBAR (ZILA STYLE) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#0b1329] text-slate-300 transition-all duration-200 border-r border-[#1a2542] ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-16 w-64' : 'w-64'}`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-[#1a2542]">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm flex-shrink-0">
                  SM
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                    SHIDMAGIC
                  </h1>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 truncate">
                    Marketplace & Ops System
                  </p>
                </div>
              </div>
            )}

            {isSidebarCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                SM
              </div>
            )}

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden rounded-lg p-1.5 text-slate-400 hover:bg-[#1a2542] hover:text-white"
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block rounded-lg p-1 text-slate-400 hover:bg-[#1a2542] hover:text-white transition"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* GROUP 1: MAIN */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  MAIN
                </p>
              )}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </button>
            </div>

            {/* GROUP 2: MERCHANTS & OPERATIONS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  CLIENTS & SHOPS
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('merchants')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'merchants'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                  }`}
                  title="Merchants Directory"
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">Client Merchants</span>
                      {expiredSellers.length > 0 && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {expiredSellers.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowAddMerchantModal(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-[#15203b] hover:text-white transition pl-4"
                  title="Add New Merchant"
                >
                  <PlusCircle className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                  {!isSidebarCollapsed && <span>Register Merchant</span>}
                </button>
              </div>
            </div>

            {/* GROUP 3: CATALOG & GOODS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  GOODS & CATALOG
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('products')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'products'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                  }`}
                  title="All Goods"
                >
                  <Package className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>All Listed Goods</span>}
                </button>

                <button
                  onClick={() => handleNavClick('upload')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition pl-4 ${
                    activeNav === 'upload'
                      ? 'text-blue-400 font-bold bg-[#15203b]'
                      : 'text-slate-400 hover:bg-[#15203b] hover:text-white'
                  }`}
                  title="Upload Goods for Client"
                >
                  <PlusCircle className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                  {!isSidebarCollapsed && <span>Upload Goods</span>}
                </button>
              </div>
            </div>

            {/* GROUP 4: INQUIRIES & LEADS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  INQUIRIES
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('orders')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'orders'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
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

        {/* Sidebar Footer: User Profile & Logout */}
        <div className="p-3 border-t border-[#1a2542] bg-[#070d1a]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              SK
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Samuel Kato</p>
                <p className="text-[10px] text-slate-400 truncate">Administrator</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-1.5 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN APPLICATION CANVAS ================= */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 w-full transition-all duration-200 ${
          isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
        } pl-0`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-2xs gap-3">
          {/* Mobile Hamburger & Global Search */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 flex-shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="relative flex-1 max-w-md min-w-0">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="admin-global-search"
                type="text"
                placeholder="Search pages, merchants, products..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-14 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-2xs"
              />
              <span className="hidden sm:inline-block absolute right-2.5 top-2.5 rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 pointer-events-none">
                Ctrl K
              </span>
            </div>
          </div>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Live Marketplace link */}
            <a
              href="https://shidmagic.conquerer.org"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Public Store</span>
            </a>

            {/* Notification Bell */}
            <button
              onClick={() => {
                handleNavClick('merchants');
                setMerchantFilter('expired');
              }}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition relative"
              title={`${expiredSellers.length} expired subscriptions`}
            >
              <Bell className="h-4 w-4" />
              {expiredSellers.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {expiredSellers.length}
                </span>
              )}
            </button>

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                SK
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">Samuel Kato</p>
                <p className="text-[10px] text-slate-500 leading-tight">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Floating Notification */}
        {notification && (
          <div
            className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg text-xs font-semibold flex items-center gap-2 border ${
              notification.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
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
          {/* ================= EXECUTIVE SUMMARY BANNER (MUBS & ZILA HYBRID) ================= */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    OPERATIONAL PROGRAMME:
                  </span>
                  <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    KAMPALA MARKETPLACE CONCIERGE (SHID)
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Physical shop verification, flat monthly listing fees, and direct WhatsApp buyer routing.
                </p>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  OCTOBER 2026
                </span>
                <span className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs">
                  REVENUE: {formatPrice(totalRevenue)}
                </span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  ACTIVE SHOPS
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{activeSellersCount} Clients</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  LIVE GOODS
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{activeProductsCount} Items</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  WHATSAPP LEADS
                </p>
                <p className="text-lg font-bold text-blue-700 mt-0.5">{totalLeads} Contacts</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  EXPIRED SUBSCRIPTIONS
                </p>
                <p className={`text-lg font-bold mt-0.5 ${expiredSellers.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {expiredSellers.length} Due
                </p>
              </div>
            </div>
          </div>

          {/* ================= SECTION: QUICK ACTIONS (ZILA FINANCE EXACT GRID) ================= */}
          {activeNav === 'dashboard' && (
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
                <p className="text-xs text-slate-500">Jump directly to your most frequent management tasks</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Register Client Merchant */}
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Register Client Merchant
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Verify shop location & assign monthly listing plan.
                    </p>
                  </div>
                </button>

                {/* 2. Upload Goods */}
                <button
                  onClick={() => handleNavClick('upload')}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Upload Goods for Client
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Publish items, specs, pricing & WhatsApp photos.
                    </p>
                  </div>
                </button>

                {/* 3. Manage Subscriptions */}
                <button
                  onClick={() => {
                    handleNavClick('merchants');
                    setMerchantFilter('expired');
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Renew Subscriptions
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Review expiring 30-day merchant listing plans.
                    </p>
                  </div>
                </button>

                {/* 4. Customer Inquiries */}
                <button
                  onClick={() => handleNavClick('orders')}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Customer Leads & Inquiries
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Track reservations & direct WhatsApp contacts.
                    </p>
                  </div>
                </button>

                {/* 5. Spotlight Adverts */}
                <button
                  onClick={() => {
                    handleNavClick('products');
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Spotlight & Pinned Adverts
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Pin high-ticket products to top showcase banner.
                    </p>
                  </div>
                </button>

                {/* 6. All Listed Goods */}
                <button
                  onClick={() => handleNavClick('products')}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-400 hover:shadow-xs transition flex items-start gap-3.5 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-slate-700 group-hover:text-white transition">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      Manage All Goods
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Audit price, condition, views, and stock status.
                    </p>
                  </div>
                </button>
              </div>
            </section>
          )}

          {/* ================= TAB 1: RECENT MERCHANTS TABLE (EXECUTIVE DESIGN) ================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Merchant Activity</h3>
                  <p className="text-xs text-slate-500">
                    Direct access to toggle client visibility, renew payments, and inspect metrics.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs"
                >
                  + Add Client Merchant
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Merchant & Location</th>
                      <th className="p-3.5">Contact Details</th>
                      <th className="p-3.5">Subscription Plan</th>
                      <th className="p-3.5">Performance</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sellers.slice(0, 5).map((seller) => {
                      const isSuspended = seller.status === 'suspended';
                      return (
                        <tr key={seller.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <p className="font-semibold text-slate-900">{seller.name}</p>
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
                              className="text-[10px] font-semibold text-emerald-700 hover:underline"
                            >
                              WhatsApp: {seller.whatsappNumber || seller.phone}
                            </a>
                          </td>

                          <td className="p-3.5">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {seller.packagePlan}
                            </span>
                            <div className="text-[10px] mt-1">
                              {seller.isExpired ? (
                                <span className="font-bold text-red-600">EXPIRED</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">
                                  {seller.daysRemaining}d left
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="font-semibold text-slate-800">{seller.totalViews || 0} views</p>
                            <p className="text-[10px] text-slate-500">{seller.totalLeads || 0} inquiries</p>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                                isSuspended
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isSuspended ? 'SUSPENDED' : 'ONLINE'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                              disabled={actionLoading === `suspend-${seller.id}`}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border ${
                                isSuspended
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </button>

                            <button
                              onClick={() => handleRenewSeller(seller.id, seller.name, seller.packagePlan)}
                              disabled={actionLoading === `renew-${seller.id}`}
                              className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                            >
                              Renew +30d
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

          {/* ================= TAB 2: MERCHANTS DIRECTORY ================= */}
          {activeNav === 'merchants' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Registered Client Merchants</h2>
                  <p className="text-xs text-slate-500">
                    Audit physical store visits, package subscriptions, and visibility status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter Pills */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                    {(['all', 'active', 'expired', 'suspended'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMerchantFilter(filter)}
                        className={`rounded-md px-3 py-1 font-semibold capitalize transition ${
                          merchantFilter === filter
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs"
                  >
                    + Add Merchant
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[750px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Merchant / Shop</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Plan & Expiry</th>
                      <th className="p-3.5">Fees Paid</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Visibility Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSellers.map((seller) => {
                      const isSuspended = seller.status === 'suspended';
                      return (
                        <tr key={seller.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <p className="font-semibold text-slate-900">{seller.name}</p>
                            <p className="text-[11px] text-slate-500">{seller.businessName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{seller.location}</span>
                            </p>
                          </td>

                          <td className="p-3.5">
                            <p className="font-mono text-slate-800">{seller.phone}</p>
                            <p className="text-[10px] text-emerald-700 font-semibold">
                              WA: {seller.whatsappNumber || seller.phone}
                            </p>
                          </td>

                          <td className="p-3.5">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {seller.packagePlan}
                            </span>
                            <div className="text-[10px] mt-1">
                              {seller.isExpired ? (
                                <span className="font-bold text-red-600">EXPIRED</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">
                                  {seller.daysRemaining} days left
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5 font-semibold text-slate-800">
                            {formatPrice(seller.totalListingFeesPaid || 0)}
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                                isSuspended
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isSuspended ? 'SUSPENDED' : 'ONLINE'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                              disabled={actionLoading === `suspend-${seller.id}`}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border ${
                                isSuspended
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </button>

                            <button
                              onClick={() => handleRenewSeller(seller.id, seller.name, seller.packagePlan)}
                              disabled={actionLoading === `renew-${seller.id}`}
                              className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                            >
                              Renew +30d
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

          {/* ================= TAB 3: UPLOAD GOODS FORM ================= */}
          {activeNav === 'upload' && (
            <div className="max-w-4xl space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="border-b border-slate-100 pb-4 mb-5">
                  <h2 className="text-base font-bold text-slate-900">Upload Goods for Client Merchant</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Items are immediately vetted and made searchable for customers across Kampala and Uganda.
                  </p>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Client Merchant Shop *
                      </label>
                      <select
                        required
                        value={prodSellerId}
                        onChange={(e) => setProdSellerId(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1000W Solar Hybrid Generator (1200Wh Lithium + Panel)"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as Category)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="Solar & Power Backup">Solar & Power Backup</option>
                        <option value="Water & Home Tech">Water & Home Tech</option>
                        <option value="Phones & Computers">Phones & Computers</option>
                        <option value="Agri & Food Processing">Agri & Food Processing</option>
                        <option value="Fashion & Beauty">Fashion & Beauty</option>
                        <option value="Vehicles & Auto">Vehicles & Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Price (UGX) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 1850000"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Original Price (Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2200000"
                        value={prodOriginalPrice}
                        onChange={(e) => setProdOriginalPrice(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Everyday Challenge It Solves (Key Buyer Value)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stops Umeme load-shedding. Keeps Wi-Fi, 43'' TV, and lights powered for 14 hours."
                      value={prodProblemSolved}
                      onChange={(e) => setProdProblemSolved(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Description & Specifications
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed technical description, warranty terms, and delivery instructions..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Image URL (Direct link to photo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={prodImageUrls[0] || ''}
                      onChange={(e) => setProdImageUrls([e.target.value])}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={prodIsPinnedTop}
                        onChange={(e) => setProdIsPinnedTop(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Pin to Top Spotlight Banner (Hero Showcase)</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('products')}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading === 'upload-prod'}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs disabled:opacity-50"
                    >
                      {actionLoading === 'upload-prod' ? 'Publishing...' : 'Publish Goods Live'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 4: ALL LISTED GOODS TABLE ================= */}
          {activeNav === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">All Listed Goods ({filteredProducts.length})</h2>
                  <p className="text-xs text-slate-500">
                    Audit prices, views, WhatsApp click leads, and spotlight pin status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                    {(['all', 'active', 'suspended', 'sold'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setProductFilter(filter)}
                        className={`rounded-md px-3 py-1 font-semibold capitalize transition ${
                          productFilter === filter
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleNavClick('upload')}
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs"
                  >
                    + Upload Goods
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[750px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Product Title & Category</th>
                      <th className="p-3.5">Client Merchant</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Buyer Leads</th>
                      <th className="p-3.5">Spotlight</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-slate-500">{p.category} • {p.condition}</p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-slate-800">{p.sellerName}</p>
                          <p className="text-[10px] text-slate-400">{p.sellerLocation}</p>
                        </td>

                        <td className="p-3.5 font-bold text-slate-900">
                          {formatPrice(p.price)}
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-slate-800">{p.viewsCount} views</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">{p.whatsappClicks} WhatsApp clicks</p>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleTogglePinTop(p.id, Boolean(p.isPinnedTop), p.title)}
                            disabled={actionLoading === `pin-${p.id}`}
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold transition border ${
                              p.isPinnedTop
                                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {p.isPinnedTop ? 'Pinned Top' : 'Pin to Banner'}
                          </button>
                        </td>

                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedProductForFlyer(p)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            WhatsApp Flyer
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            disabled={actionLoading === `del-prod-${p.id}`}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 5: CUSTOMER INQUIRIES & ORDERS ================= */}
          {activeNav === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Customer Reservations & Inquiries</h2>
                  <p className="text-xs text-slate-500">
                    Buyers who filled out product order forms for direct merchant contact.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Phone / Contact</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Requested Product</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 text-xs">
                          No pending customer reservations. Inquiries arrive here automatically.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5 font-semibold text-slate-900">{o.buyerName}</td>
                          <td className="p-3.5 font-mono text-slate-800">{o.buyerPhone}</td>
                          <td className="p-3.5 text-slate-600">{o.buyerLocation}</td>
                          <td className="p-3.5 font-semibold text-slate-800">{o.productTitle}</td>
                          <td className="p-3.5 text-slate-500 text-[11px]">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="p-3.5 text-right">
                            <span className="rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 text-[10px]">
                              {o.status}
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

      {/* ================= MODAL: REGISTER MERCHANT ================= */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Register New Client Merchant</h3>
              <button onClick={() => setShowAddMerchantModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merchant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kato Solar & Electricals"
                  value={newMerchantName}
                  onChange={(e) => setNewMerchantName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 772 123456"
                    value={newMerchantPhone}
                    onChange={(e) => setNewMerchantPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Shop Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pioneer Mall, 1st Floor Shop 14, Kampala CBD"
                  value={newMerchantLocation}
                  onChange={(e) => setNewMerchantLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={newMerchantPlan}
                    onChange={(e) => setNewMerchantPlan(e.target.value as ListingPlan)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Basic">Basic (UGX 15,000/mo)</option>
                    <option value="Featured">Featured (UGX 25,000/mo)</option>
                    <option value="VIP">VIP Priority (UGX 35,000/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Period
                  </label>
                  <select
                    value={newMerchantDurationDays}
                    onChange={(e) => setNewMerchantDurationDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={60}>60 Days (2 Months)</option>
                    <option value={90}>90 Days (3 Months)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMerchantModal(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create-merchant'}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs"
                >
                  {actionLoading === 'create-merchant' ? 'Registering...' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Flyer Modal */}
      {selectedProductForFlyer && (
        <FlyerModal
          product={selectedProductForFlyer}
          isOpen={Boolean(selectedProductForFlyer)}
          onClose={() => setSelectedProductForFlyer(null)}
        />
      )}
    </div>
  );
}
