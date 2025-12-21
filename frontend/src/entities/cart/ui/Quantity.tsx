import { useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "../model/cartSlice";
import styles from "./cart.module.css";

interface QuantityProps {
    itemId: string;
    quantity: number;
}

export default function CartQuantityControls({ itemId, quantity }: QuantityProps) {
    const dispatch = useDispatch();

    return (
        <div className={styles.quantityControls}>
            <button
                onClick={() => dispatch(decrementQuantity(itemId))}
                className={styles.quantityButton}
            >
                -
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button
                onClick={() => dispatch(incrementQuantity(itemId))}
                className={styles.quantityButton}
            >
                +
            </button>
        </div>
    );
}