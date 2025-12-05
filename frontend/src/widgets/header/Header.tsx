"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import styles from "./Header.module.css"

export function Header() {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  const isAuthenticated = !!accessToken;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          CKYФATORR
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/menu">Меню</Link>
      </nav>

      <div className={styles.right}>
        <Link href="/cart" className={styles.cartButton}>
          Корзина
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
