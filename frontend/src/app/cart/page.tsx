"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/src/shared/store/store";
import { 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart 
} from "@/src/entities/cart/model/cartSlice";
import coffeePNG from "@/public/coffee.png";
import styles from "./page.module.css";

export default function CartPage() {
    const dispatch = useDispatch();
    const { items, totalPrice, totalItems } = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.authRequired}>
                    <h2>Требуется авторизация</h2>
                    <p>Для просмотра корзины необходимо войти в систему</p>
                    <Link href="/login" className={styles.loginButton}>
                        Войти
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyCart}>
                    <h2>Корзина пуста</h2>
                    <p>Добавьте товары из меню</p>
                    <Link href="/menu" className={styles.menuButton}>
                        Перейти в меню
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Корзина</h1>
                <button 
                    onClick={() => dispatch(clearCart())}
                    className={styles.clearButton}
                >
                    Очистить корзину
                </button>
            </div>

            <div className={styles.cartContent}>
                <div className={styles.itemsList}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemImage}>
                                <Image
                                    src={coffeePNG}
                                    alt={item.name}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{item.name}</h3>
                                <p className={styles.itemDescription}>{item.description}</p>
                                <div className={styles.itemVolume}>{item.volume} мл.</div>
                            </div>
                            
                            <div className={styles.quantityControls}>
                                <button 
                                    onClick={() => dispatch(decrementQuantity(item.id))}
                                    className={styles.quantityButton}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>{item.quantity}</span>
                                <button 
                                    onClick={() => dispatch(incrementQuantity(item.id))}
                                    className={styles.quantityButton}
                                >
                                    +
                                </button>
                            </div>
                            
                            <div className={styles.itemPrice}>
                                <div className={styles.pricePerItem}>
                                    {item.price} ₽ × {item.quantity}
                                </div>
                                <div className={styles.totalItemPrice}>
                                    {item.price * item.quantity} ₽
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => dispatch(removeFromCart(item.id))}
                                className={styles.removeButton}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className={styles.summary}>
                    <h2>Итого</h2>
                    <div className={styles.summaryRow}>
                        <span>Товары ({totalItems} шт.)</span>
                        <span>{totalPrice} ₽</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Доставка</span>
                        <span>Бесплатно</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Общая сумма</span>
                        <span className={styles.totalPrice}>{totalPrice} ₽</span>
                    </div>
                    
                    <button className={styles.checkoutButton}>
                        Перейти к оформлению
                    </button>
                    
                    <Link href="/menu" className={styles.continueShopping}>
                        ← Продолжить покупки
                    </Link>
                </div>
            </div>
        </div>
    );
}