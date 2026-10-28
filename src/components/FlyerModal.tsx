'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Share2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface FlyerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function FlyerModal({ product, isOpen, onClose }: FlyerModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const promoText = `🔥 *AVAILABLE ON SHIDMAGIC* 🔥
📦 *${product.title}*
💰 *Price: ${formatPrice(product.price)}* ${product.originalPrice ? `(~${formatPrice(product.originalPrice)}~)` : ''}
✅ Condition: ${product.condition}
📍 Location: ${product.sellerLocation}
🛡️ *Verified Seller: ${product.sellerName}*

📞 Contact / WhatsApp: ${product.sellerPhone}
🔗 View full photos & details: https://shidmagic.com/product/${product.id}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(promoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFlyer = async () => {
    try {
      setDownloading(true);
      // Create a 1080x1080 canvas representation
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
      bgGrad.addColorStop(0, '#0a0a0a');
      bgGrad.addColorStop(1, '#171717');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Accent header
      ctx.fillStyle = '#059669';
      ctx.fillRect(0, 0, 1080, 24);

      // Header branding
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('SHIDMAGIC VERIFIED SHOWCASE', 60, 90);

      // Verified pill
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.roundRect(830, 52, 190, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('✓ VERIFIED', 870, 83);

      // Product Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = product.images[0];

      await new Promise((resolve) => {
        img.onload = () => {
          // Draw image centered in upper area
          const imgSize = 640;
          const x = (1080 - imgSize) / 2;
          const y = 130;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, imgSize, imgSize, 32);
          ctx.clip();
          ctx.drawImage(img, x, y, imgSize, imgSize);
          ctx.restore();
          resolve(true);
        };
        img.onerror = () => resolve(false);
      });

      // Price Tag Banner
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(60, 790, 320, 75, 20);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(formatPrice(product.price), 85, 845);

      if (product.originalPrice) {
        ctx.fillStyle = '#a3a3a3';
        ctx.font = '28px sans-serif';
        ctx.fillText(`Was ${formatPrice(product.originalPrice)}`, 400, 840);
      }

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      const truncatedTitle = product.title.length > 44 ? product.title.slice(0, 42) + '...' : product.title;
      ctx.fillText(truncatedTitle, 60, 915);

      // Seller and WhatsApp bar
      ctx.fillStyle = '#262626';
      ctx.beginPath();
      ctx.roundRect(60, 950, 960, 80, 20);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(`WhatsApp / Call: ${product.sellerPhone}`, 90, 1000);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '22px sans-serif';
      ctx.fillText(`Seller: ${product.sellerName}`, 700, 1000);

      // Download trigger
      const link = document.createElement('a');
      link.download = `flyer-${product.slug || product.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate flyer', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-4 w-4" />
          <span>Seller Marketing Booster</span>
        </div>

        <h3 className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
          WhatsApp Status & Instagram Story Flyer
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Give this to the seller or share it on your own social channels to boost visibility and prove listing value.
        </p>

        {/* Visual Flyer Card Preview */}
        <div
          ref={cardRef}
          className="mt-4 relative overflow-hidden rounded-2xl bg-neutral-950 p-5 text-white shadow-xl border border-neutral-800 aspect-square max-w-md mx-auto flex flex-col justify-between"
        >
          {/* Top banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider text-emerald-400">SHIDMAGIC</span>
              <span className="text-[10px] text-neutral-400">| VERIFIED</span>
            </div>
            <span className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] font-bold text-white">
              {product.condition}
            </span>
          </div>

          {/* Center Product Image */}
          <div className="relative my-auto flex items-center justify-center overflow-hidden rounded-xl bg-neutral-900 p-2 max-h-[220px]">
            <img
              src={product.images[0]}
              alt={product.title}
              className="max-h-[200px] w-full object-contain rounded-lg"
            />
            {/* Price badge overlaid */}
            <div className="absolute bottom-3 left-3 rounded-lg bg-emerald-600 px-3 py-1 font-black text-base shadow-lg text-white">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="space-y-1.5 pt-2">
            <h4 className="text-sm font-bold line-clamp-1 text-white">
              {product.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-900/80 rounded-lg p-2 border border-neutral-800">
              <div>
                <p className="text-[10px] text-neutral-400">Verified Seller</p>
                <p className="font-semibold text-emerald-400">{product.sellerName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-400">Order via WhatsApp</p>
                <p className="font-mono font-bold text-white">{product.sellerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadFlyer}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Generating Image...' : 'Download Image (PNG)'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-2.5 px-4 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied WhatsApp Text!' : 'Copy WhatsApp Caption'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
