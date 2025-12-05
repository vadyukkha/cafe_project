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
            window.location.href = "/login";
        }
    };

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

            <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
            </button>
        </div>
    );
}
