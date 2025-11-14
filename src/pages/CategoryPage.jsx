import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostsByCategory } from '../services/postService';
import MiniPostCard from '../components/posts/MiniPostCard';
import './NoticiasPage.css'; // Vamos reutilizar o CSS da grelha

function CategoryPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryName } = useParams(); // Apanha o "Futebol" do URL

    useEffect(() => {
        // Função para ir buscar os dados
        const getPosts = async () => {
            setLoading(true);
            // Chama a nova função do nosso service
            const postsData = await fetchPostsByCategory(categoryName);
            setPosts(postsData);
            setLoading(false);
        };

        getPosts();
    }, [categoryName]); // Corre isto sempre que a categoria no URL mudar

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Link para voltar */}
            <Link
                to="/noticias"
                style={{
                    backgroundColor: '#fdd835', color: '#333',
                    padding: '0.6rem 1rem', borderRadius: '4px',
                    textDecoration: 'none', fontWeight: 'bold',
                    display: 'inline-block', marginBottom: '2rem'
                }}
            >
                &larr; Voltar a Todas as Notícias
            </Link>

            {/* Título da Página */}
            <h1 style={{ borderBottom: '2px solid #fdd835', paddingBottom: '0.5rem' }}>
                {categoryName}
            </h1>

            {loading && <p>A carregar notícias...</p>}

            {!loading && posts.length === 0 && (
                <p>Ainda não há notícias nesta categoria.</p>
            )}

            {/* A Grelha de 3 Colunas (reutilizada) */}
            {!loading && posts.length > 0 && (
                <div className="noticias-grid">
                    {posts.map(post => (
                        <MiniPostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryPage;