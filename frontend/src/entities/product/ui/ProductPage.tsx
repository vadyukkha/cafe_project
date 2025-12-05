"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import coffeePNG from "@/public/coffee.png";
import { Product } from "../model/types";
import { RootState } from "@/src/shared/store/store";
import { addToCart } from "@/src/entities/cart/model/cartSlice";
import styles from "./ProductPage.module.css";

export function ProductPageView({ product }: { product: Product }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const cartItem = cartItems.find(item => item.id === product.id);
    const buttonText = cartItem
        ? `В корзине (${cartItem.quantity})`
        : "Добавить в корзину";

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem("redirectAfterLogin", `/menu/${product.id}`);
            router.push("/login");
            return;
        }

        dispatch(addToCart(product));
    };

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

                    <button
                        onClick={handleAddToCart}
                        className={styles.button}
                    >
                        {isAuthenticated ? buttonText : "Войти для добавления"}
                    </button>

                    {!isAuthenticated && (
                        <p className={styles.authHint}>
                            Требуется авторизация для добавления товаров в корзину
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
