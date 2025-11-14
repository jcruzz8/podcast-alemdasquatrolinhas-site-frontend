import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Importa todos os "mensageiros" de que precisamos
import { fetchPublicAlerts } from '../services/alertService';
import { fetchPublicPosts } from '../services/postService';
import { fetchPublicPolls } from '../services/pollService';
import PostsCarousel from '../components/posts/PostsCarousel';
import SondagemCard from '../components/common/SondagemCard';
import { useAuth } from '../context/AuthContext'; // Para saber quem está logado
import { toggleAlertLike } from '../services/alertService'; // A função de dar like
import { fetchSiteSettings } from '../services/settingsService';
import { toggleSpotifyLike } from '../services/settingsService';
import '../components/posts/PostCard.css'; // Para o estilo do botão de like

function HomePage() {
    // 2. Estados para guardar os dados
    const [latestAlert, setLatestAlert] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const [activePoll, setActivePoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useAuth(); // Acede aos dados de login
    const [settings, setSettings] = useState(null);

    // 3. 'useEffect' para carregar tudo quando a página abre
    useEffect(() => {
        const loadHomePageData = async () => {
            setLoading(true);
            try {
                const [
                    alertsResult,
                    postsResult,
                    pollsResult,
                    settingsResult
                ] = await Promise.allSettled([
                    fetchPublicAlerts(),
                    fetchPublicPosts(),
                    fetchPublicPolls(),
                    fetchSiteSettings()
                ]);

                // --- Lógica de Filtragem ---

                // Alerta Mais Recente:
                if (alertsResult.status === 'fulfilled' && alertsResult.value.length > 0) {
                    setLatestAlert(alertsResult.value[0]);
                } else if (alertsResult.status === 'rejected') {
                    console.error("Falha ao carregar Alertas:", alertsResult.reason);
                }

                // 4 Posts Mais Recentes:
                if (postsResult.status === 'fulfilled') {
                    setRecentPosts(postsResult.value.slice(0, 4));
                } else if (postsResult.status === 'rejected') {
                    console.error("Falha ao carregar Posts:", postsResult.reason);
                }

                // Sondagem "em decorrer":
                if (pollsResult.status === 'fulfilled') {
                    const now = new Date();
                    const ongoingPoll = pollsResult.value.find(poll => {
                        const prazo = poll.prazo ? new Date(poll.prazo) : null;
                        if (!prazo) return true; // Se for "Eterna", está ativa
                        if (prazo && now < prazo) return true; // Se for "Ativa", está ativa
                        return false; // Se for "Antiga", ignora
                    });
                    setActivePoll(ongoingPoll || null);
                } else if (pollsResult.status === 'rejected') {
                    console.error("Falha ao carregar Sondagens:", pollsResult.reason);
                }

                // Settings do Spotify:
                if (settingsResult.status === 'fulfilled') {
                    setSettings(settingsResult.value);
                } else if (settingsResult.status === 'rejected') {
                    console.error("Falha ao carregar Settings:", settingsResult.reason);
                }

            } catch (error) {
                // Este 'catch' é para erros inesperados
                console.error("Erro geral ao carregar Homepage:", error);
            } finally {
                setLoading(false); // Corre sempre
            }
        };

        loadHomePageData();
    }, []); // [] = Corre só uma vez

    const handlePollUpdate = (updatedPoll) => {
        setActivePoll(updatedPoll);
    };

    const handleAlertLike = async (alertId) => {
        if (!isLoggedIn) return;

        const updatedAlert = await toggleAlertLike(alertId);

        if (updatedAlert) {
            // Atualiza o estado do 'latestAlert' instantaneamente
            setLatestAlert(updatedAlert);
        }
    };

    const handleSpotifyLike = async () => {
        if (!isLoggedIn) return; // Segurança

        const updatedSettings = await toggleSpotifyLike();

        if (updatedSettings) {
            // Atualiza o estado das settings instantaneamente
            setSettings(updatedSettings);
        }
    };

    // 5. O "esqueleto" da tua nova Homepage
    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            {loading && <p>A carregar...</p>}

            {/* ---- Bloco do Spotify ---- */}
            {!loading && settings && settings.spotifyIframe && (
                <section style={{ marginBottom: '2rem', textAlign: 'center' }}>

                    <h2 style={{ fontSize: '1.5rem', color: '#000' }}>{settings.spotifyTitle}</h2>

                    {/* AVISO DE SEGURANÇA:
                      Usamos 'dangerouslySetInnerHTML' porque o Spotify nos dá HTML (um <iframe>).
                      Isto é seguro porque SÓ NÓS (Admins) é que controlamos este código.
                    */}
                    <div
                        dangerouslySetInnerHTML={{ __html: settings.spotifyIframe }}
                        className="spotify-embed-container" // Pode usar esta classe para estilizar (ex: margin-top)
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

            {/* ---- 1. Bloco do Alerta Mais Recente ---- */}
            {!loading && latestAlert && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2>Alerta Mais Recente</h2>

                    {/* O estilo foi copiado da AlertasPage.jsx */}
                    <div style={{
                        backgroundColor: '#333',
                        color: '#fff',
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
                            {latestAlert.mensagem}
                        </p>
                        <small style={{ color: '#ccc' }}>
                            Publicado em: {new Date(latestAlert.createdAt).toLocaleString('pt-PT')}
                        </small>
                        <div className="post-stats" style={{ marginTop: '1rem' }}>
                            <button
                                onClick={() => handleAlertLike(latestAlert._id)}
                                disabled={!isLoggedIn}
                                className={`like-button ${latestAlert.likes?.includes(user?._id) ? 'liked' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                            >
                                <span></span> {latestAlert.likes?.length || 0} Likes
                            </button>
                        </div>
                    </div>

                    <Link to="/alertas" style={{
                        display: 'block',
                        marginTop: '1.5rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        Ver Mais Alertas &rarr;
                    </Link>
                </section>
            )}

            {/* ---- 2. Bloco das Publicações Recentes ---- */}
            {!loading && recentPosts.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2>Publicações Recentes</h2>

                    {/* Usa o novo componente e passa-lhe os posts */}
                    <PostsCarousel posts={recentPosts} />

                    <Link to="/noticias" style={{
                        display: 'block',
                        marginTop: '1.5rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        Ver Mais Notícias &rarr;
                    </Link>
                </section>
            )}

            {/* ---- 3. Bloco da Sondagem do Momento ---- */}
            {!loading && activePoll && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2>Sondagem do Momento</h2>

                    {/* Usa o nosso componente reutilizável */}
                    <SondagemCard
                        poll={activePoll}
                        onVote={handlePollUpdate}
                    />

                    <Link to="/sondagens" style={{
                        display: 'block',
                        marginTop: '1.5rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        Ver Mais Sondagens &rarr;
                    </Link>
                </section>
            )}

            {!loading && !latestAlert && !activePoll && recentPosts.length === 0 && (
                <p>O nosso site está em construção. Volte em breve!</p>
            )}

        </div>
    );
}

export default HomePage;