import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getAllProducts, trackEvent } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // Track product view server-side
  trackEvent(product.id, 'view');

  const relatedProducts = getAllProducts({
    category: product.category,
  })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
