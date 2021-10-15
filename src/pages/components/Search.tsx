import { FC } from "react";
import styles from "../../styles/SearchComponent.module.css";

interface SearchProps {
    placeholder: string;
}

export const Search: FC<SearchProps> = (props) => {
    return (
        <div className={styles.container}>
            <img
                width={16}
                height={16}
                src="search.svg"
                alt="Search"
            />

            <input placeholder={props.placeholder} />
        </div>
    );
}