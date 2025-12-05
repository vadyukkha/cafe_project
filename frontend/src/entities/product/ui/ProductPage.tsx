import Image from "next/image";
import coffeePNG from "@/public/coffee.png";
import { Product } from "../model/types";
import styles from "./ProductPage.module.css";

export function ProductPageView({ product }: { product: Product }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                <div className={styles.imageBlock}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={coffeePNG}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                </div>

                <div className={styles.infoBlock}>
                    <h1 className={styles.title}>{product.name}</h1>

                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.volume}>{product.volume} мл.</div>

                    <div className={styles.price}>{product.price} ₽</div>

                    <button className={styles.button}>Добавить в корзину</button>
                </div>
            </div>
        </div>
    );
}
