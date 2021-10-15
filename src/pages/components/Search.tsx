import { FC } from "react";

import styles from "../../styles/Search.module.css";

interface SearchProps {
  placeholder: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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

      <input
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}