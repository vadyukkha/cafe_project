import { Product } from "../../product/model/types";

export interface CartItem extends Product {
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}