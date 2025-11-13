import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createComment, deleteComment, fetchReplies } from '../../services/commentService';

// --- O COMPONENTE DE FORMULÁRIO (para Responder) ---
// (É um componente separado dentro do mesmo ficheiro para ser mais limpo)
function CommentForm({ postId, parentCommentId = null, onSubmit }) {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const newComment = await createComment(postId, text, parentCommentId);
        if (newComment) {
            onSubmit(newComment); // Diz ao "pai" que um novo comentário foi criado
            setText(''); // Limpa a caixa
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form reply-form">
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva a sua resposta..."
          rows="2"
      />
            <button type="submit">Responder</button>
        </form>
    );
}


// --- O COMPONENTE PRINCIPAL DO COMENTÁRIO ---
function Comment({ comment, postId, onCommentDeleted }) {
    const { user } = useAuth();

    // 2. O estado 'replies' agora começa VAZIO!
    const [replies, setReplies] = useState([]);
    // 3. O 'comment.replies' que vem do backend é só um array de *IDs*
    //    Usamos 'comment.replies.length' para saber a contagem
    const [replyCount, setReplyCount] = useState(comment.replies?.length || 0);

    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);

    // ---- LÓGICA DE APAGAR ----
    const handleDelete = async () => {
        if (!window.confirm("Tem a certeza? Apagar este comentário também apagará todas as suas respostas.")) return;
        const success = await deleteComment(postId, comment._id);
        if (success) {
            onCommentDeleted(comment._id);
        } else {
            alert("Não foi possível apagar o comentário.");
        }
    };

    // ---- LÓGICA DE RESPOSTA (onSubmit) ----
    const handleReplySubmit = (newReply) => {
        setReplies(currentReplies => [...currentReplies, newReply]);
        setReplyCount(count => count + 1);
        setShowReplyForm(false);
        setShowReplies(true); // Garante que as respostas são vistas
    };

    // ---- LÓGICA DE APAGAR RESPOSTA (handleChildDelete) ----
    const handleChildDelete = (deletedReplyId) => {
        setReplies(currentReplies =>
            currentReplies.filter(reply => reply._id !== deletedReplyId)
        );
        setReplyCount(count => count - 1);
    };

    // 4. ---- A NOVA LÓGICA DE "VER RESPOSTAS" ----
    const handleToggleReplies = async () => {
        if (!showReplies) {
            // Se as respostas não estão a ser mostradas, vamos buscá-las
            setShowReplies(true);
            // Se já as fomos buscar antes, 'replies.length' será > 0. Não as vamos buscar de novo.
            if (replies.length === 0 && replyCount > 0) {
                setIsLoadingReplies(true);
                const fetchedReplies = await fetchReplies(comment._id); // <-- A CHAMADA À API
                setReplies(fetchedReplies);
                setIsLoadingReplies(false);
            }
        } else {
            // Se as respostas JÁ estão a ser mostradas, apenas as esconde
            setShowReplies(false);
        }
    };

    const isAuthor = user && user._id === comment.autor?._id;
    const isAdmin = user && user.role === 'admin';

    return (
        <div className="comment-thread">
            <div className="comment">
                <div className="comment-header">
                    <strong>
                        {comment.autor?.nome || 'Autor desconhecido'}

                        {comment.autor?.role === 'admin' && (
                            <span className="admin-tag">Membro do Podcast</span>
                        )}
                    </strong>
                    {(isAuthor || isAdmin) && (
                        <button onClick={handleDelete} className="delete-comment-btn">
                            Apagar
                        </button>
                    )}
                </div>
                <p>{comment.texto}</p>
                <div className="comment-actions">
                    {user && (
                        <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-btn">
                            {showReplyForm ? 'Cancelar' : 'Responder'}
                        </button>
                    )}

                    {replyCount > 0 && (
                        <button onClick={handleToggleReplies} className="reply-btn">
                            {showReplies
                                ? 'Esconder Respostas'
                                // Mostra a contagem real, que vem dos IDs
                                : `Ver ${replyCount} ${replyCount > 1 ? 'Respostas' : 'Resposta'}`
                            }
                        </button>
                    )}
                </div>
            </div>

            {showReplyForm && (
                <CommentForm
                    postId={postId}
                    parentCommentId={comment._id}
                    onSubmit={handleReplySubmit}
                />
            )}

            {/* ---- A RECURSÃO ---- */}
            {/* Mostra 'Loading...' ou as respostas */}
            {showReplies && (
                <div className="comment-replies">
                    {isLoadingReplies && <p>A carregar respostas...</p>}

                    {!isLoadingReplies && replies.length > 0 && replies.map(reply => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            postId={postId}
                            onCommentDeleted={handleChildDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;