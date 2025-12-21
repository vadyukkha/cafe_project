import styles from "./cart.module.css";

interface CartItemInfoProps {
    name: string;
    volume: number;
}

export default function CartItemInfo({ name, volume }: CartItemInfoProps) {
    return (
        <div className={styles.itemInfo}>
            <h3 className={styles.itemName}>{name}</h3>
            <div className={styles.itemVolume}>{volume} мл.</div>
        </div>
    );
}