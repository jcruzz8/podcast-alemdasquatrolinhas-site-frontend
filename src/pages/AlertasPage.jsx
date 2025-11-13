import React, { useState, useEffect } from 'react';
import { fetchPublicAlerts, toggleAlertLike } from '../services/alertService';
import { useAuth } from '../context/AuthContext';
import '../components/posts/PostCard.css'; // reusa o CSS do botão de like

function AlertasPage() {
    // 1. Onde vamos guardar os alertas
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isLoggedIn, user } = useAuth();

    // 2. O 'useEffect' corre quando a página carrega
    useEffect(() => {
        const getAlerts = async () => {
            setLoading(true);
            const alertsData = await fetchPublicAlerts();
            setAlerts(alertsData);
            setLoading(false);
        };

        getAlerts();
    }, []); // [] = Corre só uma vez

    // 3. ---- FUNÇÃO DE LIKE ----
    const handleLike = async (alertId) => {
        if (!isLoggedIn) return; // (O botão já deve estar desativado, mas é uma segurança extra)

        const updatedAlert = await toggleAlertLike(alertId);

        if (updatedAlert) {
            // Atualiza a lista de alertas instantaneamente
            setAlerts(prevAlerts =>
                prevAlerts.map(alert =>
                    alert._id === updatedAlert._id ? updatedAlert : alert
                )
            );
        }
    };

    // 3. A estrutura (JSX) da página
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Alertas de Episódios</h1>

            {loading && <p>A carregar alertas...</p>}

            {!loading && alerts.length === 0 && <p>Não há alertas de momento.</p>}

            {!loading && alerts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {alerts.map(alert => {

                        // 4. Verifica se o user já deu like
                        const userHasLiked = alert.likes?.includes(user?._id);

                        return (
                            <div
                                key={alert._id}
                                style={{
                                    backgroundColor: '#333', // <-- REQUISITO: Fundo cinzento-escuro
                                    color: '#fff', // <-- Letras brancas
                                    border: '1px solid #444',
                                    padding: '1.5rem',
                                    borderRadius: '8px'
                                }}
                            >
                                <p style={{
                                    fontSize: '1.2rem',
                                    margin: 0,
                                    fontWeight: 'bold' // <-- REQUISITO: Título a negrito
                                }}>
                                    {alert.mensagem}
                                </p>

                                <small style={{ color: '#ccc' }}> {/* Cor da data atualizada */}
                                    Publicado em: {new Date(alert.createdAt).toLocaleString('pt-PT')}
                                </small>

                                {/* O botão de Like (reutilizado do PostCard.css) fica igual */}
                                <div className="post-stats" style={{ marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleLike(alert._id)}
                                        disabled={!isLoggedIn}
                                        className={`like-button ${userHasLiked ? 'liked' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                                    >
                                        <span></span> {alert.likes?.length || 0} Likes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AlertasPage;