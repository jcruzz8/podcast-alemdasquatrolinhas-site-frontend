import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Esta linha vai procurar o ficheiro 'Sidebar.css' na MESMA pasta
import './Sidebar.css';

// Recebe 'isOpen' (para saber se deve estar visível) e 'onClose' (a função para a fechar)
function Sidebar({ isOpen, onClose }) {
    const { isLoggedIn, user } = useAuth();

    return (
        <>
            {/* O "fundo" escuro que aparece atrás da sidebar */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* O menu em si */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button onClick={onClose} className="sidebar-close-btn">&times;</button>
                <ul>
                    <li><NavLink to="/" onClick={onClose} end>Página Principal</NavLink></li>
                    <li><NavLink to="/noticias" onClick={onClose}>Notícias</NavLink></li>
                    <li><NavLink to="/alertas" onClick={onClose}>Alertas</NavLink></li>
                    <li><NavLink to="/sondagens" onClick={onClose}>Sondagens</NavLink></li>
                    <li><NavLink to="/sobre-nos" onClick={onClose}>Sobre nós</NavLink></li>
                    <li><NavLink to="/equipa" onClick={onClose}>Equipa</NavLink></li>
                    {isLoggedIn && user?.role === 'admin' && (
                        <li className="admin-sidebar-link"> {/* (Classe para estilo) */}
                            <NavLink to="/admin" onClick={onClose}>
                                Dashboard Admin
                            </NavLink>
                        </li>
                    )}
                </ul>
            </aside>
        </>
    );
}

export default Sidebar;