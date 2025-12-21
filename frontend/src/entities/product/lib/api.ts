import apiConfig from "@/src/config/config";
import { Product } from "../model/types";

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${apiConfig.baseUrl}/products`, {
        cache: "no-store",
        method: "GET"
    });

    if (!res.ok) {
        throw new Error("Не удалось загрузить продукты");
    }

    return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
    const response = await fetch(`${apiConfig.baseUrl}/products/${id}`);

    if (response.status === 404) {
        throw new Error("NOT_FOUND");
    }

    if (!response.ok) {
        throw new Error("Ошибка загрузки товара");
    }

    return await response.json();
}
