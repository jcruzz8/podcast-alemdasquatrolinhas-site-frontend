import api from './api'; // O nosso 'mensageiro' Axios

// ---- Função para ir buscar TODOS os alertas (a rota pública) ----
export const fetchPublicAlerts = async () => {
    try {
        // GET http://localhost:5000/api/alerts
        const response = await api.get('/alerts');

        if (response.data.status === 'success') {
            return response.data.data.alerts; // Retorna o array de alertas
        } else {
            return [];
        }
    } catch (err) {
        console.error("Erro ao buscar alertas:", err.message);
        return [];
    }
};

// ---- Função para dar LIKE/UNLIKE num Alerta (Rota Protegida) ----
export const toggleAlertLike = async (alertId) => {
    try {
        // O token é enviado automaticamente pela 'api'
        const response = await api.post(`/alerts/${alertId}/like`);

        if (response.data.status === 'success') {
            return response.data.data.alert; // Retorna o alerta ATUALIZADO
        }
    } catch (err) {
        console.error("Erro ao dar like no alerta:", err.response?.data?.message || err.message);
        return null;
    }
};

export const createAlert = async (mensagem) => {
    try {
        // O token de Admin é enviado automaticamente pela 'api'
        const response = await api.post('/alerts', { mensagem });

        if (response.data.status === 'success') {
            return response.data.data.alert; // Retorna o novo alerta
        }
    } catch (err) {
        console.error("Erro ao criar alerta:", err.response?.data?.message || err.message);
        return null;
    }
};

export const deleteAlert = async (alertId) => {
    try {
        await api.delete(`/alerts/${alertId}`);

        // Se a API não der erro, o delete teve sucesso
        return true;
    } catch (err) {
        console.error("Erro ao apagar alerta:", err.response?.data?.message || err.message);
        return false;
    }
};