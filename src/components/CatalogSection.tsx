'use client';

import React, { useState, useMemo } from 'react';
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
      {/* ================= ONLY ONE UNIFIED STICKY CATEGORY & FILTER BAR ================= */}
      {/* Search is uniquely in Navbar. No duplicate search bar or duplicate filters anywhere. */}
      <div className="sticky top-[106px] sm:top-[78px] z-30 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xs p-2.5 shadow-2xs space-y-2 transition">
        {/* Row 1: Fast Horizontal Category Pill Strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
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

        {/* Row 2: Clean Controls Row (Count + Sort + Quick Filter Dropdowns) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Result Count and Reset button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              {filteredProducts.length} verified item{filteredProducts.length === 1 ? '' : 's'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Area Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Gently Used">Gently Used</option>
            </select>

            {/* Price Budget Selector (Quick chips on md+, dropdown on small screens) */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-md p-0.5">
              <span className="text-[10px] font-bold text-slate-400 px-1">Budget:</span>
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

            {/* Price Budget Dropdown on Small Screens */}
            <div className="md:hidden">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Budgets</option>
                <option value="under500k">&lt; 500k</option>
                <option value="500k-2m">500k - 2M</option>
                <option value="above2m">&gt; 2M</option>
              </select>
            </div>
          </div>
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
