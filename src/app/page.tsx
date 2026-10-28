import React from 'react';
import { getAllProducts } from '@/lib/db';
import HomeMarketplaceClient from '@/components/HomeMarketplaceClient';

export default async function HomePage() {
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <HomeMarketplaceClient products={products} />
    </div>
  );
}
