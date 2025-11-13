import React, { useState, useEffect } from 'react';
import { fetchAdminPosts, deletePost } from '../../services/postService';
import { Link } from 'react-router-dom';
import './ManagePosts.css';

function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // 1. Vai buscar todos os posts (incluindo agendados)
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const postsData = await fetchAdminPosts();
            setPosts(postsData);
            setLoading(false);
        };
        loadPosts();
    }, []);

    // 2. Lógica para apagar o post
    const handleDelete = async (postId) => {
        if (window.confirm("Tem a certeza que quer apagar este post? Esta ação é irreversível e apagará todos os comentários associados.")) {
            setFeedback(null);
            const success = await deletePost(postId);

            if (success) {
                // Remove o post da lista na UI instantaneamente
                setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
                setFeedback({ tipo: 'sucesso', texto: 'Post apagado com sucesso.' });
            } else {
                setFeedback({ tipo: 'erro', texto: 'Erro ao apagar o post.' });
            }
        }
    };

    if (loading) {
        return <p>A carregar posts...</p>;
    }

    return (
        <div className="manage-list-container">
            {/* Feedback de sucesso/erro */}
            {feedback && (
                <p className={feedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                    {feedback.texto}
                </p>
            )}

            {posts.length === 0 ? (
                <p>Não há posts para gerir.</p>
            ) : (
                <table className="manage-table">
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Categoria</th>
                        <th>Estado</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map(post => {
                        // Verifica se o post está agendado
                        const isScheduled = new Date(post.dataAgendada) > new Date();
                        return (
                            <tr key={post._id}>
                                <td>{post.titulo}</td>
                                <td>{post.categoria}</td>
                                <td>
                                    {isScheduled ?
                                        <span className="status-scheduled">Agendado</span> :
                                        <span className="status-published">Publicado</span>
                                    }
                                </td>
                                <td className="actions-cell">
                                    <Link
                                        to={`/admin/edit-post/${post._id}`}
                                        className="edit-btn"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(post._id)}
                                    >
                                        Apagar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManagePosts;