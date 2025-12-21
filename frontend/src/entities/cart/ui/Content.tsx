import { CartItem as CartItemType } from "../model/types";
import CartItem from "./Item";
import CartSummary from "./Summary";
import styles from "./cart.module.css";

interface ContentProps {
    items: CartItemType[];
    totalItems: number;
    totalPrice: number;
}

export function CartContent({ items, totalItems, totalPrice }: ContentProps) {
    return (
        <div className={styles.cartContent}>
            <div className={styles.itemsList}>
                {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            <CartSummary
                totalItems={totalItems}
                totalPrice={totalPrice}
            />
        </div>
    );
}