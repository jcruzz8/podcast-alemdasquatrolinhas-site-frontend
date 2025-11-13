import api from './api'; // O nosso 'mensageiro' Axios

// ---- Função para ir buscar TODAS as sondagens (a rota pública) ----
export const fetchPublicPolls = async () => {
    try {
        const response = await api.get('/polls');

        if (response.data.status === 'success') {
            return response.data.data.polls; // Retorna o array de sondagens
        } else {
            return [];
        }
    } catch (err) {
        console.error("Erro ao buscar sondagens:", err.message);
        return [];
    }
};

export const voteOnPoll = async (pollId, optionId) => {
    try {
        // O token é enviado automaticamente pelo 'api' (graças ao AuthContext)
        const response = await api.post(`/polls/${pollId}/vote`, {
            optionId, // Envia o ID da opção no corpo
        });

        if (response.data.status === 'success') {
            // Retorna a SONDAGEM ATUALIZADA (com os novos votos)
            return response.data.data.poll;
        }
    } catch (err) {
        // O backend já envia "Já votou nesta sondagem." se for o caso
        console.error("Erro ao votar:", err.response?.data?.message || err.message);
        return null; // Retorna null em caso de erro
    }
};

export const createPoll = async (pollData) => {
    try {
        // O token de Admin é enviado automaticamente
        const response = await api.post('/polls', pollData);

        if (response.data.status === 'success') {
            return response.data.data.poll; // Retorna a nova sondagem
        }
    } catch (err) {
        console.error("Erro ao criar sondagem:", err.response?.data?.message || err.message);
        return null;
    }
};

export const deletePoll = async (pollId) => {
    try {
        await api.delete(`/polls/${pollId}`);

        // Se a API não der erro, o delete teve sucesso
        return true;
    } catch (err) {
        console.error("Erro ao apagar sondagem:", err.response?.data?.message || err.message);
        return false;
    }
};
