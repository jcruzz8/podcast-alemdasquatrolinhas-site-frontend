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
import '../components/posts/PostCard.css'; // Para o estilo do botão de like

function HomePage() {
    // 2. Estados para guardar os dados
    const [latestAlert, setLatestAlert] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const [activePoll, setActivePoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useAuth(); // Acede aos dados de login

    // 3. 'useEffect' para carregar tudo quando a página abre
    useEffect(() => {
        const loadHomePageData = async () => {
            setLoading(true);
            try {
                // 4. Pede os 3 tipos de dados ao mesmo tempo (em paralelo)
                const [alertsData, postsData, pollsData] = await Promise.all([
                    fetchPublicAlerts(),
                    fetchPublicPosts(),
                    fetchPublicPolls()
                ]);

                // --- Lógica de Filtragem ---

                // Alerta Mais Recente:
                // (Os alertas já vêm ordenados por data, por isso pegamos no primeiro)
                if (alertsData.length > 0) {
                    setLatestAlert(alertsData[0]);
                }

                // 4 Posts Mais Recentes:
                // (Os posts já vêm ordenados por data, por isso pegamos nos 4 primeiros)
                setRecentPosts(postsData.slice(0, 4));

                // Sondagem "em decorrer":
                // (Procura a primeira "Ativa" ou "Eterna". Já vêm por data)
                const now = new Date();
                const ongoingPoll = pollsData.find(poll => {
                    const prazo = poll.prazo ? new Date(poll.prazo) : null;
                    if (!prazo) return true; // Se for "Eterna", está ativa
                    if (prazo && now < prazo) return true; // Se for "Ativa", está ativa
                    return false; // Se for "Antiga", ignora
                });
                setActivePoll(ongoingPoll || null); // Define a primeira que encontrar

            } catch (error) {
                console.error("Erro ao carregar dados da Homepage:", error);
            } finally {
                setLoading(false); // Terminou de carregar
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

    // 5. O "esqueleto" da tua nova Homepage
    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            {loading && <p>A carregar...</p>}

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

                    <Link to="/alertas" style={{ display: 'block', marginTop: '1rem', textAlign: 'right' }}>
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

                    <Link to="/noticias" style={{ display: 'block', marginTop: '1rem', textAlign: 'right' }}>
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

                    <Link to="/sondagens" style={{ display: 'block', marginTop: '1rem', textAlign: 'right' }}>
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