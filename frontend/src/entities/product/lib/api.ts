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
