import styles from "./Footer.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} CKYФАTORR Coffee. Все права защищены.</p>
            <p>Нижегородская область, г. Нижний Новгород, ул. Казанское шоссе 2к1</p>
        </footer>
    );
}
