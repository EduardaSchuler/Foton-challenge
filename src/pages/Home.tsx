import {
    Link
} from 'react-router-dom';

import styles from '../styles/Home.module.css';
import { Search } from './components/Search';

function Home() {
    return (
        <div className={styles.container}>
            <header className="header">
            <Search placeholder="Search book" />
            </header>

            <main className="main">

            </main>

            <footer className="footer">

            </footer>
        </div>
    );
}

export default Home;