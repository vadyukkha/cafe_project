'use client';

import React from 'react';
import { ProductCard } from '@/app/components/ProductCard';
import { LoadingState, ErrorState, EmptyState } from '@/app/components/ProductStates';
import { useProducts } from '@/app/hooks/Products';

const ProductsList: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">СКУФАТОRR Coffee</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>Всего видов кофе: {products.length}</p>
      </div>
    </div>
  );
};

export default ProductsList;