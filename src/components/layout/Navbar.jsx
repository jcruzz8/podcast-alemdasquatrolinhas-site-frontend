import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars } from 'react-icons/fa'; // 1. Importa o ícone "Hamburger"
import './Navbar.css';

// A Navbar agora recebe a função 'onOpenSidebar' do App.jsx
function Navbar({ onOpenSidebar }) {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="navbar">

            {/* 1. LADO ESQUERDO: O Hamburger */}
            <div className="navbar-left">
                <button className="hamburger-btn" onClick={onOpenSidebar}>
                    <FaBars />
                </button>
            </div>

            {/* 2. CENTRO: O Logo */}
            <div className="navbar-center">
                <Link to="/" className="nav-logo">
                    <img src="/logo_podcast.jpg" alt="Logo do Podcast" className="logo-image" />
                </Link>
            </div>

            {/* 3. LADO DIREITO: Autenticação */}
            <div className="navbar-right">
                {isLoggedIn ? (
                    // --- SE ESTIVER LOGADO (Botão "Ir para o banco" amarelo) ---
                    <button onClick={logout} className="nav-button yellow">
                        Sair de campo
                    </button>
                ) : (
                    // --- SE NÃO ESTIVER LOGADO (Dois botões) ---
                    <>
                        <NavLink to="/register" className="nav-button yellow">
                            CRIAR CONTA
                        </NavLink>
                        <NavLink to="/login" className="nav-button black">
                            ENTRAR
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;