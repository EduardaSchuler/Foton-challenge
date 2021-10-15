import { CSSProperties, FC } from "react";

import styles from "../../styles/HeaderSection.module.css";

interface HeaderSectionProps {
  sectionLabel: string;
  linkLabel: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const HeaderSection: FC<HeaderSectionProps> = (props) => {
  return (
    <div className={styles.container} style={props.style}>
      <header className={styles.header}>
        <p>{props.sectionLabel}</p>
        <p>{props.linkLabel}</p>
      </header>

      <main onClick={props.onClick}>
        {props.children}
      </main>
    </div>
  );
}