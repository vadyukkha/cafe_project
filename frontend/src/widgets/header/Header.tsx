"use client";

import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
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

        <Link href="/auth" className={styles.authButton}>
          Войти
        </Link>
      </div>
    </header>
  );
};
