import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

import '../../pages/AdminDashboard.css';

// Este componente é o nosso "Guarda-Costas"
function AdminRoute() {
    // 1. Apanha os 3 estados do "Cérebro"
    const { isLoggedIn, user, authLoading } = useAuth();

    // 2. Verifica se o utilizador é um admin
    const isAdmin = isLoggedIn && user?.role === 'admin';

    // O 'useEffect' do fundo (fica igual)
    useEffect(() => {
        const originalColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = '#444444';
        return () => {
            document.body.style.backgroundColor = originalColor || '#f4f4f4';
        }
    }, []);

    // ---- A NOSSA CORREÇÃO ----
    // 3. Se o "Cérebro" ainda está a carregar do localStorage, ESPERA
    if (authLoading) {
        // Mostra uma mensagem de "a carregar" em vez de um ecrã branco
        // Pode estilizar isto ou usar um componente "Spinner" se tiver
        return <p style={{ textAlign: 'center', marginTop: '2rem' }}>A verificar autenticação...</p>;
    }

    // 4. SÓ DEPOIS de carregar é que tomamos uma decisão
    if (isAdmin) {
        // Se for admin: Deixa-o passar
        return <Outlet />;
    } else {
        // Se NÃO for admin: Expulsa-o
        return <Navigate to="/" replace />;
    }
}

export default AdminRoute;