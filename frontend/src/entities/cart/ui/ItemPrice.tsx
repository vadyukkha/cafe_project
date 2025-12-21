import styles from "./cart.module.css";

interface ItemPriceProps {
    price: number;
    quantity: number;
}

export default function CartItemPrice({ price, quantity }: ItemPriceProps) {
    return (
        <div className={styles.itemPrice}>
            <div className={styles.pricePerItem}>
                {price} ₽ × {quantity}
            </div>
            <div className={styles.totalItemPrice}>
                {(price * quantity).toFixed(2)} ₽
            </div>
        </div>
    );
}