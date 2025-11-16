import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { recordPageView } from './services/pageViewService';

// --- Importa o Layout ---
import Navbar from './components/layout/Navbar';
import MiniNavbar from './components/layout/MiniNavbar';
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
import CategoryPage from './pages/CategoryPage';

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        recordPageView();
    }, []);

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header className="sticky-navbar-wrapper">
                    <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
                    <MiniNavbar />
                </header>

                <main style={{ flex: 1, paddingTop: '1rem' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/noticias" element={<NoticiasPage />} />
                        <Route path="/noticias/categoria/:categoryName" element={<CategoryPage />} />
                        <Route path="/noticias/:postId" element={<PostDetailPage />} />
                        <Route path="/alertas" element={<AlertasPage />} />
                        <Route path="/sondagens" element={<SondagensPage />} />
                        <Route path="/sobre-nos" element={<SobreNosPage />} />
                        <Route path="/equipa" element={<Equipa />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/edit-post/:postId" element={<EditPostPage />} />
                        </Route>
                    </Routes>
                </main>

                <Footer />
            </div>

            <Link to="/alertas" className="alert-bell-icon">
                <FaBell />
            </Link>
        </>
    );
}

export default App;