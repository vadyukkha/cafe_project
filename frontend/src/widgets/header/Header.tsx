"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/src/shared/store/store";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";

export function Header() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const cartTotalItems = useSelector((state: RootState) => state.cart.totalItems);

    if (!mounted) return null;

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/" className={styles.logo}>CKYФATORR</Link>
            </div>

            <nav className={styles.nav}>
                <Link href="/menu">Меню</Link>
            </nav>

            <div className={styles.right}>
                <Link href="/cart" className={styles.cartButton}>
                    Корзина
                    {cartTotalItems > 0 && (
                        <span className={styles.cartBadge}></span>
                    )}
                </Link>

                {isAuthenticated ? (
                    <Link href="/me" className={styles.authButton}>Профиль</Link>
                ) : (
                    <Link href="/login" className={styles.authButton}>Войти</Link>
                )}
            </div>
        </header>
    );
}
