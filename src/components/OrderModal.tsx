'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, MapPin, User, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      setError('Please provide your name and phone number.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          buyerName,
          buyerPhone,
          buyerLocation,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit order.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Order Request Received!</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
              The merchant <strong className="text-neutral-900 dark:text-white">{product.sellerName}</strong> has been notified with your request for <strong className="text-neutral-900 dark:text-white">{product.title}</strong>. They will call you shortly to confirm delivery.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Direct Order / Callback Reservation</span>
            </div>

            <h3 className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
              Reserve or Order This Item
            </h3>

            {/* Product summary card */}
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-neutral-50 p-3 border border-neutral-100 dark:bg-neutral-800/50 dark:border-neutral-700">
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-neutral-900 truncate dark:text-white">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    by {product.sellerName}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Ochieng"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number (Calls / WhatsApp) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 712 345 678"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Delivery Address / Landmark (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Westlands, Mpaka Rd, Gate 4"
                    value={buyerLocation}
                    onChange={(e) => setBuyerLocation(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes or Questions for Seller (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Can you deliver today? Can I pay on delivery?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Submit Order / Reserve Item</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400">
                Safe shopping: No upfront payment required on this form. Inspect item before final payment.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
