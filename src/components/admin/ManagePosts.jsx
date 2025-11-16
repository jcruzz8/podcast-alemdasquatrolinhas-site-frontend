import React, { useState, useEffect } from 'react';
import { fetchAdminPosts, deletePost } from '../../services/postService';
import { Link } from 'react-router-dom';
import './ManagePosts.css';

function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // --- 1. ESTADOS DE PAGINAÇÃO (Copiado do ManageUsers) ---
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // 2. Vai buscar os posts (depende da 'page')
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            // Chama a nova função com a página
            const data = await fetchAdminPosts(page);
            if (data) {
                // Preenche os dois estados
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            }
            setLoading(false);
        };
        loadPosts();
    }, [page]); // <-- Recarrega sempre que a 'page' mudar

    // 3. Lógica para apagar o post (fica igual)
    const handleDelete = async (postId) => {
        if (window.confirm("Tem a certeza que quer apagar este post? Esta ação é irreversível e apagará todos os comentários associados.")) {
            setFeedback(null);
            const success = await deletePost(postId);

            if (success) {
                setFeedback({ tipo: 'sucesso', texto: 'Post apagado com sucesso.' });
                // Atualiza a lista (pode causar um "salto" se for o último da página, mas é simples)
                setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
                // O ideal seria recarregar a página atual, mas isto funciona
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
            {feedback && (
                <p className={feedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                    {feedback.texto}
                </p>
            )}

            {posts.length === 0 ? (
                <p>Não há posts para gerir.</p>
            ) : (
                <> {/* 4. Adiciona Fragmento (para a tabela + botões) */}
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
                        {/* 5. O 'posts.map' agora está correto,
                           porque 'posts' já é o array de 10 */}
                        {posts.map(post => {
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

                    {/* 6. OS BOTÕES DE PAGINAÇÃO (Copiado do ManageUsers) */}
                    <div className="pagination-controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="admin-button"
                            style={{ width: 'auto', marginRight: '1rem' }}
                        >
                            &larr; Página Anterior
                        </button>
                        <span>Página {page} de {totalPages}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="admin-button"
                            style={{ width: 'auto', marginLeft: '1rem' }}
                        >
                            Próxima Página &rarr;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ManagePosts;