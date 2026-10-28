'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Droplets,
  Radio,
  ShoppingBag,
  Sparkles,
  Phone,
  CheckCircle2,
  Truck,
  CreditCard,
  Flame,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface JumiaHeroBannerProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ITEMS: { name: Category; icon: string }[] = [
  { name: 'Solar & Power Backup', icon: '⚡' },
  { name: 'Water & Home Tech', icon: '💧' },
  { name: 'Phones & Computers', icon: '📱' },
  { name: 'Agri & Food Processing', icon: '🌾' },
  { name: 'Fashion & Beauty', icon: '✨' },
  { name: 'Vehicles & Auto', icon: '🚗' },
];

export default function JumiaHeroBanner({
  products,
  selectedCategory,
  onSelectCategory,
}: JumiaHeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Top featured problem solver slides
  const featuredSlides = [
    {
      id: 'ug-prod-1',
      tag: 'UMEME BLACKOUT SOLUTION',
      title: 'Solar Hybrid Generator & Inverter 1000W',
      subtitle: 'Keep your Wi-Fi, 43" Smart TV, laptops, and home lighting powered for 14 hours during power cuts.',
      price: 1850000,
      originalPrice: 2200000,
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      bgGradient: 'from-amber-900 via-emerald-950 to-slate-950',
      accentColor: 'text-amber-400',
      buttonBg: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
      badge: 'Solves Load-Shedding',
    },
    {
      id: 'ug-prod-2',
      tag: 'SHOWER & WATER PRESSURE UPGRADE',
      title: 'Automatic Silent Home Booster Pump 0.5HP',
      subtitle: 'Weak gravity tank water pressure? Turns on automatically when any tap or shower is opened.',
      price: 380000,
      originalPrice: 450000,
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80',
      bgGradient: 'from-cyan-950 via-blue-950 to-slate-950',
      accentColor: 'text-cyan-400',
      buttonBg: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950',
      badge: 'Hotel-Grade Showers',
    },
    {
      id: 'ug-prod-3',
      tag: 'FAST RURAL & KAMPALA INTERNET',
      title: 'Starlink Gen 3 Satellite Internet Kit',
      subtitle: '200+ Mbps unlimited broadband anywhere in Uganda. Farms, lodges, and upcountry homes.',
      price: 2650000,
      originalPrice: 2950000,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
      bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
      accentColor: 'text-purple-400',
      buttonBg: 'bg-purple-500 hover:bg-purple-600 text-white',
      badge: 'Unlimited Broadband',
    },
    {
      id: 'ug-prod-4',
      tag: 'ZERO CHICK MORTALITY LOSSES',
      title: 'Solar 528 Egg Automatic Poultry Incubator',
      subtitle: 'Dual 12V solar battery and 240V AC operation. Guaranteed 98% hatch rate without blackout fears.',
      price: 2400000,
      originalPrice: 2800000,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      accentColor: 'text-emerald-400',
      buttonBg: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
      badge: 'Agri-Tech Essential',
    },
  ];

  // Auto-slide every 5 seconds (Jumia style)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const active = featuredSlides[currentSlide];

  return (
    <div className="bg-slate-100 py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* 1. Left Column: Jumia-style Category Drawer (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-slate-100">
                <Flame className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Top Departments
                </h3>
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => onSelectCategory('All')}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                      selectedCategory === 'All'
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌐 All Verified Goods</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>
                </li>
                {CATEGORY_ITEMS.map((cat) => {
                  const count = products.filter((p) => p.category === cat.name).length;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <li key={cat.name}>
                      <button
                        onClick={() => onSelectCategory(cat.name)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick sell callout */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Link
                href="/sell"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 p-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>List With Us (From UGX 15k)</span>
              </Link>
            </div>
          </div>

          {/* 2. Center Column: The Jumia-Style Moving Hero Carousel */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-xl border border-slate-200/80 shadow-md">
            <div
              className={`relative h-[280px] sm:h-[340px] w-full bg-gradient-to-br ${active.bgGradient} text-white p-5 sm:p-7 flex items-center justify-between transition-all duration-700`}
            >
              {/* Background ambient pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Slide Content (Left Side) */}
              <div className="relative z-10 max-w-[62%] sm:max-w-[58%] space-y-2.5">
                <span className={`inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${active.accentColor}`}>
                  {active.tag}
                </span>

                <h2 className="text-base sm:text-2xl font-black leading-tight line-clamp-2 text-white">
                  {active.title}
                </h2>

                <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {active.subtitle}
                </p>

                {/* Price block */}
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-base sm:text-2xl font-black text-white">
                    {formatPrice(active.price)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(active.originalPrice)}
                  </span>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/product/${active.id}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 sm:py-2.5 text-xs font-black shadow-lg transition ${active.buttonBg}`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>View Deal Now</span>
                  </Link>
                </div>
              </div>

              {/* Product Visual (Right Side) */}
              <div className="relative z-10 w-[38%] sm:w-[42%] flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-[210px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/40 backdrop-blur-xs p-2">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover rounded-xl transition duration-500 hover:scale-105"
                  />
                  {/* Floating deal badge */}
                  <span className="absolute top-2 right-2 rounded-md bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 shadow-md">
                    HOT DEAL
                  </span>
                </div>
              </div>

              {/* Navigation Arrows (Jumia style) */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/70 p-1.5 text-white backdrop-blur-xs transition z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/70 p-1.5 text-white backdrop-blur-xs transition z-20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Pagination Dots (Jumia style) */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {featuredSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Right Column: Jumia-style Trust and Convenience Pillars */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-between gap-3">
            {/* Card 1: Verified Shop Assurance */}
            <div className="flex-1 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Verified Kampala Shops</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Physical stores on Kampala Rd, Acacia Mall & Nakasero. Zero ghost sellers.
                </p>
              </div>
            </div>

            {/* Card 2: MoMo & Cash on Delivery */}
            <div className="flex-1 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">MTN MoMo & Airtel Money</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Inspect your item thoroughly before paying on delivery.
                </p>
              </div>
            </div>

            {/* Card 3: Safe Delivery */}
            <div className="flex-1 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Same-Day Boda Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fast delivery across Kampala, Entebbe, Wakiso & Mukono.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
