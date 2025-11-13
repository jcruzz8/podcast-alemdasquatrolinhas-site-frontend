import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

import '../../pages/AdminDashboard.css';

// Este componente é o nosso "Guarda-Costas"
function AdminRoute() {
    // 1. Verifica a "memória global" para ver quem está logado
    const { isLoggedIn, user } = useAuth();

    // 2. Verifica se o utilizador é um admin
    //    (O 'user?' é "optional chaining": só tenta ler 'role' se 'user' não for null)
    const isAdmin = isLoggedIn && user?.role === 'admin';

    // Este 'useEffect' agora aplica-se a TODAS as rotas de admin
    useEffect(() => {
        const originalColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = '#444444'; // O fundo cinza-escuro

        // Esta função de limpeza só corre se sairmos da secção de Admin
        return () => {
            document.body.style.backgroundColor = originalColor || '#f4f4f4';
        }
    }, []); // Corre uma vez quando entramos no Admin

    if (isAdmin) {
        // 3. Se for admin: Deixa-o passar. O <Outlet /> é o "placeholder"
        //    para a página que o guarda-costas está a proteger (ex: o Dashboard)
        return <Outlet />;
    } else {
        // 4. Se NÃO for admin (ou não estiver logado):
        //    Expulsa-o para a Página Principal.
        return <Navigate to="/" replace />;
    }
}

export default AdminRoute;