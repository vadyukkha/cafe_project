import Image from "next/image";
import coffeePNG from "@/public/coffee.png";
import styles from "./cart.module.css";

interface CartItemImageProps {
    name: string;
}

export default function CartItemImage({ name }: CartItemImageProps) {
    return (
        <div className={styles.itemImage}>
            <div className={styles.imageWrapper}>
                <Image
                    src={coffeePNG}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100px, 100px"
                    style={{ objectFit: "contain" }}
                    className={styles.image}
                />
            </div>
        </div>
    );
}