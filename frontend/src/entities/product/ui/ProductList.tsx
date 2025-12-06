import Image from "next/image";
import Link from "next/link";
import { Product } from "../model/types";
import styles from "./ProductList.module.css";
import coffeePNG from "@/public/coffee.png";

interface Props {
    products: Product[];
}

export function ProductList({ products }: Props) {
    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <Link
                    href={`/menu/${product.id}`}
                    key={product.id}
                    className={styles.card}
                >
                    <h3 className={styles.title}>{product.name}</h3>

                    <div className={styles.imageWrapper}>
                        <Image
                            src={coffeePNG}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className={styles.image}
                        />
                    </div>
                </Link>
            ))}
        </div>
    );
}
