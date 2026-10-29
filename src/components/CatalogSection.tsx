'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from './ProductCard';
import { formatPrice } from '@/lib/utils';
import { useMarketplaceSearch } from '@/context/SearchContext';

interface CatalogSectionProps {
  initialProducts: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CatalogSection({
  initialProducts,
  selectedCategory,
  onSelectCategory,
}: CatalogSectionProps) {
  const { searchQuery, setSearchQuery } = useMarketplaceSearch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');

  // Available unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.sellerLocation.includes('Pioneer') || p.sellerLocation.includes('Kampala Road')) {
        locs.add('Kampala CBD');
      } else if (p.sellerLocation.includes('Acacia')) {
        locs.add('Acacia Mall Kisementi');
      } else if (p.sellerLocation.includes('Nakasero') || p.sellerLocation.includes('Luwum')) {
        locs.add('Nakasero Market');
      } else if (p.sellerLocation.includes('Ntinda')) {
        locs.add('Ntinda');
      }
    });
    return Array.from(locs);
  }, [initialProducts]);

  // Categories list with counts
  const categoriesList: { name: Category; count: number }[] = useMemo(() => {
    const cats: Category[] = [
      'All',
      'Solar & Power Backup',
      'Water & Home Tech',
      'Phones & Computers',
      'Agri & Food Processing',
      'Fashion & Beauty',
      'Vehicles & Auto',
    ];

    return cats.map((cat) => {
      const count =
        cat === 'All'
          ? initialProducts.length
          : initialProducts.filter((p) => p.category === cat).length;
      return { name: cat, count };
    });
  }, [initialProducts]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.sellerLocation.toLowerCase().includes(q) ||
          (p.problemSolved && p.problemSolved.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Condition
    if (conditionFilter !== 'All') {
      result = result.filter((p) => p.condition === conditionFilter);
    }

    // Location
    if (locationFilter !== 'All') {
      result = result.filter((p) =>
        p.sellerLocation.toLowerCase().includes(locationFilter.toLowerCase().split(' ')[0])
      );
    }

    // Price Range
    if (priceRange === 'under500k') {
      result = result.filter((p) => p.price <= 500000);
    } else if (priceRange === '500k-2m') {
      result = result.filter((p) => p.price > 500000 && p.price <= 2000000);
    } else if (priceRange === 'above2m') {
      result = result.filter((p) => p.price > 2000000);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.viewsCount + b.whatsappClicks * 4 - (a.viewsCount + a.whatsappClicks * 4));
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    conditionFilter,
    locationFilter,
    priceRange,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    conditionFilter !== 'All' ||
    locationFilter !== 'All' ||
    priceRange !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    onSelectCategory('All');
    setConditionFilter('All');
    setLocationFilter('All');
    setPriceRange('All');
    setSortBy('popular');
  };

  return (
    <div className="space-y-4">
      {/* ================= 1. MOBILE COMPACT STICKY BAR (sm:hidden) ================= */}
      {/* Takes minimal vertical space (~42px when closed) so products are immediately visible on phones */}
      <div className="sm:hidden sticky top-[108px] z-30 -mx-3 px-3 py-2 bg-white/95 backdrop-blur-xs border-y border-slate-200 shadow-2xs space-y-2">
        {/* Row 1: Fast Horizontal Category Pill Strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name === 'All' ? 'All Goods' : cat.name}</span>
                <span
                  className={`text-[9px] rounded-full px-1.5 py-0.2 ${
                    isSelected ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Results Count & Compact "Filters & Sort" Toggle */}
        <div className="flex items-center justify-between pt-0.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500">
            {filteredProducts.length} verified item{filteredProducts.length === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Reset
              </button>
            )}

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                mobileFiltersOpen || hasActiveFilters
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filters & Sort</span>
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>}
              {mobileFiltersOpen ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Secondary Filters (Only shown when user taps 'Filters & Sort') */}
        {mobileFiltersOpen && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Sort & Condition Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Area / Mall
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Kampala</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Filter Chips */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Price Budget
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All Prices', val: 'All' },
                  { label: '< 500k', val: 'under500k' },
                  { label: '500k - 2M', val: '500k-2m' },
                  { label: '> 2M', val: 'above2m' },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPriceRange(p.val)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      priceRange === p.val
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Chips */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Condition:</span>
              <div className="flex gap-1.5">
                {['All', 'Brand New', 'Like New', 'Gently Used'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setConditionFilter(c)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                      conditionFilter === c
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. DESKTOP STICKY FILTER BAR (hidden sm:block) ================= */}
      <div className="hidden sm:block sticky top-[78px] z-30 rounded-xl border border-slate-300 bg-white p-3 shadow-md space-y-2.5 transition">
        {/* Row 1: Unified Search input + Category Dropdown + Sort */}
        <div className="grid grid-cols-12 gap-2 items-center">
          {/* Search Box (6 cols) */}
          <div className="col-span-6 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search solar generators, booster pumps, Starlink, iPhones, Kampala shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown (3 cols) */}
          <div className="col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-800 focus:border-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories ({initialProducts.length})</option>
              {categoriesList
                .filter((c) => c.name !== 'All')
                .map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
            </select>
          </div>

          {/* Sort Selector (3 cols) */}
          <div className="col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-800 focus:border-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Row 2: Quick Filter Chips (Price, Area, Condition, Reset) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Price Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200 rounded-md p-0.5">
            <span className="text-[10px] font-bold text-slate-400 px-1">Price:</span>
            {[
              { label: 'All', val: 'All' },
              { label: '< 500k', val: 'under500k' },
              { label: '500k-2M', val: '500k-2m' },
              { label: '> 2M', val: 'above2m' },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setPriceRange(p.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${
                  priceRange === p.val
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Area Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200 rounded-md px-1.5 py-0.5">
            <span className="text-[10px] font-bold text-slate-400">Area:</span>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent font-semibold text-[10px] text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Kampala</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200 rounded-md px-1.5 py-0.5">
            <span className="text-[10px] font-bold text-slate-400">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="bg-transparent font-semibold text-[10px] text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Gently Used">Gently Used</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[10px] font-bold text-rose-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Row 3: Horizontal Category Quick-Pill Strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[9px] rounded-full px-1.5 py-0.2 ${
                    isSelected ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Counter Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory === 'All'
              ? 'All Verified Listings'
              : selectedCategory}
          </h2>
          <p className="text-[11px] text-slate-500">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> verified {filteredProducts.length === 1 ? 'solution' : 'solutions'} in Kampala
          </p>
        </div>
      </div>

      {/* Product Grid: 2 columns mobile up to 5 on large screens */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">
            No matching products found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing active filters.
          </p>
          <div className="pt-2">
            <button
              onClick={resetAllFilters}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
