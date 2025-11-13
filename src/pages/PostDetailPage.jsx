import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 'useParams' para ler o ID do URL
import { fetchPostById } from '../services/postService';
import PostCard from '../components/posts/PostCard'; // Vamos reutilizar o nosso PostCard!

function PostDetailPage() {
    // 1. O estado para guardar o post que vamos buscar
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. 'useParams' dá-nos o ID do post que está no URL
    const { postId } = useParams();

    // 3. 'useEffect' para ir buscar o post quando a página carrega
    useEffect(() => {
        const getPost = async () => {
            setLoading(true);
            const postData = await fetchPostById(postId);
            setPost(postData);
            setLoading(false);
        };

        getPost();
    }, [postId]); // Corre de novo se o ID do post no URL mudar

    // 4. Função para o PostCard atualizar o seu próprio estado
    // (Ex: quando o user dá like, o PostCard atualiza-se sozinho)
    const handlePostUpdate = (updatedPost) => {
        setPost(updatedPost);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            <Link
                to="/noticias"
                style={{
                    backgroundColor: '#fdd835',
                    color: '#333',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '2rem'
                }}
            >
                &larr; Voltar às Notícias
            </Link>

            {loading && <p>A carregar notícia...</p>}

            {!loading && !post && <p>Notícia não encontrada.</p>}

            {!loading && post && (
                <PostCard
                    post={post}
                    onPostUpdate={handlePostUpdate}
                    // Vamos passar uma "prop" a dizer-lhe para usar o estilo escuro
                    isDetailPage={true}
                />
            )}
        </div>
    );
}

export default PostDetailPage;