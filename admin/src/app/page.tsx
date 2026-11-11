'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
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
  Sparkles,
  X,
  Menu,
  Loader2,
  Bell,
  RefreshCw,
  Building2,
  UploadCloud,
  Edit,
  EyeOff,
  Filter,
  Plus,
  ArrowRight,
  Banknote,
  Check,
} from 'lucide-react';
import { Product, Seller, OrderInquiry, Category, ProductCondition, ListingPlan } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';

export default function AdminPage() {
  const router = useRouter();

  // Navigation / View State
  const [activeNav, setActiveNav] = useState<'goods' | 'merchants' | 'income' | 'orders'>('goods');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter State
  const [globalSearch, setGlobalSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [merchantFilter, setMerchantFilter] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductForFlyer, setSelectedProductForFlyer] = useState<Product | null>(null);
  const [selectedSellerForFee, setSelectedSellerForFee] = useState<any | null>(null);

  // Product Form State
  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Solar & Power Backup');
  const [formCondition, setFormCondition] = useState<ProductCondition>('Brand New');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formProblemSolved, setFormProblemSolved] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSellerId, setFormSellerId] = useState('');
  const [formIsPinnedTop, setFormIsPinnedTop] = useState(false);

  // 50MB Uploader State
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Merchant Form State
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantBusiness, setNewMerchantBusiness] = useState('');
  const [newMerchantPhone, setNewMerchantPhone] = useState('');
  const [newMerchantWhatsapp, setNewMerchantWhatsapp] = useState('');
  const [newMerchantLocation, setNewMerchantLocation] = useState('');
  const [newMerchantPlan, setNewMerchantPlan] = useState<ListingPlan>('Featured');
  const [newMerchantDurationDays, setNewMerchantDurationDays] = useState(30);

  // Fee Collection Modal State
  const [feeAmount, setFeeAmount] = useState('25000');
  const [feeMethod, setFeeMethod] = useState<'mtn_momo' | 'airtel_money' | 'cash'>('mtn_momo');
  const [feeDurationDays, setFeeDurationDays] = useState(30);

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
        if (sellRes.sellers.length > 0 && !formSellerId) {
          setFormSellerId(sellRes.sellers[0].id);
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

  // Open Upload Modal
  const handleOpenUploadModal = () => {
    setFormId(null);
    setFormTitle('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormDescription('');
    setFormProblemSolved('');
    setFormImages([]);
    setFormIsPinnedTop(false);
    if (sellers.length > 0) setFormSellerId(sellers[0].id);
    setShowUploadModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: Product) => {
    setFormId(p.id);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormCondition(p.condition);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormDescription(p.description);
    setFormProblemSolved(p.problemSolved || '');
    setFormImages(p.images || []);
    setFormSellerId(p.sellerId);
    setFormIsPinnedTop(Boolean(p.isPinnedTop));
    setShowEditModal(true);
  };

  // Open View Modal
  const handleOpenViewModal = (p: Product) => {
    setSelectedProduct(p);
    setShowViewModal(true);
  };

  // Open Fee Collection Modal
  const handleOpenCollectFeeModal = (seller: any) => {
    setSelectedSellerForFee(seller);
    const defaultAmount = seller.packagePlan === 'VIP' ? '35000' : seller.packagePlan === 'Featured' ? '25000' : '15000';
    setFeeAmount(defaultAmount);
    setFeeDurationDays(30);
    setShowCollectFeeModal(true);
  };

  // Process File Uploads (Supports 50MB per file with Drag & Drop)
  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const maxBytes = 50 * 1024 * 1024;
    for (const f of files) {
      if (f.size > maxBytes) {
        showNotification(`File "${f.name}" exceeds the 50MB limit (${(f.size / (1024 * 1024)).toFixed(1)}MB).`, 'error');
        return;
      }
    }

    setUploadingFiles(true);
    setUploadProgressText(`Uploading ${files.length} photo(s)...`);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.urls) {
        setFormImages((prev) => [...prev, ...data.urls]);
        showNotification(`Successfully uploaded ${data.count} image(s).`);
      } else {
        showNotification(data.error || 'Failed to upload photo(s)', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Upload error', 'error');
    } finally {
      setUploadingFiles(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // File Input Change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice || !formSellerId) {
      showNotification('Please fill in Title, Price, and select a Client Shop', 'error');
      return;
    }

    const seller = sellers.find((s) => s.id === formSellerId);
    if (!seller) return;

    setActionLoading('save-product');
    try {
      const cleanedImages = formImages.filter((u) => u.trim().length > 0);
      const fallbackImages = [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      ];

      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        condition: formCondition,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        description: formDescription.trim(),
        problemSolved: formProblemSolved.trim(),
        images: cleanedImages.length > 0 ? cleanedImages : fallbackImages,
        sellerId: seller.id,
        sellerName: seller.name,
        sellerPhone: seller.phone,
        sellerWhatsapp: seller.whatsappNumber || seller.phone,
        sellerLocation: seller.location,
        sellerVerified: seller.isVerified,
        sellerBadge: seller.verificationBadge,
        listingPlan: 'Featured' as ListingPlan,
        listingFee: 25000,
        isFeatured: true,
        isPinnedTop: formIsPinnedTop,
        status: 'active',
      };

      if (formId) {
        // UPDATE
        const res = await fetch(`/api/products/${formId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Listing updated successfully!');
          setShowEditModal(false);
          loadData();
        } else {
          showNotification(data.error || 'Failed to update listing', 'error');
        }
      } else {
        // CREATE
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Product published live to the marketplace!');
          setShowUploadModal(false);
          loadData();
        } else {
          showNotification(data.error || 'Failed to upload product', 'error');
        }
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Collect Fee & Renew
  const handleConfirmCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerForFee) return;

    setActionLoading('collect-fee');
    try {
      const feeNum = parseInt(feeAmount, 10) || 0;
      const res = await fetch('/api/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'renew_subscription',
          sellerId: selectedSellerForFee.id,
          days: feeDurationDays,
          feePaid: feeNum,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(
          `Payment of UGX ${feeNum.toLocaleString()} recorded via ${feeMethod.toUpperCase().replace('_', ' ')}. Shop renewed for ${feeDurationDays} days!`
        );
        setShowCollectFeeModal(false);
        loadData();
      } else {
        showNotification(data.error || 'Fee collection failed', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Single Product Visibility
  const handleToggleProductStatus = async (p: Product) => {
    const newStatus = p.status === 'active' ? 'suspended' : 'active';
    setActionLoading(`status-${p.id}`);
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(newStatus === 'active' ? `"${p.title}" is now ONLINE.` : `"${p.title}" is now HIDDEN.`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to update status', 'error');
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
        body: JSON.stringify({ isPinnedTop: !currentPinned }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(!currentPinned ? `Pinned "${title}" to top showcase banner!` : `Unpinned "${title}".`);
        loadData();
      } else {
        showNotification(data.error || 'Failed to update pin', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Listing
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete "${title}"?`)) return;
    setActionLoading(`del-prod-${id}`);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Listing "${title}" permanently deleted.`);
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
          photographyService: true,
          isVerified: true,
          verificationBadge: 'Physical Shop Inspected & Verified',
          subscriptionExpiresAt: expDate.toISOString(),
          status: 'active',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Merchant "${data.seller.name}" registered and activated!`);
        setShowAddMerchantModal(false);
        setNewMerchantName('');
        setNewMerchantBusiness('');
        setNewMerchantPhone('');
        setNewMerchantWhatsapp('');
        setNewMerchantLocation('');
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

  // Metrics
  const activeProductsCount = products.filter((p) => p.status === 'active').length;
  const suspendedProductsCount = products.filter((p) => p.status === 'suspended').length;
  const pinnedCount = products.filter((p) => p.isPinnedTop).length;
  const expiredSellers = sellers.filter((s) => s.isExpired);
  const totalRevenue = sellers.reduce((acc, s) => acc + (s.totalListingFeesPaid || 0), 0) +
    products.reduce((acc, p) => acc + (p.listingFee || 0), 0);
  const totalLeads = products.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productFilter === 'active' && p.status !== 'active') return false;
      if (productFilter === 'suspended' && p.status !== 'suspended') return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
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
  }, [products, productFilter, categoryFilter, globalSearch]);

  return (
    <div className="min-h-screen bg-[#f1f4f9] text-slate-900 flex flex-row font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ================= LEFT EXECUTIVE OBSIDIAN SIDEBAR ================= */}
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm flex-shrink-0">
                  SM
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                    SHIDMAGIC
                  </h1>
                  <p className="text-xs text-slate-400 font-medium leading-none mt-0.5 truncate">
                    Enterprise Operations
                  </p>
                </div>
              </div>
            )}

            {isSidebarCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
                SM
              </div>
            )}

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden rounded-lg p-1.5 text-slate-400 hover:bg-[#1a2542] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block rounded-lg p-1 text-slate-400 hover:bg-[#1a2542] hover:text-white transition"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-4">
            {/* 1. GOODS CATALOG */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  GOODS & CATALOG
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveNav('goods');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'goods'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                  }`}
                >
                  <Package className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>Uploaded Goods</span>
                      <span className="bg-blue-500/20 text-blue-200 text-xs font-bold px-1.5 py-0.2 rounded">
                        {products.length}
                      </span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleOpenUploadModal();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-blue-400 hover:bg-[#15203b] hover:text-white transition pl-4"
                >
                  <PlusCircle className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  {!isSidebarCollapsed && <span>+ Upload New Goods</span>}
                </button>
              </div>
            </div>

            {/* 2. REVENUE & CLIENT SHOPS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  INCOME & SHOPS
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveNav('merchants');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'merchants'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                  }`}
                >
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>Client Shops</span>
                      {expiredSellers.length > 0 && (
                        <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-1.5 py-0.2 rounded">
                          {expiredSellers.length} Due
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
                >
                  <Plus className="h-3.5 w-3.5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Register Merchant</span>}
                </button>
              </div>
            </div>

            {/* 3. BUYER LEADS */}
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  CUSTOMER RESERVATIONS
                </p>
              )}
              <button
                onClick={() => {
                  setActiveNav('orders');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'orders'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-[#15203b] hover:text-white'
                }`}
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Inquiries</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-1.5 py-0.2 rounded">
                      {orders.length}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#1a2542] bg-[#070d1a]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              SK
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Samuel Kato</p>
                <p className="text-xs text-slate-400 truncate">Administrator</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 flex-shrink-0"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Prominent Upload Goods Action */}
            <button
              onClick={handleOpenUploadModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs flex-shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload Goods</span>
            </button>

            {/* Global Search */}
            <div className="relative flex-1 max-w-md min-w-0">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="admin-global-search"
                type="text"
                placeholder="Search goods by title, merchant, category..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-14 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-2xs"
              />
              <span className="hidden sm:inline-block absolute right-2.5 top-2.5 rounded bg-slate-200/80 px-1.5 py-0.5 text-xs font-mono text-slate-600 pointer-events-none">
                Ctrl K
              </span>
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://shidmagic.conquerer.org"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Public Store</span>
            </a>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                SK
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">Samuel Kato</p>
                <p className="text-xs text-slate-500 leading-tight">Administrator</p>
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

        {/* Main Canvas */}
        <main className="p-5 sm:p-7 space-y-5 flex-1">
          {/* ================= REVENUE & INCOME FIRST BANNER ================= */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    INCOME & LISTING REVENUE:
                  </span>
                  <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    CONCIERGE FLATS (OCTOBER 2026)
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Direct revenue collected from Kampala physical shops for 30-day listing plans & verification.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>+ Register Client Shop</span>
                </button>
                <div className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs">
                  TOTAL REVENUE: {formatPrice(totalRevenue)}
                </div>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  TOTAL REVENUE
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">Listing fees + VIP plans</p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  CLIENT SHOPS
                </p>
                <p className="text-xl font-bold text-blue-700 mt-0.5">{sellers.length} Shops</p>
                <p className="text-xs text-slate-500 mt-1">Vetted Pioneer Mall, Nakasero</p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  SUBSCRIPTION QUEUE
                </p>
                <p className={`text-xl font-bold mt-0.5 ${expiredSellers.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {expiredSellers.length} Due
                </p>
                <p className="text-xs text-slate-500 mt-1">Awaiting 30-day renewal</p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  WHATSAPP LEADS
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{totalLeads} Contacts</p>
                <p className="text-xs text-slate-500 mt-1">Direct buyer inquiries</p>
              </div>
            </div>
          </div>

          {/* ================= TAB 1: GOODS CATALOG TABLE WITH VIEW, EDIT, DELETE ================= */}
          {activeNav === 'goods' && (
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    <span>Filter:</span>
                  </span>

                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                    {(['all', 'active', 'suspended'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setProductFilter(st)}
                        className={`rounded-md px-3 py-1 font-semibold capitalize transition ${
                          productFilter === st
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st === 'all' ? 'All Goods' : st === 'active' ? 'Online' : 'Hidden'}
                      </button>
                    ))}
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
                  >
                    <option value="All">All Categories</option>
                    <option value="Solar & Power Backup">Solar & Power Backup</option>
                    <option value="Water & Home Tech">Water & Home Tech</option>
                    <option value="Phones & Computers">Phones & Computers</option>
                    <option value="Agri & Food Processing">Agri & Food Processing</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Vehicles & Auto">Vehicles & Auto</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
                  </span>
                  <button
                    onClick={handleOpenUploadModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload New Goods</span>
                  </button>
                </div>
              </div>

              {/* Goods Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[850px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <th className="p-3.5">Photo & Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Merchant Shop</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Leads / Views</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                          No items found. Click &quot;Upload New Goods&quot; to publish your first product.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isOnline = p.status === 'active';
                        const firstImage = p.images && p.images.length > 0 ? p.images[0] : null;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition">
                            {/* Photo & Title */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {firstImage ? (
                                    <img src={firstImage} alt={p.title} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="h-5 w-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-bold text-slate-900 text-xs line-clamp-1 leading-snug">
                                    {p.title}
                                  </p>
                                  {p.problemSolved && (
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                      {p.problemSolved}
                                    </p>
                                  )}
                                  {p.isPinnedTop && (
                                    <span className="inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 text-xs font-bold mt-1">
                                      <Sparkles className="h-3 w-3" />
                                      Pinned Top
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-800">{p.category}</p>
                              <span className="text-xs text-slate-500">{p.condition}</span>
                            </td>

                            {/* Merchant */}
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-800">{p.sellerName}</p>
                              <p className="text-xs text-slate-400">{p.sellerLocation}</p>
                            </td>

                            {/* Price */}
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900">{formatPrice(p.price)}</p>
                              {p.originalPrice && (
                                <p className="text-xs text-slate-400 line-through">
                                  {formatPrice(p.originalPrice)}
                                </p>
                              )}
                            </td>

                            {/* Leads */}
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-800">{p.viewsCount} views</p>
                              <p className="text-xs font-semibold text-emerald-700">
                                {p.whatsappClicks} WhatsApp leads
                              </p>
                            </td>

                            {/* Status */}
                            <td className="p-3.5">
                              <span
                                className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                                  isOnline
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isOnline ? 'ONLINE' : 'HIDDEN'}
                              </span>
                            </td>

                            {/* Actions: View, Edit, Delete */}
                            <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                              <button
                                onClick={() => handleOpenViewModal(p)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1"
                                title="Inspect listing details"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-500" />
                                <span>View</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition shadow-2xs inline-flex items-center gap-1"
                                title="Edit photos, price, specs"
                              >
                                <Edit className="h-3.5 w-3.5 text-blue-600" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                disabled={actionLoading === `del-prod-${p.id}`}
                                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition shadow-2xs inline-flex items-center gap-1"
                                title="Permanently delete item"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CLIENT MERCHANTS & INCOME ACTIONS ================= */}
          {activeNav === 'merchants' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Client Merchants & Subscriptions</h2>
                  <p className="text-xs text-slate-500">Collect monthly listing fees and manage shop status.</p>
                </div>
                <button
                  onClick={() => setShowAddMerchantModal(true)}
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-2xs"
                >
                  + Register Client Shop
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[750px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <th className="p-3.5">Merchant / Shop</th>
                      <th className="p-3.5">Phone & WhatsApp</th>
                      <th className="p-3.5">Plan & Expiry</th>
                      <th className="p-3.5">Total Paid</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sellers.map((s) => {
                      const isSuspended = s.status === 'suspended';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.location}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-mono text-slate-800">{s.phone}</p>
                            <a
                              href={`https://wa.me/${(s.whatsappNumber || s.phone).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-700 font-semibold hover:underline"
                            >
                              WA: {s.whatsappNumber || s.phone}
                            </a>
                          </td>
                          <td className="p-3.5">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                              {s.packagePlan}
                            </span>
                            <div className="text-xs mt-1">
                              {s.isExpired ? (
                                <span className="font-bold text-red-600">EXPIRED</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">
                                  {s.daysRemaining} days left
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">
                            {formatPrice(s.totalListingFeesPaid || 0)}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                                isSuspended ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isSuspended ? 'SUSPENDED' : 'ONLINE'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                            {/* Collect Fee / Renew Modal Button */}
                            <button
                              onClick={() => handleOpenCollectFeeModal(s)}
                              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-2xs inline-flex items-center gap-1"
                            >
                              <Banknote className="h-3.5 w-3.5" />
                              <span>Collect Fee</span>
                            </button>

                            <button
                              onClick={() => {
                                const shouldSuspend = s.status === 'active';
                                if (window.confirm(`${shouldSuspend ? 'Suspend' : 'Reactivate'} "${s.name}"?`)) {
                                  fetch('/api/sellers', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      action: 'toggle_suspension',
                                      sellerId: s.id,
                                      suspend: shouldSuspend,
                                    }),
                                  }).then(() => loadData());
                                }
                              }}
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                                isSuspended
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                  : 'border-red-200 bg-red-50 text-red-800'
                              }`}
                            >
                              {isSuspended ? 'Activate' : 'Suspend'}
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

          {/* ================= TAB 3: CUSTOMER ORDERS ================= */}
          {activeNav === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Customer Reservations & Inquiries ({orders.length})</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <th className="p-3.5">Buyer Name</th>
                      <th className="p-3.5">Phone Contact</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Requested Product</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                          No buyer reservations recorded.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5 font-bold text-slate-900">{o.buyerName}</td>
                          <td className="p-3.5 font-mono text-slate-800">{o.buyerPhone}</td>
                          <td className="p-3.5 text-slate-600">{o.buyerLocation}</td>
                          <td className="p-3.5 font-semibold text-slate-800">{o.productTitle}</td>
                          <td className="p-3.5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
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

      {/* ================= MODAL 1: UPLOAD / EDIT GOODS (50MB DRAG & DROP PHOTO UPLOADER) ================= */}
      {(showUploadModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {showEditModal ? 'Edit Goods Listing' : 'Upload New Goods for Client'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct photo upload from phone or computer up to 50MB per photo.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setShowEditModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Merchant & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Merchant Shop *
                  </label>
                  <select
                    required
                    value={formSellerId}
                    onChange={(e) => setFormSellerId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                    placeholder="e.g. 1000W Solar Hybrid Inverter + Battery"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, Category, Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (UGX) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1850000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                    Condition *
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as ProductCondition)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  Everyday Challenge It Solves (Key Buyer Value)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stops Umeme blackouts. Powers Wi-Fi, TV, and lights for 14 hours."
                  value={formProblemSolved}
                  onChange={(e) => setFormProblemSolved(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Specifications & Warranty
                </label>
                <textarea
                  rows={3}
                  placeholder="Full technical details, shop warranty terms, and pickup address..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* ================= 50MB DRAG & DROP PHOTO UPLOADER BOX ================= */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Product Photos (Direct Device Upload, Up to 50MB)
                  </label>
                  {formImages.length > 0 && (
                    <span className="text-xs font-bold text-blue-700">
                      {formImages.length} photo(s) attached
                    </span>
                  )}
                </div>

                {/* Dropzone with Drag & Drop */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                    isDraggingOver
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-300 bg-slate-50/80 hover:border-blue-500 hover:bg-blue-50/20'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                      {uploadingFiles ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {uploadingFiles ? uploadProgressText : 'Click to select photos or drag and drop here'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct phone gallery / computer file upload (max <strong className="text-slate-800">50MB</strong> per image)
                    </p>
                  </div>
                </div>

                {/* Preview Grid */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 h-16 bg-slate-100">
                        <img src={img} alt="preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pin to Spotlight Banner */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formIsPinnedTop}
                    onChange={(e) => setFormIsPinnedTop(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Pin to Spotlight Banner (Hero Showcase at Top of Public Marketplace)</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setShowEditModal(false);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'save-product' || uploadingFiles}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs disabled:opacity-50"
                >
                  {actionLoading === 'save-product'
                    ? 'Saving...'
                    : showEditModal
                    ? 'Save Changes'
                    : 'Publish Goods Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: VIEW PRODUCT DETAILS ================= */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedProduct.title}</h3>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photos Gallery */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <div key={idx} className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing & Merchant Card */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Selling Price</p>
                  <p className="text-xl font-bold text-slate-900">{formatPrice(selectedProduct.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Client Merchant</p>
                  <p className="text-xs font-bold text-slate-900">{selectedProduct.sellerName}</p>
                  <p className="text-xs text-slate-400">{selectedProduct.sellerLocation}</p>
                </div>
              </div>

              {/* Problem Solved */}
              {selectedProduct.problemSolved && (
                <div>
                  <p className="text-xs font-bold text-slate-800">Problem Solved</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/70">
                    {selectedProduct.problemSolved}
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-slate-800">Full Description</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-700">{selectedProduct.viewsCount} Real Views</span>
                <span className="font-semibold text-emerald-700">{selectedProduct.whatsappClicks} WhatsApp Leads</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${selectedProduct.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {selectedProduct.status.toUpperCase()}
                </span>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    handleToggleProductStatus(selectedProduct);
                    setShowViewModal(false);
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold border ${
                    selectedProduct.status === 'active'
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {selectedProduct.status === 'active' ? 'Hide from Public' : 'Make Online'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleOpenEditModal(selectedProduct);
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: COLLECT LISTING FEE & RENEW (INCOME ENGINE) ================= */}
      {showCollectFeeModal && selectedSellerForFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Fee & Renew Shop</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Collecting listing revenue for <strong className="text-slate-800">{selectedSellerForFee.name}</strong>
                </p>
              </div>
              <button onClick={() => setShowCollectFeeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCollectFee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount Received (UGX) *
                </label>
                <input
                  type="number"
                  required
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeeMethod('mtn_momo')}
                    className={`rounded-lg p-2 text-xs font-semibold border text-center ${
                      feeMethod === 'mtn_momo'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeMethod('airtel_money')}
                    className={`rounded-lg p-2 text-xs font-semibold border text-center ${
                      feeMethod === 'airtel_money'
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Airtel Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeMethod('cash')}
                    className={`rounded-lg p-2 text-xs font-semibold border text-center ${
                      feeMethod === 'cash'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Cash
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Renewal Period
                </label>
                <select
                  value={feeDurationDays}
                  onChange={(e) => setFeeDurationDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={60}>60 Days (2 Months)</option>
                  <option value={90}>90 Days (3 Months)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectFeeModal(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'collect-fee'}
                  className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>{actionLoading === 'collect-fee' ? 'Processing...' : 'Confirm Payment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: REGISTER CLIENT MERCHANT ================= */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Register New Client Merchant</h3>
              <button onClick={() => setShowAddMerchantModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
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
