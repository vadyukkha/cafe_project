// components/ProductCard.tsx
'use client';

import { Product } from '@/app/types/product';
import Image from 'next/image';
import coffeeImage from '@/app/images/coffee.png';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image
          src={coffeeImage}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {product.name}
          </h2>
          <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0 ml-2">
            {product.volume} мл
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-amber-700">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};