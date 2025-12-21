import Link from "next/link";
import styles from "./cart.module.css";

interface CartEmptyProps {
    message?: string;
    actionText?: string;
}

export function CartEmpty({
    message = "Корзина пуста",
    actionText = "Добавьте товары из меню"
}: CartEmptyProps) {
    return (
        <div className={styles.emptyCart}>
            <h2>{message}</h2>
            <p>{actionText}</p>
            <Link href="/menu" className={styles.menuButton}>
                Перейти в меню
            </Link>
        </div>
    );
}