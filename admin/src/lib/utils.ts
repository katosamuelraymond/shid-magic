import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'UGX'): string {
  if (currency === 'UGX') {
    return `UGX ${price.toLocaleString('en-US')}`;
  }
  return `${currency} ${price.toLocaleString('en-US')}`;
}

export function buildWhatsAppLink(options: {
  phone: string;
  productTitle: string;
  price: number;
  productId: string;
  sellerName?: string;
  pageUrl?: string;
}): string {
  const cleanPhone = options.phone.replace(/[^0-9]/g, '');
  const url = options.pageUrl || (typeof window !== 'undefined' ? window.location.href : `https://shidmagic.com/product/${options.productId}`);
  
  const greeting = options.sellerName ? `Hello ${options.sellerName}` : 'Hello';
  const message = `${greeting}! I found your listing on ShidMagic for *${options.productTitle}* (Price: ${formatPrice(options.price)}).
Is this still available in stock? Can I inspect and pay via MTN MoMo / Airtel Money or Cash on delivery?
Link: ${url}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildSellerReportWhatsAppLink(seller: {
  name: string;
  phone: string;
  listingsCount: number;
  views: number;
  whatsappLeads: number;
}): string {
  const cleanPhone = seller.phone.replace(/[^0-9]/g, '');
  const message = `*ShidMagic Uganda Merchant Performance Report*

Hello ${seller.name}, here is the performance update for your active listings on ShidMagic:

• Active Listings: ${seller.listingsCount}
• Real Buyer Page Views: ${seller.views.toLocaleString()}
• Direct WhatsApp Buyer Leads: ${seller.whatsappLeads}

Buyers in Kampala and across Uganda are viewing your stock. Reply here to feature more goods or manage your shop subscription.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
