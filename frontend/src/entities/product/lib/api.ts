import { Product } from "../model/types"

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch("http://localhost:3000/api/v1/products", {
        cache: "no-store",
        method: "GET"
    });

    if (!res.ok) {
        throw new Error("Не удалось загрузить продукты");
    }

    return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
    const response = await fetch(`http://localhost:3000/api/v1/products/${id}`);

    if (response.status === 404) {
        throw new Error("NOT_FOUND");
    }

    if (!response.ok) {
        throw new Error("Ошибка загрузки товара");
    }

    return await response.json();
}
