import api from './api';

// ---- Função para CRIAR um Comentário (ou Resposta) ----
export const createComment = async (postId, texto, parentCommentId = null) => {
    try {
        // O backend espera 'texto' e (opcionalmente) 'parentCommentId'
        const response = await api.post(`/posts/${postId}/comments`, {
            texto,
            parentCommentId, // Se for 'null', o backend sabe que é um comentário de topo
        });

        if (response.data.status === 'success') {
            return response.data.data.comment; // Retorna o NOVO comentário (já populado)
        }
    } catch (err) {
        console.error("Erro ao criar comentário:", err.response?.data?.message || err.message);
        return null;
    }
};

// ---- Função para APAGAR um Comentário (Rota Protegida) ----
export const deleteComment = async (postId, commentId) => {
    try {
        await api.delete(`/posts/${postId}/comments/${commentId}`);

        // Se a API não der erro (ex: 401), o delete teve sucesso
        return true;
    } catch (err) {
        console.error("Erro ao apagar comentário:", err.response?.data?.message || err.message);
        return false;
    }
};

// ---- Função para ir buscar Respostas (Rota Pública) ----
export const fetchReplies = async (commentId) => {
    try {
        const response = await api.get(`/comments/${commentId}/replies`);

        if (response.data.status === 'success') {
            return response.data.data.replies;
        } else {
            return [];
        }
    } catch (err) {
        console.error("Erro ao buscar respostas:", err.message);
        return [];
    }
};