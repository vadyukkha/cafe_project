import apiConfig from '@/src/config/config';

export interface Product {
    id: string;
    name: string;
    description: string;
    volume: number;
    price: string;
    createdAt: string;
}

export interface CreateProductData {
    name: string;
    description: string;
    volume: number;
    price: string;
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    volume?: number;
    price?: string;
}

export const createProduct = async (data: CreateProductData): Promise<{ 
    message: string; 
    product: Product 
}> => {
    const response = await fetch(`${apiConfig.baseUrl}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при создании товара');
    }

    return response.json();
};

// Обновление товара
export const updateProduct = async (productName: string, data: UpdateProductData): Promise<{ 
    message: string; 
    product: Product 
}> => {
    const response = await fetch(`${apiConfig.baseUrl}/products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            productName,
            ...data
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при обновлении товара');
    }

    return response.json();
};

// Удаление товара
export const deleteProduct = async (productName: string): Promise<{ message: string }> => {
    const response = await fetch(`${apiConfig.baseUrl}/products`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productName }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при удалении товара');
    }

    return response.json();
};