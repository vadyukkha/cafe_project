"use client";

import { useDispatch } from "react-redux";
import { logout } from "../model/authSlice";
import { User } from "../model/types";
import styles from "./UserProfile.module.css";

export function UserProfile({ user }: { user: User }) {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());

        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            document.cookie = `auth_token=; path=/; max-age=0; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax`;
            window.location.href = "/login";
        }
    };

    const handleTelegram = () => {
        window.location.href = `https://t.me/skufatorr_coffee_bot?start=${user.id}`
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Профиль пользователя</h1>

            <div className={styles.row}>
                <b>ID:</b> {user.id}
            </div>

            <div className={styles.row}>
                <b>Имя:</b> {user.name}
            </div>

            <div className={styles.row}>
                <b>Email:</b> {user.email}
            </div>

            <div className={styles.row}>
                <b>Роль:</b> {user.role}
            </div>

            <div className={styles.row}>
                <b>Аккаунт создан:</b>{" "}
                {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </div>

            <button className={styles.logoutButton} onClick={handleTelegram}>
                Карта лояльности
            </button>

            <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
            </button>
        </div>
    );
}
