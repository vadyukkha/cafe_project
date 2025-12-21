import { useDispatch } from "react-redux";
import { clearCart } from "../model/cartSlice";
import styles from "./cart.module.css";

export function CartHeader() {
    const dispatch = useDispatch();

    return (
        <div className={styles.header}>
            <h1>Корзина</h1>
            <button
                onClick={() => dispatch(clearCart())}
                className={styles.clearButton}
            >
                Очистить корзину
            </button>
        </div>
    );
}