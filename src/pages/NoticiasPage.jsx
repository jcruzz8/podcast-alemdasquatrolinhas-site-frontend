import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicPosts } from '../services/postService';
// 1. Importa o nosso componente de carrossel (em vez do Slider)
import PostsCarousel from '../components/posts/PostsCarousel';
import MiniPostCard from '../components/posts/MiniPostCard'; // (Ainda precisamos disto para uma verificação)
import './NoticiasPage.css';

// As tuas categorias
const categories = [
    'Futebol',
    'Modalidades',
    'NBA',
    'UFC',
    'Formula1',
    'Recordes Além das Quatro Linhas',
    'Hora do Treino'
];

function NoticiasPage() {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            const postsData = await fetchPublicPosts();
            setAllPosts(postsData);
            setLoading(false);
        };
        getPosts();
    }, []);

    const postsByCategory = categories.reduce((acc, category) => {
        // Filtra os posts para esta categoria
        const postsForCategory = allPosts.filter(
            post => post.categoria === category
        );

        // Só adiciona a categoria se ela tiver posts
        if (postsForCategory.length > 0) {
            acc[category] = postsForCategory;
        }
        return acc;
    }, {}); // O 'acc' é o nosso objeto final ex: { Futebol: [...], NBA: [...] }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Notícias</h1>

            {loading && <p>A carregar notícias...</p>}

            {!loading && allPosts.length === 0 && (
                <p>Ainda não há notícias publicadas.</p>
            )}

            {!loading && allPosts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Faz o loop pelas chaves do nosso objeto (ex: "Futebol", "NBA") */}
                    {Object.keys(postsByCategory).map(category => {

                        const postsForCategory = postsByCategory[category];

                        // ---- A LÓGICA DE LIMITE ----
                        const postsToShow = postsForCategory.slice(0, 6); // Pega só nos 6 primeiros
                        const hasMore = postsForCategory.length > 6;     // Verifica se há mais

                        return (
                            <section key={category}>
                                <h2 style={{ borderBottom: '2px solid #fdd835', paddingBottom: '0.5rem' }}>
                                    {category}
                                </h2>

                                {/* 1. A GRELHA (usando o nosso novo CSS) */}
                                <div className="noticias-grid">
                                    {postsToShow.map(post => (
                                        <MiniPostCard key={post._id} post={post} />
                                    ))}
                                </div>

                                {/* 2. O BOTÃO "VER MAIS" (só aparece se houver mais de 6) */}
                                {hasMore && (
                                    <Link
                                        to={`/noticias/categoria/${category}`} // O link para a nossa nova página
                                        style={{
                                            display: 'block',
                                            marginTop: '1.5rem',
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            color: '#333'
                                        }}
                                    >
                                        Ver Mais Notícias de {category} &rarr;
                                    </Link>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NoticiasPage;