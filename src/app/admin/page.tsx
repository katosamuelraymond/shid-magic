'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Users,
  DollarSign,
  MessageCircle,
  Eye,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  Phone,
  MapPin,
  TrendingUp,
  Search,
  Check,
  Send,
  Loader2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Seller, OrderInquiry, Category, ProductCondition, ListingPlan } from '@/lib/types';
import { formatPrice, buildSellerReportWhatsAppLink } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'upload' | 'sellers' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForFlyer, setSelectedProductForFlyer] = useState<Product | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Solar & Power Backup');
  const [condition, setCondition] = useState<ProductCondition>('Brand New');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  // If creating new seller
  const [isNewSeller, setIsNewSeller] = useState(false);
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');
  const [newSellerLocation, setNewSellerLocation] = useState('');
  // Listing Fee
  const [listingPlan, setListingPlan] = useState<ListingPlan>('Featured');
  const [listingFee, setListingFee] = useState('25');
  const [isFeatured, setIsFeatured] = useState(true);

  // Form submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, sellRes, ordRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/sellers').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (sellRes.success) {
        setSellers(sellRes.sellers);
        if (sellRes.sellers.length > 0 && !selectedSellerId) {
          setSelectedSellerId(sellRes.sellers[0].id);
        }
      }
      if (ordRes.success) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlanChange = (plan: ListingPlan) => {
    setListingPlan(plan);
    if (plan === 'Basic') {
      setListingFee('15');
      setIsFeatured(false);
    } else if (plan === 'Featured') {
      setListingFee('25');
      setIsFeatured(true);
    } else if (plan === 'VIP') {
      setListingFee('35');
      setIsFeatured(true);
    }
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length === 1) {
      setImageUrls(['']);
      return;
    }
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleLoadSamplePhotos = (type: 'phone' | 'laptop' | 'watch' | 'shoes') => {
    if (type === 'phone') {
      setImageUrls([
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      ]);
    } else if (type === 'laptop') {
      setImageUrls([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      ]);
    } else if (type === 'shoes') {
      setImageUrls([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      ]);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      let finalSellerId = selectedSellerId;
      let finalSellerName = '';
      let finalSellerPhone = '';
      let finalSellerLocation = '';

      if (isNewSeller) {
        if (!newSellerName || !newSellerPhone) {
          throw new Error('Please enter new seller name and phone number.');
        }
        const sellerRes = await fetch('/api/sellers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newSellerName,
            phone: newSellerPhone,
            location: newSellerLocation || 'Nairobi CBD',
            isVerified: true,
          }),
        }).then((r) => r.json());

        if (!sellerRes.success) {
          throw new Error(sellerRes.error || 'Failed to create seller');
        }

        finalSellerId = sellerRes.seller.id;
        finalSellerName = sellerRes.seller.name;
        finalSellerPhone = sellerRes.seller.phone;
        finalSellerLocation = sellerRes.seller.location;
      } else {
        const found = sellers.find((s) => s.id === selectedSellerId);
        if (found) {
          finalSellerName = found.name;
          finalSellerPhone = found.phone;
          finalSellerLocation = found.location;
        }
      }

      // Clean images
      const filteredImages = imageUrls.filter((img) => img.trim() !== '');
      if (filteredImages.length === 0) {
        filteredImages.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80');
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          condition,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          description,
          images: filteredImages,
          sellerId: finalSellerId,
          sellerName: finalSellerName,
          sellerPhone: finalSellerPhone,
          sellerWhatsapp: finalSellerPhone.replace(/[^0-9]/g, ''),
          sellerLocation: finalSellerLocation,
          sellerVerified: true,
          listingPlan,
          listingFee: Number(listingFee),
          isFeatured,
          problemSolved: problemSolved || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload product');
      }

      setSubmitSuccess(true);
      // Reset form
      setTitle('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setImageUrls(['']);
      setIsNewSeller(false);
      setNewSellerName('');
      setNewSellerPhone('');
      setNewSellerLocation('');
      loadData();
      setActiveTab('products');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSold = async (product: Product) => {
    const newStatus = product.status === 'sold' ? 'active' : 'sold';
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setProducts(
        products.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderInquiry['status']) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalRevenue = products.reduce((acc, p) => acc + (p.listingFee || 0), 0);
  const totalLeads = products.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Admin Top Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm">
              SM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900">Admin Control Center</h1>
                <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                  PLATFORM OPERATOR
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Concierge Marketplace & Listing Fee Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Live Marketplace</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Listing Revenue */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">Listing Fees Collected</span>
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {formatPrice(totalRevenue)}
            </p>
            <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">
              From {products.length} paid merchant listings
            </p>
          </div>

          {/* Total Leads Delivered */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">WhatsApp / Call Leads</span>
              <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {totalLeads} Leads
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Direct seller inquiries generated
            </p>
          </div>

          {/* Active Products */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">Active Listings</span>
              <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {products.filter((p) => p.status === 'active').length}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {products.filter((p) => p.status === 'sold').length} marked as sold
            </p>
          </div>

          {/* Verified Merchants */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">Verified Merchants</span>
              <div className="rounded-lg bg-purple-50 p-1.5 text-purple-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {sellers.length}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {orders.length} customer callback orders
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-4 sm:space-x-6 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload Goods for Seller</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sellers'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Sellers CRM & Reports ({sellers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Buyer Inquiries ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT LIST */}
        {activeTab === 'products' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">Catalog Inventory</h3>
                <p className="text-[11px] text-slate-500">Manage products, toggle sold status, or generate status flyers.</p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Price / Fee</th>
                    <th className="p-3">Seller</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Leads</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/product/${product.id}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-emerald-600 line-clamp-1 flex items-center gap-1"
                            >
                              <span>{product.title}</span>
                              <ExternalLink className="h-3 w-3 inline text-slate-400" />
                            </Link>
                            <span className="text-[10px] text-slate-400">
                              {product.category} • {product.images?.length || 1} {product.images?.length === 1 ? 'photo' : 'photos'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          Fee: ${product.listingFee}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-900">
                          {product.sellerName}
                        </div>
                        <div className="text-slate-500 font-mono text-[10px]">
                          {product.sellerPhone}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`inline-block rounded-md px-1.5 py-0.5 font-bold text-[9px] ${
                          product.listingPlan === 'VIP'
                            ? 'bg-purple-100 text-purple-700'
                            : product.listingPlan === 'Featured'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {product.listingPlan}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="h-3 w-3 text-slate-400" />
                            {product.viewsCount}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold" title="WhatsApp Leads">
                            <MessageCircle className="h-3 w-3" />
                            {product.whatsappClicks + product.callClicks}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleToggleSold(product)}
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition ${
                            product.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {product.status === 'active' ? 'Active' : 'Sold'}
                        </button>
                      </td>

                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedProductForFlyer(product)}
                          title="Generate Status Flyer"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Listing"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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

        {/* TAB 2: UPLOAD FORM FOR ADMIN (WITH MULTI-IMAGE PREVIEWS) */}
        {activeTab === 'upload' && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                White-Glove Concierge Upload
              </span>
              <h2 className="mt-1 text-base sm:text-lg font-bold text-slate-900">
                Upload Goods for Merchant & Record Listing Fee
              </h2>
              <p className="text-xs text-slate-500">
                You are publishing this listing on behalf of a merchant. Attach multiple photos and their direct phone number.
              </p>
            </div>

            {submitSuccess && (
              <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Product uploaded successfully and published to the live marketplace!</span>
              </div>
            )}

            {submitError && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-5">
              {/* Product Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                  1. Product Details
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple iPad Pro 12.9 M2 128GB Wi-Fi Space Gray"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department / Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
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
                      Item Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as ProductCondition)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Gently Used">Gently Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Selling Price (UGX) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1850000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Original Price (UGX) (Optional - for discount badge)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2200000"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Everyday Problem Solved in Uganda (Optional - highlighted badge)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stops Umeme power blackouts; runs Wi-Fi & TV for 14 hours"
                    value={problemSolved}
                    onChange={(e) => setProblemSolved(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Polished Sales Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter specs, inclusions (e.g. original charger, box), warranty, condition details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Image Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      2. Product Images ({imageUrls.filter(Boolean).length} added)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Quick sample fillers */}
                    <div className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePhotos('phone')}
                        className="text-emerald-600 hover:underline"
                      >
                        Phone
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePhotos('laptop')}
                        className="text-emerald-600 hover:underline"
                      >
                        Laptop
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePhotos('shoes')}
                        className="text-emerald-600 hover:underline"
                      >
                        Shoes
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      + Add Photo URL
                    </button>
                  </div>
                </div>

                {/* Image input fields */}
                <div className="space-y-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 w-5 text-right">
                        #{idx + 1}
                      </span>
                      <input
                        type="url"
                        placeholder={idx === 0 ? 'Cover Photo URL (Primary)' : `Additional Photo ${idx + 1} URL`}
                        value={url}
                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                        className="flex-1 rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(idx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Instant Live Image Preview Strip */}
                {imageUrls.some((u) => u.trim() !== '') && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Live Photo Previews
                    </p>
                    <div className="flex gap-2 overflow-x-auto">
                      {imageUrls
                        .filter((u) => u.trim() !== '')
                        .map((url, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                            <img
                              src={url}
                              alt="preview"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            {idx === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-[8px] font-bold text-white text-center py-0.2">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Assignment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. Merchant & Phone Contact
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsNewSeller(!isNewSeller)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    {isNewSeller ? 'Select Existing Merchant' : '+ Register New Merchant'}
                  </button>
                </div>

                {!isNewSeller ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Merchant
                    </label>
                    <select
                      value={selectedSellerId}
                      onChange={(e) => setSelectedSellerId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.phone}) - {s.location}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Merchant Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TechZone Nairobi"
                        value={newSellerName}
                        onChange={(e) => setNewSellerName(e.target.value)}
                        className="w-full rounded-md border border-slate-300 p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254712345678"
                        value={newSellerPhone}
                        onChange={(e) => setNewSellerPhone(e.target.value)}
                        className="w-full rounded-md border border-slate-300 p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Shop Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CBD Plaza 3rd Floor"
                        value={newSellerLocation}
                        onChange={(e) => setNewSellerLocation(e.target.value)}
                        className="w-full rounded-md border border-slate-300 p-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Listing Fee Tier */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                  4. Listing Plan & Fee
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => handlePlanChange('Basic')}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      listingPlan === 'Basic'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Basic</span>
                      <span className="font-black text-emerald-600 text-xs">$15</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">30 Days listing.</p>
                  </div>

                  <div
                    onClick={() => handlePlanChange('Featured')}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      listingPlan === 'Featured'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Featured</span>
                      <span className="font-black text-emerald-600 text-xs">$25</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Hot Deals banner.</p>
                  </div>

                  <div
                    onClick={() => handlePlanChange('VIP')}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      listingPlan === 'VIP'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">VIP</span>
                      <span className="font-black text-emerald-600 text-xs">$35</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Status flyer & reports.</p>
                  </div>
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Listing Fee Charged ($)
                  </label>
                  <input
                    type="number"
                    value={listingFee}
                    onChange={(e) => setListingFee(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Listing to Marketplace</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SELLERS CRM & WHATSAPP REPORTS */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">
                Merchant Retention & WhatsApp Performance Reports
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mt-0.5">
                Click <strong>"Send WhatsApp Report"</strong> to deliver instant proof of customer views and WhatsApp inquiries directly to each merchant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellers.map((seller) => {
                const sellerProducts = products.filter((p) => p.sellerId === seller.id);
                const totalViews = sellerProducts.reduce((acc, p) => acc + p.viewsCount, 0);
                const totalLeads = sellerProducts.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);
                const totalPaid = sellerProducts.reduce((acc, p) => acc + (p.listingFee || 0), 0);

                const waReportLink = buildSellerReportWhatsAppLink({
                  name: seller.name,
                  phone: seller.phone,
                  listingsCount: sellerProducts.length,
                  views: totalViews,
                  whatsappLeads: totalLeads,
                });

                return (
                  <div
                    key={seller.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{seller.name}</h4>
                          <p className="text-[11px] font-mono text-emerald-600">{seller.phone}</p>
                        </div>
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                          {seller.verificationBadge || 'Verified'}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{seller.location}</span>
                      </div>

                      {/* Performance metrics for this seller */}
                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400">Listings</p>
                          <p className="text-xs font-bold text-slate-900">
                            {sellerProducts.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400">Views</p>
                          <p className="text-xs font-bold text-slate-900">
                            {totalViews}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400">Leads</p>
                          <p className="text-xs font-bold text-emerald-600">
                            {totalLeads}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 text-[11px] text-slate-500">
                        Total fees paid: <strong className="text-slate-900">${totalPaid}</strong>
                      </div>
                    </div>

                    {/* WhatsApp Report CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={waReportLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 px-2.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                      >
                        <Send className="h-3 w-3" />
                        <span>Send WhatsApp Report</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & CALLBACKS */}
        {activeTab === 'orders' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-200">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Buyer Inquiries</h3>
              <p className="text-[11px] text-slate-500">Reservation requests submitted on the website.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No customer orders received yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ord.buyerName}</span>
                        <a
                          href={`tel:${ord.buyerPhone}`}
                          className="font-mono text-xs text-emerald-600 font-bold hover:underline"
                        >
                          {ord.buyerPhone}
                        </a>
                      </div>
                      <p className="text-xs text-slate-600">
                        Item: <strong>{ord.productTitle}</strong> (${ord.productPrice})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Address: {ord.buyerLocation || 'Not specified'} {ord.notes ? `• "${ord.notes}"` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="rounded-md border border-slate-300 p-1 text-[11px] font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <a
                        href={`https://wa.me/${ord.buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ord.buyerName}, this is ShidMagic regarding your order for ${ord.productTitle}. Are you available for delivery?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

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
