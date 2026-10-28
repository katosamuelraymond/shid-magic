'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Users,
  MessageCircle,
  Eye,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Share2,
  Phone,
  MapPin,
  TrendingUp,
  Search,
  Check,
  Send,
  Loader2,
  X,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
  LogOut,
  Flame,
  ShieldCheck,
  Camera,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Product, Seller, OrderInquiry, Category, ProductCondition, ListingPlan } from '@/lib/types';
import { formatPrice, buildSellerReportWhatsAppLink } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'products' | 'upload' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Selected Flyer Modal
  const [selectedProductForFlyer, setSelectedProductForFlyer] = useState<Product | null>(null);

  // Filters
  const [merchantFilter, setMerchantFilter] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [merchantSearch, setMerchantSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'suspended' | 'sold'>('all');
  const [productSearch, setProductSearch] = useState('');

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

  // 1-Click Action: Send WhatsApp Payment Reminder
  const handleSendPaymentReminder = (seller: any) => {
    const amountDue = seller.packagePlan === 'VIP' ? 'UGX 35,000 (VIP Top Banner)' : seller.packagePlan === 'Featured' ? 'UGX 25,000 (Featured)' : 'UGX 15,000 (Basic)';
    const phone = (seller.whatsappNumber || seller.phone).replace(/[^0-9]/g, '');
    const message = `Hello ${seller.name} (${seller.businessName || 'ShidMagic Merchant'}),\n\nYour product listing subscription period on ShidMagic Uganda has expired.\n\nTo keep your goods online and at the top for buyers in Kampala, please send your renewal payment of ${amountDue} via MTN MoMo / Airtel Money to 0772123456 (Kato Samuel Raymond).\n\nReply here with your confirmation SMS once paid so we keep your products active. Thank you!`;
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
        // Reset form
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
        // Reset form
        setProdTitle('');
        setProdPrice('');
        setProdOriginalPrice('');
        setProdDescription('');
        setProdProblemSolved('');
        setProdImageUrls(['']);
        loadData();
        setActiveTab('products');
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

  // Filtered views
  const filteredSellers = sellers.filter((s) => {
    if (merchantFilter === 'active' && s.status !== 'active') return false;
    if (merchantFilter === 'suspended' && s.status !== 'suspended') return false;
    if (merchantFilter === 'expired' && !s.isExpired) return false;
    if (merchantSearch) {
      const q = merchantSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        s.phone.includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (productFilter === 'active' && p.status !== 'active') return false;
    if (productFilter === 'suspended' && p.status !== 'suspended') return false;
    if (productFilter === 'sold' && p.status !== 'sold') return false;
    if (productSearch) {
      const q = productSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Operator Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  Shid<span className="text-emerald-700">Magic</span> Admin
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                  OPERATOR
                </span>
                <span className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-2 py-0.2 text-[9px] font-mono text-slate-600">
                  admin.shidmagic.com
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Concierge Desk & Merchant Subscription Terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>View Live Marketplace</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
            >
              <LogOut className="h-3 w-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('merchants')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'merchants'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Clients & Merchants CRM</span>
              <span className="rounded-full bg-emerald-900/30 px-1.5 py-0.2 text-[9px]">
                {sellers.length}
              </span>
              {expiredSellers.length > 0 && (
                <span className="rounded-full bg-rose-600 text-white px-1.5 py-0.2 text-[9px] font-black">
                  {expiredSellers.length} EXPIRED
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>All Goods Catalog</span>
              <span className="rounded-full bg-emerald-900/30 px-1.5 py-0.2 text-[9px]">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Upload Goods for Client</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Customer Leads & Inquiries</span>
              <span className="rounded-full bg-emerald-900/30 px-1.5 py-0.2 text-[9px]">
                {orders.length}
              </span>
            </button>
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

      {/* Expired Alert Banner */}
      {expiredSellers.length > 0 && activeTab !== 'merchants' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-900">
                  {expiredSellers.length} Merchant Subscription(s) Have Expired!
                </p>
                <p className="text-[11px] text-rose-700">
                  Clients have not paid their renewal fee. You can suspend them with 1-click or send a WhatsApp reminder.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('merchants');
                setMerchantFilter('expired');
              }}
              className="rounded-lg bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-800 transition whitespace-nowrap self-start sm:self-auto"
            >
              Review Expired Clients &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
              <span>Loading operations data...</span>
            </div>
          </div>
        ) : (
          <>
            {/* ================= TAB 1: OVERVIEW ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Executive KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Total Listing Revenue
                    </p>
                    <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-800">
                      {formatPrice(totalRevenue)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Flat fees collected from clients</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Active Merchants
                      </p>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-black">
                        {activeSellersCount} Online
                      </span>
                    </div>
                    <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                      {sellers.length} Total
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {suspendedSellersCount} suspended / {expiredSellers.length} expired
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Live Goods Online
                      </p>
                      <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-black">
                        {activeProductsCount} Live
                      </span>
                    </div>
                    <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                      {products.length} Items
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {suspendedProductsCount} hidden from public
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      WhatsApp Leads Delivered
                    </p>
                    <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-700">
                      {totalLeads} Buyer Leads
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Direct buyer taps to seller WhatsApp</p>
                  </div>
                </div>

                {/* Operations Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <PlusCircle className="h-5 w-5" />
                      <h3 className="font-black text-sm">New Client Onboarding</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      A merchant contacted you? Register their shop, record listing fee payment, and schedule photo shoots.
                    </p>
                    <button
                      onClick={() => setShowAddMerchantModal(true)}
                      className="w-full rounded-lg bg-emerald-800 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition"
                    >
                      + Register New Merchant
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Package className="h-5 w-5" />
                      <h3 className="font-black text-sm">Upload Goods for Merchant</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Upload received photos, technical specifications, and connect direct WhatsApp buying buttons.
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="w-full rounded-lg bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                    >
                      Open Upload Terminal
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Clock className="h-5 w-5" />
                      <h3 className="font-black text-sm">Subscription & Expirations</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Track 30-day listing periods. 1-click scrap off unpaid merchants or extend subscriptions.
                    </p>
                    <button
                      onClick={() => setActiveTab('merchants')}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                    >
                      Manage Clients & Expirations
                    </button>
                  </div>
                </div>

                {/* Recent High Priority Spotlight Items */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Top Spotlight Adverts (Moving Banner Items)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Goods pinned to the top sliding hero banner on the client marketplace.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      {products.filter((p) => p.isPinnedTop).length} Pinned
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {products.slice(0, 5).map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-10 w-10 rounded-md object-contain bg-slate-50 border border-slate-200 p-0.5 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {p.sellerName} • {formatPrice(p.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleTogglePinTop(p)}
                            className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                              p.isPinnedTop
                                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {p.isPinnedTop ? '★ Pinned to Top Banner' : 'Pin to Top Banner'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: MERCHANTS & CLIENTS CRM ================= */}
            {activeTab === 'merchants' && (
              <div className="space-y-4">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Clients & Merchants CRM</h2>
                    <p className="text-xs text-slate-500">
                      Manage subscriptions, fee payments, and 1-click visibility controls (scrap off or put online).
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddMerchantModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-xs self-start sm:self-auto"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Register New Client</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setMerchantFilter('all')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        merchantFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      All Clients ({sellers.length})
                    </button>
                    <button
                      onClick={() => setMerchantFilter('active')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        merchantFilter === 'active'
                          ? 'bg-emerald-700 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Online Active ({activeSellersCount})
                    </button>
                    <button
                      onClick={() => setMerchantFilter('expired')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        merchantFilter === 'expired'
                          ? 'bg-rose-600 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Expired Subscriptions ({expiredSellers.length})
                    </button>
                    <button
                      onClick={() => setMerchantFilter('suspended')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        merchantFilter === 'suspended'
                          ? 'bg-slate-700 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Suspended / Hidden ({suspendedSellersCount})
                    </button>
                  </div>

                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search clients by name, shop, phone..."
                      value={merchantSearch}
                      onChange={(e) => setMerchantSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Merchants Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          <th className="p-3">Merchant / Business</th>
                          <th className="p-3">Contacts</th>
                          <th className="p-3">Package & Expiry</th>
                          <th className="p-3">Listings & Leads</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSellers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              No clients found matching the filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredSellers.map((seller) => {
                            const isSuspended = seller.status === 'suspended';
                            const isExp = seller.isExpired;

                            return (
                              <tr key={seller.id} className="hover:bg-slate-50/80 transition">
                                <td className="p-3">
                                  <div className="font-bold text-slate-900">{seller.name}</div>
                                  <div className="text-[11px] text-slate-500">{seller.businessName}</div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-slate-400" />
                                    <span>{seller.location}</span>
                                  </div>
                                  {seller.photographyService && (
                                    <span className="inline-flex items-center gap-0.5 rounded bg-blue-50 text-blue-700 px-1.5 py-0.2 text-[9px] font-bold mt-1">
                                      <Camera className="h-2.5 w-2.5" />
                                      <span>Photos Taken by Us</span>
                                    </span>
                                  )}
                                </td>

                                <td className="p-3">
                                  <div className="font-mono text-[11px] text-slate-800">{seller.phone}</div>
                                  <div className="text-[10px] text-slate-500">WA: {seller.whatsappNumber}</div>
                                  <a
                                    href={`https://wa.me/${seller.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline mt-0.5"
                                  >
                                    <MessageCircle className="h-2.5 w-2.5" />
                                    <span>Chat Direct</span>
                                  </a>
                                </td>

                                <td className="p-3">
                                  <span
                                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                                      seller.packagePlan === 'VIP'
                                        ? 'bg-purple-100 text-purple-800'
                                        : seller.packagePlan === 'Featured'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {seller.packagePlan} Listing
                                  </span>

                                  <div className="mt-1 text-[11px]">
                                    {isExp ? (
                                      <span className="font-bold text-rose-600 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>EXPIRED ({Math.abs(seller.daysRemaining)}d ago)</span>
                                      </span>
                                    ) : (
                                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{seller.daysRemaining} days left</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Paid Total: {formatPrice(seller.totalListingFeesPaid || 0)}
                                  </div>
                                </td>

                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">
                                    {seller.activeListingsCount} active / {seller.totalProductsCount} total
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {seller.totalViews} views • {seller.totalLeads} leads
                                  </div>
                                </td>

                                <td className="p-3">
                                  <span
                                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-black ${
                                      isSuspended
                                        ? 'bg-slate-200 text-slate-700'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {isSuspended ? '● HIDDEN / SUSPENDED' : '● ONLINE ACTIVE'}
                                  </span>
                                  {isSuspended && seller.suspendedReason && (
                                    <p className="text-[9px] text-slate-400 mt-0.5 max-w-[140px] truncate">
                                      {seller.suspendedReason}
                                    </p>
                                  )}
                                </td>

                                <td className="p-3 text-right space-y-1">
                                  {/* THE CRUCIAL 1-CLICK TOGGLE TO SCRAP OFF OR ACTIVATE */}
                                  <div>
                                    {isSuspended ? (
                                      <button
                                        disabled={actionLoading === seller.id}
                                        onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                        className="w-full sm:w-auto rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-black text-white hover:bg-emerald-800 transition shadow-2xs"
                                      >
                                        Put Online Again
                                      </button>
                                    ) : (
                                      <button
                                        disabled={actionLoading === seller.id}
                                        onClick={() => handleToggleSuspendSeller(seller.id, seller.status, seller.name)}
                                        className="w-full sm:w-auto rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-black text-rose-700 hover:bg-rose-100 transition"
                                      >
                                        Scrap Off (Hide All)
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-end gap-1 pt-0.5">
                                    <button
                                      onClick={() => handleRenewSeller(seller)}
                                      title="Record Payment & Renew 30 Days"
                                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 hover:bg-slate-200"
                                    >
                                      Renew +30d
                                    </button>

                                    <button
                                      onClick={() => handleSendPaymentReminder(seller)}
                                      title="Send WhatsApp Payment SMS"
                                      className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                                    >
                                      WA Reminder
                                    </button>

                                    <button
                                      onClick={() => handleDeleteMerchant(seller.id, seller.name)}
                                      title="Delete Merchant Permanently"
                                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: PRODUCTS CATALOG ================= */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div>
                    <h2 className="text-base font-black text-slate-900">All Client Goods Catalog</h2>
                    <p className="text-xs text-slate-500">
                      Toggle active/sold, pin goods to top sliding banner adverts, or generate WhatsApp status flyers.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-xs self-start sm:self-auto"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Upload Goods for Client</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setProductFilter('all')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        productFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilter('active')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        productFilter === 'active'
                          ? 'bg-emerald-700 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Active Online ({activeProductsCount})
                    </button>
                    <button
                      onClick={() => setProductFilter('suspended')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        productFilter === 'suspended'
                          ? 'bg-slate-700 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Hidden / Suspended ({suspendedProductsCount})
                    </button>
                    <button
                      onClick={() => setProductFilter('sold')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        productFilter === 'sold'
                          ? 'bg-purple-700 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Sold Out
                    </button>
                  </div>

                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search title, merchant, category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Product Listings Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          <th className="p-3">Product</th>
                          <th className="p-3">Price (UGX)</th>
                          <th className="p-3">Merchant</th>
                          <th className="p-3">Top Adverts Banner</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={p.images[0]}
                                  alt={p.title}
                                  className="h-10 w-10 rounded-md object-contain bg-slate-50 border border-slate-200 p-0.5 flex-shrink-0"
                                />
                                <div className="min-w-0 max-w-sm">
                                  <div className="font-bold text-slate-900 truncate">{p.title}</div>
                                  <div className="text-[10px] text-slate-500">
                                    {p.category} • {p.condition}
                                  </div>
                                  {p.problemSolved && (
                                    <p className="text-[9px] text-emerald-800 line-clamp-1 italic mt-0.5">
                                      &ldquo;{p.problemSolved}&rdquo;
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="font-black text-slate-900">{formatPrice(p.price)}</div>
                              {p.originalPrice && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  {formatPrice(p.originalPrice)}
                                </div>
                              )}
                            </td>

                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{p.sellerName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{p.sellerPhone}</div>
                              <div className="text-[10px] text-slate-400">{p.sellerLocation}</div>
                            </td>

                            <td className="p-3">
                              <button
                                onClick={() => handleTogglePinTop(p)}
                                className={`rounded px-2 py-1 text-[10px] font-bold transition flex items-center gap-1 ${
                                  p.isPinnedTop
                                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                    : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span>{p.isPinnedTop ? '★ Pinned to Top' : '+ Pin to Top'}</span>
                              </button>
                            </td>

                            <td className="p-3">
                              <span
                                className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${
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
                                {p.viewsCount} views • {p.whatsappClicks} WhatsApp
                              </div>
                            </td>

                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleSold(p)}
                                className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                              >
                                {p.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                              </button>

                              <button
                                onClick={() => setSelectedProductForFlyer(p)}
                                title="Generate WhatsApp Status Flyer"
                                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                              >
                                <Share2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                title="Delete Listing"
                                className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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
              </div>
            )}

            {/* ================= TAB 4: CONCIERGE UPLOAD FORM ================= */}
            {activeTab === 'upload' && (
              <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Concierge Merchant Upload Terminal
                  </span>
                  <h2 className="mt-1 text-base sm:text-lg font-black text-slate-900">
                    Publish Goods for Client & Record Listing Fee
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select the registered client, attach product photos, set the price, and describe what problem it solves.
                  </p>
                </div>

                <form onSubmit={handleUploadProduct} className="space-y-4">
                  {/* Merchant Selection */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        1. Select Merchant / Client *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddMerchantModal(true)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        + Register New Client First
                      </button>
                    </div>

                    <select
                      value={prodSellerId}
                      onChange={(e) => setProdSellerId(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                    >
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.businessName || s.location}) - Phone: {s.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title & Category */}
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
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as Category)}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
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

                  {/* Pricing */}
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
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
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
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Condition *
                      </label>
                      <select
                        value={prodCondition}
                        onChange={(e) => setProdCondition(e.target.value as ProductCondition)}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                      >
                        <option value="Brand New">Brand New</option>
                        <option value="Like New">Like New</option>
                        <option value="Gently Used">Gently Used</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                  </div>

                  {/* Problem Solved */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What Everyday Challenge Does This Solve in Uganda? *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stops Umeme blackouts. Keeps Wi-Fi and lights running 24/7 without noisy generator fuel."
                      value={prodProblemSolved}
                      onChange={(e) => setProdProblemSolved(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Description & Inclusions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Include full details of cables, accessories, shop warranty, and inspection steps..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-none"
                    />
                  </div>

                  {/* Multiple Product Images */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Product Photo URLs (Multi-Image Showcase)
                      </label>
                      <button
                        type="button"
                        onClick={() => setProdImageUrls([...prodImageUrls, ''])}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        + Add Another Image URL
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
                          className="flex-1 rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
                        />
                        {prodImageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setProdImageUrls(prodImageUrls.filter((_, i) => i !== idx))}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Package & Top Banner Toggle */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Listing Package & Top Adverts Banner
                      </label>
                      <span className="text-xs font-bold text-amber-900">
                        Listing Fee: {formatPrice(prodListingFee)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProdListingPlan('Basic');
                          setProdListingFee(15000);
                          setProdIsPinnedTop(false);
                        }}
                        className={`rounded-lg p-2.5 text-left border transition ${
                          prodListingPlan === 'Basic'
                            ? 'border-emerald-700 bg-white shadow-2xs'
                            : 'border-slate-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">Basic Listing</p>
                        <p className="text-[10px] text-slate-500">UGX 15,000 / month</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProdListingPlan('Featured');
                          setProdListingFee(25000);
                          setProdIsPinnedTop(false);
                        }}
                        className={`rounded-lg p-2.5 text-left border transition ${
                          prodListingPlan === 'Featured'
                            ? 'border-emerald-700 bg-white shadow-2xs'
                            : 'border-slate-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">Featured Priority</p>
                        <p className="text-[10px] text-slate-500">UGX 25,000 / month</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProdListingPlan('VIP');
                          setProdListingFee(35000);
                          setProdIsPinnedTop(true);
                        }}
                        className={`rounded-lg p-2.5 text-left border transition ${
                          prodListingPlan === 'VIP'
                            ? 'border-emerald-700 bg-white shadow-2xs'
                            : 'border-slate-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">★ VIP Spotlight Advert</p>
                        <p className="text-[10px] text-slate-500">UGX 35,000 (Top Banner)</p>
                      </button>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pinTopCheckbox"
                        checked={prodIsPinnedTop}
                        onChange={(e) => setProdIsPinnedTop(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                      />
                      <label htmlFor="pinTopCheckbox" className="text-xs font-bold text-slate-800">
                        Pin this item to the moving top hero banner on the client marketplace
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading === 'upload-prod'}
                    className="w-full rounded-lg bg-emerald-800 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-900 transition disabled:opacity-50 shadow-xs"
                  >
                    {actionLoading === 'upload-prod' ? 'Publishing Product...' : 'Publish Product to Live Marketplace'}
                  </button>
                </form>
              </div>
            )}

            {/* ================= TAB 5: ORDERS & LEADS ================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <h2 className="text-base font-black text-slate-900">Buyer Inquiries & Callback Reservations</h2>
                  <p className="text-xs text-slate-500">
                    Buyers who requested concierge callbacks or shop reservations.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="p-3">Order / Lead</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Buyer & Location</th>
                        <th className="p-3">Notes</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No reservations yet.
                          </td>
                        </tr>
                      ) : (
                        orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-mono text-[11px] text-slate-500">{ord.id}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{ord.productTitle}</div>
                              <div className="text-[10px] text-slate-500">{formatPrice(ord.productPrice)}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{ord.buyerName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{ord.buyerPhone}</div>
                              <div className="text-[10px] text-slate-400">{ord.buyerLocation}</div>
                            </td>
                            <td className="p-3 text-[11px] text-slate-600 max-w-xs">{ord.notes || '—'}</td>
                            <td className="p-3 text-right">
                              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
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
          </>
        )}
      </main>

      {/* Modal: Register New Merchant */}
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
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
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
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700"
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
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMerchantModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create-merchant'}
                  className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-black text-white hover:bg-emerald-900 shadow-xs"
                >
                  {actionLoading === 'create-merchant' ? 'Registering...' : 'Register Merchant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Status Flyer Generator Modal */}
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
