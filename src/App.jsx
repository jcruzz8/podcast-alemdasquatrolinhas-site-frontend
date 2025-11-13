import React, { useState, useEffect } from 'react'; // 1. Importa o 'useState'
import { Routes, Route, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'; // 2. Importa o ícone do Sino
import { recordPageView } from './services/pageViewService';

// --- Importa o Layout ---
import Navbar from './components/layout/Navbar';
import MiniNavbar from './components/layout/MiniNavbar'; // 3. Importa a MiniNav
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// --- Importa as Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NoticiasPage from './pages/NoticiasPage';
import AlertasPage from './pages/AlertasPage';
import SondagensPage from './pages/SondagensPage';
import SobreNosPage from './pages/SobreNosPage';
import Equipa from './pages/Equipa.jsx';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/routing/AdminRoute';
import EditPostPage from './pages/EditPostPage';

function App() {
    // 5. Estado para controlar a Sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Este 'useEffect' corre UMA VEZ quando o site carrega
    useEffect(() => {
        // Regista a visita à base de dados
        recordPageView();
    }, []);

    return (
        <> {/* O Fragmento é necessário para a Sidebar "flutuar" */}

            <Sidebar
                isOpen={isSidebarOpen} // Diz-lhe se deve estar aberta ou fechada
                onClose={() => setSidebarOpen(false)} // Diz-lhe o que fazer quando clicamos no 'X' ou no fundo
            />

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* O "header" tem as duas navbars */}
                <header className="sticky-navbar-wrapper">
                    <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
                    <MiniNavbar />
                </header>

                <main style={{ flex: 1, paddingTop: '1rem' }}> {/* 'paddingTop' para respirar */}
                    <Routes>
                        {/* (As tuas rotas ficam iguais) */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/noticias" element={<NoticiasPage />} />
                        <Route path="/noticias/:postId" element={<PostDetailPage />} />
                        <Route path="/alertas" element={<AlertasPage />} />
                        <Route path="/sondagens" element={<SondagensPage />} />
                        <Route path="/sobre-nos" element={<SobreNosPage />} />
                        <Route path="/equipa" element={<Equipa />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route element={<AdminRoute />}>
                            {/* Todas as páginas aqui dentro são protegidas pelo "guarda-costas" */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/edit-post/:postId" element={<EditPostPage />} />
                        </Route>
                    </Routes>
                </main>

                <Footer />
            </div>

            {/* 6. O ícone do Sino (Req 4) */}
            <Link to="/alertas" className="alert-bell-icon">
                <FaBell />
            </Link>
        </>
    );
}

export default App;