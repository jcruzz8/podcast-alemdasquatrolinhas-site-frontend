import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { togglePostLike } from '../../services/postService';
import { createComment } from '../../services/commentService';

// 1. Importa o novo componente
import Comment from './Comment';

import './PostCard.css';
import '../common/RichTextEditor.css';

function PostCard({ post: initialPost, onPostUpdate, isDetailPage = false }) {
    const [post, setPost] = useState(initialPost);
    // O 'commentText' agora é SÓ para comentários de topo
    const [commentText, setCommentText] = useState('');

    const { isLoggedIn, user } = useAuth();

    // ---- LÓGICA DE LIKE ----
    const handleLike = async () => {
        if (!isLoggedIn) return alert('Precisa de estar logado para dar like!');
        const updatedPost = await togglePostLike(post._id);
        if (updatedPost) {
            setPost(updatedPost);
            onPostUpdate(updatedPost);
        }
    };

    // ---- LÓGICA DE APAGAR COMENTÁRIO ----
    // A lógica de apagar foi para o <Comment.jsx>
    // Esta função agora serve para atualizar o ESTADO do PostCard
    // quando um comentário de topo é apagado
    const handleTopLevelDelete = (deletedCommentId) => {
        const updatedPost = {
            ...post,
            comentarios: post.comentarios.filter(c => c._id !== deletedCommentId)
        };
        setPost(updatedPost);
        onPostUpdate(updatedPost);
    };

    // ---- LÓGICA DE COMENTAR (Formulário Principal) ----
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        // Chama 'createComment' com 'parentCommentId' como null (ou não o passa)
        const newComment = await createComment(post._id, commentText, null);

        if (newComment) {
            // Adiciona o novo comentário (de topo) à lista
            const updatedPost = {
                ...post,
                comentarios: [...post.comentarios, newComment]
            };
            setPost(updatedPost);
            onPostUpdate(updatedPost);
            setCommentText('');
        }
    };

    const userHasLiked = post.likes?.includes(user?._id);

    const displayDate = post.dataAgendada || post.createdAt;

    const formattedDate = new Date(displayDate).toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <article className={`post-card ${isDetailPage ? 'dark-mode' : ''}`}>
            <header>
                <h2>{post.titulo}</h2>
                {post.subtitulo && (
                    <h3 style={{
                        fontSize: '1rem',
                        color: '#D3AF37',
                        fontWeight: 'normal',
                        margin: '-0.5rem 0 1rem 0'
                    }}>
                        {post.subtitulo}
                    </h3>
                )}
                <p className="post-meta">
                    Por {post.autor.nome} em {formattedDate}
                </p>
            </header>

            <img src={post.foto} alt={post.titulo} className="post-image" />

            {post.fotoFonte && (
                <p style={{
                    fontSize: '0.8rem',
                    color: '#fdd835',
                    fontStyle: 'italic',
                    margin: '0.25rem 0 1rem 0',
                    padding: '0 1.5rem' // (Para alinhar com o padding do post-content)
                }}>
                    Fonte: {post.fotoFonte}
                </p>
            )}

            <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.descricao }}
            />

            <footer className="post-footer">
                <div className="post-stats">
                    <button
                        onClick={handleLike}
                        disabled={!isLoggedIn}
                        className={`like-button ${userHasLiked ? 'liked' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                    >
                        <span></span> {post.likes?.length || 0} Likes
                    </button>
                </div>

                {/* ---- SECÇÃO DE COMENTÁRIOS ---- */}
                <div className="post-comments">
                    <h3>Comentários ({post.comentarios?.length || 0})</h3>

                    {/* Formulário Principal (só para logados) */}
                    {isLoggedIn && (
                        <form onSubmit={handleCommentSubmit} className={`comment-form ${isDetailPage ? 'dark-mode' : ''}`}>
              <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva o seu comentário..."
                  rows="2"
              />
                            <button type="submit">Comentar</button>
                        </form>
                    )}

                    {/* Lista de Comentários (Agora usa o <Comment />) */}
                    <div className="comment-list">
                        {post.comentarios
                            ?.filter(comment => comment) // Filtra nulos
                            .map(comment => (
                                // Renderiza o componente de comentário
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    postId={post._id}
                                    onCommentDeleted={handleTopLevelDelete} // Passa a função
                                />
                            ))}
                        {post.comentarios?.length === 0 && <p className="empty-comments-message">Seja o primeiro a comentar!</p>}
                    </div>
                </div>
            </footer>
        </article>
    );
}

export default PostCard;