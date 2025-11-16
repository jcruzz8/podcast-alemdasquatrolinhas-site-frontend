import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // 'useParams' para ler o ID do URL
import { fetchPostById, deletePost } from '../services/postService';
import PostCard from '../components/posts/PostCard'; // Vamos reutilizar o nosso PostCard!
import { useAuth } from '../context/AuthContext';
import '../components/admin/ManagePosts.css';

function PostDetailPage() {
    // 1. O estado para guardar o post que vamos buscar
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. 'useParams' dá-nos o ID do post que está no URL
    const { postId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

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

    const handleDelete = async () => {
        if (window.confirm("Tem a certeza que quer apagar este post? Esta ação é irreversível e apagará todos os comentários associados.")) {
            const success = await deletePost(postId);
            if (success) {
                alert('Post apagado com sucesso.');
                navigate('/noticias'); // Envia o admin de volta para a lista
            } else {
                alert('Erro ao apagar o post.');
            }
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between', // Põe um de cada lado
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                {/* Botão "Voltar" (para toda a gente) */}
                <Link
                    to="/noticias"
                    style={{
                        backgroundColor: '#fdd835',
                        color: '#333',
                        padding: '0.6rem 1rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    &larr; Voltar às Notícias
                </Link>

                {/* Botões de Admin (só para admins) */}
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* O seu botão de Editar (agora usa className) */}
                        <Link
                            to={`/admin/edit-post/${postId}`}
                            className="edit-btn" // Reutiliza o estilo de admin
                        >
                            Editar Publicação 📝
                        </Link>
                        {/* O NOVO botão de Apagar */}
                        <button
                            onClick={handleDelete}
                            className="delete-btn" // Reutiliza o estilo de admin
                        >
                            Apagar 🗑️
                        </button>
                    </div>
                )}
            </div>

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