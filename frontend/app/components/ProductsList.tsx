'use client';

import React, { useState, useEffect } from 'react';
import { Product, ApiResponse } from '@/app/types/product';

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/v1/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        
        setProducts(data);
        
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('500')) {
            setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
          } else {
            setError(`Ошибка при загрузке данных: ${err.message}`);
          }
        } else {
          setError('Произошла неизвестная ошибка');
        }
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const formatPrice = (price: number): string => {;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Загрузка данных о кофе...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Ошибка:</strong> {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Нет доступных видов кофе</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Наши виды кофе</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.volume} мл
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-bold text-amber-700">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {product.id.slice(0, 8)}...
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>Всего видов кофе: {products.length}</p>
      </div>
    </div>
  );
};

export default ProductsList;