import { useDispatch } from "react-redux";
import { removeFromCart } from "../model/cartSlice";
import { CartItem as CartItemType } from "../model/types";
import CartItemImage from "./Image";
import CartItemInfo from "./ItemInfo";
import CartQuantityControls from "./Quantity";
import CartItemPrice from "./ItemPrice";
import styles from "./cart.module.css";

interface ItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: ItemProps) {
    const dispatch = useDispatch();

    return (
        <div className={styles.cartItem}>
            <CartItemImage name={item.name} />
            <CartItemInfo
                name={item.name}
                volume={item.volume}
            />
            <CartQuantityControls itemId={item.id} quantity={item.quantity} />
            <CartItemPrice price={item.price} quantity={item.quantity} />
            <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className={styles.removeButton}
            >
                ×
            </button>
        </div>
    );
}