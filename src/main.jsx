import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

// 1. Importa o nosso novo Provider
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';

import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider> {/* 2. "Embrulha" a App */}
                <AudioProvider>
                    <App />
                </AudioProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
