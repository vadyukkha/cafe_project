"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useEffect } from "react";
import { RootState } from "@/src/shared/store/store";
import { setCart, loadCartFromLocalStorage } from "@/src/entities/cart/model/cartSlice";
import { CartHeader } from "@/src/entities/cart/ui/CartHeader";
import { CartContent } from "@/src/entities/cart/ui/Content";
import { CartEmpty } from "@/src/entities/cart/ui/Empty";
import styles from "./page.module.css";

export default function CartPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const cart = useSelector((state: RootState) => state.cart);
    const { items, totalPrice, totalItems } = cart;

    useEffect(() => {

        if (typeof window !== "undefined") {
            const savedCart = loadCartFromLocalStorage();
            dispatch(setCart(savedCart));
        }
    }, [dispatch]);

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
                <CartEmpty />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <CartHeader />
            <CartContent
                items={items}
                totalItems={totalItems}
                totalPrice={totalPrice}
            />
        </div>
    );
}