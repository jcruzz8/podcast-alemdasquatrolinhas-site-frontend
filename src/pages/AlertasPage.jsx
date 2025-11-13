import React, { useState, useEffect } from 'react';
import { fetchPublicAlerts, toggleAlertLike } from '../services/alertService';
import { useAuth } from '../context/AuthContext';
import { fetchSiteSettings } from '../services/settingsService';
import { toggleSpotifyLike } from '../services/settingsService';
import '../components/posts/PostCard.css'; // reusa o CSS do botão de like

function AlertasPage() {
    // 1. Onde vamos guardar os alertas
    const [alerts, setAlerts] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isLoggedIn, user } = useAuth();

    // 2. O 'useEffect' corre quando a página carrega
    useEffect(() => {
        const getPageData = async () => {
            setLoading(true);
            try {
                // Pedimos os dois em "paralelo"
                const alertsPromise = fetchPublicAlerts();
                const settingsPromise = fetchSiteSettings();

                // Esperamos que ambos terminem
                const alertsData = await alertsPromise;
                const settingsData = await settingsPromise;

                // Guardamos os dados (com um "fallback" para os alertas)
                setAlerts(alertsData || []);
                setSettings(settingsData);

            } catch (error) {
                // Se algo falhar, registamos o erro
                console.error("Erro ao carregar dados da Página de Alertas:", error);
            } finally {
                // O 'finally' GARANTE que isto corre, mesmo que haja um erro
                setLoading(false);
            }
        };

        getPageData();
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

    const handleSpotifyLike = async () => {
        if (!isLoggedIn) return;

        const updatedSettings = await toggleSpotifyLike();

        if (updatedSettings) {
            setSettings(updatedSettings);
        }
    };

    // 3. A estrutura (JSX) da página
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Alertas de Episódios</h1>

            {loading && <p>A carregar alertas...</p>}

            {!loading && settings && settings.spotifyIframe && (
                <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#000' }}>{settings.spotifyTitle}</h2>
                    <div
                        dangerouslySetInnerHTML={{ __html: settings.spotifyIframe }}
                    />
                    <div className="post-stats" style={{ marginTop: '1rem', textAlign: 'left', paddingLeft: '1rem' }}>
                        <button
                            onClick={handleSpotifyLike}
                            disabled={!isLoggedIn}
                            className={`like-button ${settings.likes?.includes(user?._id) ? 'liked' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                        >
                            <span></span> {settings.likes?.length || 0} Likes
                        </button>
                    </div>
                </section>
            )}

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
                                    backgroundColor: '#333', // Fundo cinzento-escuro
                                    color: '#fff', // <-- Letras brancas
                                    border: '1px solid #444',
                                    padding: '1.5rem',
                                    borderRadius: '8px'
                                }}
                            >
                                <p style={{
                                    fontSize: '1.2rem',
                                    margin: 0,
                                    fontWeight: 'bold' // Título a negrito
                                }}>
                                    {alert.mensagem}
                                </p>

                                <small style={{ color: '#ccc' }}>
                                    Publicado em: {new Date(alert.createdAt).toLocaleString('pt-PT')}
                                </small>

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