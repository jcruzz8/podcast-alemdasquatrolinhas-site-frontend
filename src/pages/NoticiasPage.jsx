import React, { useState, useEffect } from 'react';
import { fetchPublicPosts } from '../services/postService';
// 1. Importa o nosso componente de carrossel (em vez do Slider)
import PostsCarousel from '../components/posts/PostsCarousel';
import MiniPostCard from '../components/posts/MiniPostCard'; // (Ainda precisamos disto para uma verificação)

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

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Notícias</h1>

            {loading && <p>A carregar notícias...</p>}

            {!loading && allPosts.length === 0 && (
                <p>Ainda não há notícias publicadas.</p>
            )}

            {!loading && allPosts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {categories.map(category => {

                        const postsForCategory = allPosts.filter(
                            post => post.categoria === category
                        );

                        if (postsForCategory.length === 0) {
                            return null;
                        }

                        // 2. Se houver menos de 3 posts, o "centerMode" fica estranho.
                        //    Nesses casos, mostramos só os cartões normais.
                        if (postsForCategory.length < 3) {
                            return (
                                <section key={category}>
                                    <h2 style={{ borderBottom: '2px solid #fdd835', paddingBottom: '0.5rem' }}>
                                        {category}
                                    </h2>
                                    {/* Damos-lhe um "nome" (className) para o CSS encontrar */}
                                    <div className="simple-post-grid">
                                        {postsForCategory.map(post => (
                                            <MiniPostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                </section>
                            );
                        }

                        // 3. Se houver 3 ou mais posts, USA O NOVO CARROSSEL
                        return (
                            <section key={category}>
                                <h2 style={{ borderBottom: '2px solid #fdd835', paddingBottom: '0.5rem' }}>
                                    {category}
                                </h2>
                                {/* 4. Usa o componente de carrossel unificado */}
                                <PostsCarousel posts={postsForCategory} />
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NoticiasPage;