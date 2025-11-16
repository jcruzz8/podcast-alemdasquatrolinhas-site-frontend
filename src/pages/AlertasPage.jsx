import React, { useState, useEffect } from 'react';
import { fetchPublicAlerts, toggleAlertLike } from '../services/alertService';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext'; // Importa o cérebro
import SpotifyEmbed from '../components/common/SpotifyEmbed';
import '../components/posts/PostCard.css'; // reusa o CSS do botão de like

function AlertasPage() {
    // 1. Onde vamos guardar os alertas
    const { playerContent, playerLikes, handleLike: handleSpotifyLike, isLoading: isAudioLoading } = useAudio();
    const { isLoggedIn, user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. O 'useEffect' corre quando a página carrega
    useEffect(() => {
        const getPageData = async () => {
            setLoading(true);
            try {
                const alertsPromise = fetchPublicAlerts();

                // Esperamos que termine
                const alertsData = await alertsPromise;

                // Guardamos os dados (com um "fallback" para os alertas)
                setAlerts(alertsData || []);

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

    const pageIsLoading = loading || isAudioLoading;
    const userHasLikedSpotify = playerLikes.includes(user?._id);
    // 3. A estrutura (JSX) da página
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Alertas de Episódios</h1>

            {loading && <p>A carregar alertas...</p>}

            {/* ---- 4. Bloco do Spotify (ESTÁTICO) ---- */}
            {!pageIsLoading && playerContent && playerContent.iframe && (
                <section style={{ marginBottom: '2rem', textAlign: 'center' }}>

                    <h2 style={{ fontSize: '1.5rem', color: '#000' }}>{playerContent.title}</h2>

                    <SpotifyEmbed iframe={playerContent.iframe} />

                    <div className="post-stats" style={{ marginTop: '1rem', textAlign: 'left', paddingLeft: '1rem' }}>
                        <button
                            onClick={handleSpotifyLike}
                            disabled={!isLoggedIn}
                            className={`like-button ${userHasLikedSpotify ? 'liked' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                        >
                            <span></span> {playerLikes.length || 0} Likes
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