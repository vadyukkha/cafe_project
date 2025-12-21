import Link from "next/link";
import styles from "./cart.module.css";

interface CartSummaryProps {
    totalItems: number;
    totalPrice: number;
}

export default function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
    return (
        <div className={styles.summary}>
            <h2>Итого</h2>
            <div className={styles.summaryRow}>
                <span>Товары ({totalItems} шт.)</span>
                <span>{totalPrice.toFixed(2)} ₽</span>
            </div>
            <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span>Бесплатно</span>
            </div>
            <div className={styles.totalRow}>
                <span>Общая сумма</span>
                <span className={styles.totalPrice}>{totalPrice.toFixed(2)} ₽</span>
            </div>

            <button className={styles.checkoutButton}>
                Перейти к оформлению
            </button>

            <Link href="/menu" className={styles.continueShopping}>
                ← Продолжить покупки
            </Link>
        </div>
    );
}