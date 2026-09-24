import {Toaster} from 'react-hot-toast';

export default function UserStateLayout({children}) {
    return (
        <div className="app">
            <main>
                {children}
            </main>
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