import { FC } from "react";

import styles from "../../styles/Home.module.css";

interface SectionHeaderProps {
    sectionLabel: string;
    linkLabel: string;
}

export const SectionHeader: FC<SectionHeaderProps> = (props) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <p>{props.sectionLabel}</p>
                <p>{props.linkLabel}</p>
            </header>

            <main>
                {props.children}
            </main>

        </div>
    );
}