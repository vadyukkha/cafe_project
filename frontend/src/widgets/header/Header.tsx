"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/src/shared/store/store";
import styles from "./Header.module.css";

export function Header() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/" className={styles.logo}>CKYФATORR</Link>
            </div>

            <nav className={styles.nav}>
                <Link href="/menu">Меню</Link>
            </nav>

            <div className={styles.right}>
                <Link href="/cart" className={styles.cartButton}>Корзина</Link>

                {isAuthenticated ? (
                    <Link href="/me" className={styles.authButton}>Профиль</Link>
                ) : (
                    <Link href="/login" className={styles.authButton}>Войти</Link>
                )}
            </div>
        </header>
    );
}
