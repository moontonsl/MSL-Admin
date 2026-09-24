// resources/js/Layouts/MainLayout.jsx
import {Footer, Header} from '@/Components/index.js';
import {Toaster} from 'react-hot-toast';
import styles from './AuthenticatedLayoutEventsBattleTrips.module.scss';

export default function AuthenticatedLayoutEventsWatchFest({children}) {
    return (
        <div className={`${styles.battleTripsBG} app`}>
            <Header/>
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer/>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}


