import {
    Link
} from 'react-router-dom';

import { Menu } from './components/Menu';
import styles from '../styles/Home.module.css';
import { SearchBox } from './components/SearchBox';

function Home() {
    return (
        <div className={styles.container}>
            <header className="header">
            <SearchBox placeholder="Search book" />
            </header>

            <main className="main">

            </main>

            <footer className="footer">
                <Menu/>
            </footer>
        </div>
    );
}

export default Home;