import { notFound } from 'next/navigation';
import Image from 'next/image';
import coffeePNG from '@/public/coffee.png';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const response = await fetch(`http://localhost:3000/api/v1/products/${id}`);
    
    if (response.status === 404) {
      notFound();
    }
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки товара');
    }
    
    const product: Product = await response.json();
    
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ 
              width: '100%', 
              height: '400px', 
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Image
                  src={coffeePNG}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
              {product.name}
            </h1>
            
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#8B4513',
              margin: '20px 0'
            }}>
              {product.price} ₽
            </div>
            
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '30px'
            }}>
              {product.description}
            </p>
            
            <button style={{ 
              background: '#8B4513', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}>
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Ошибка:', error);
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#d32f2f' }}>Ошибка</h1>
        <p style={{ fontSize: '18px' }}>
          Не удалось загрузить товар. Попробуйте обновить страницу или зайти позже.
        </p>
      </div>
    );
  }
}