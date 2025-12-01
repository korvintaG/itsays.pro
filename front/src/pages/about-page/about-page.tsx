import { type FC } from "react";
import styles from './about-page.module.scss'

/**
 * Страница "о системе"
 */

export const AboutPage: FC = () => <main className={styles.main}>
    Добро пожаловать на сайт интернета вещей! 
    Мы научим Ваши вещи (автомобиль, чемодан, спортивную форму, ...) анонимно разговаривать с прохожими.
</main>;
