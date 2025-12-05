import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from './types';
import { Product } from '../../product/model/types';

// Загружаем корзину из localStorage
export const loadCartFromLocalStorage = (): CartState => {
    if (typeof window === 'undefined') {
        return { items: [], totalPrice: 0, totalItems: 0 };
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        return JSON.parse(savedCart);
    }

    return { items: [], totalPrice: 0, totalItems: 0 };
};

// Сохраняем корзину в localStorage
const saveCartToLocalStorage = (state: CartState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
    }
};

// Вычисляем итоги
const calculateTotals = (items: CartItem[]) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalPrice, totalItems };
};

const initialState: CartState = {
    items: [],
    totalPrice: 0,
    totalItems: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<CartState>) {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.totalItems = action.payload.totalItems;
            saveCartToLocalStorage(state);
        },
        addToCart(state, action: PayloadAction<Product>) {
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            const totals = calculateTotals(state.items);
            state.totalPrice = totals.totalPrice;
            state.totalItems = totals.totalItems;
            saveCartToLocalStorage(state);
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
            const totals = calculateTotals(state.items);
            state.totalPrice = totals.totalPrice;
            state.totalItems = totals.totalItems;
            saveCartToLocalStorage(state);
        },
        updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (quantity < 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
            const totals = calculateTotals(state.items);
            state.totalPrice = totals.totalPrice;
            state.totalItems = totals.totalItems;
            saveCartToLocalStorage(state);
        },
        incrementQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find(item => item.id === action.payload);
            if (item) item.quantity += 1;
            const totals = calculateTotals(state.items);
            state.totalPrice = totals.totalPrice;
            state.totalItems = totals.totalItems;
            saveCartToLocalStorage(state);
        },
        decrementQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                if (item.quantity === 1) {
                    state.items = state.items.filter(i => i.id !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
            const totals = calculateTotals(state.items);
            state.totalPrice = totals.totalPrice;
            state.totalItems = totals.totalItems;
            saveCartToLocalStorage(state);
        },
        clearCart(state) {
            state.items = [];
            state.totalPrice = 0;
            state.totalItems = 0;
            saveCartToLocalStorage(state);
        },
    },
});

export const {
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
