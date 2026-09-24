// resources/js/Layouts/MainLayout.jsx
import {Footer, Header} from '@/Components/index.js';
import {Toaster} from 'react-hot-toast';


export default function AuthenticatedLayout({children}) {
    return (
        <div className="app">
            <Header/>
            <main>
                <div className="webBG"/>
                <div className="flex justify-center w-full">
                    {children}
                </div>
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
