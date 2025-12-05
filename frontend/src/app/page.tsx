import styles from './page.module.css';
import Link from 'next/link';

export default function HomePage() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.hero__content}>
                    <h1>Добро пожаловать в CKYФАTORR</h1>
                    <p>Свежий кофе, тёплая атмосфера и лучшие десерты в городе.</p>

                    <Link href="/menu" className={styles.hero__button}>
                        Посмотреть меню
                    </Link>
                </div>
            </section>

            <section className={styles.about}>
                <h2>О нас</h2>
                <p>
                    Мы верим, что кофе — это больше, чем напиток. Это маленький
                    ежедневный ритуал, который делает день теплее.
                    В нашем меню вы найдёте свежие зерна, классические напитки и
                    фирменные авторские рецепты.
                </p>
            </section>
        </>
    );
}
