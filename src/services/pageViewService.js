import api from './api';

// ---- Função para Registar uma Visualização (Rota Pública) ----
export const recordPageView = async () => {
    try {
        await api.post('/views');
    } catch (err) {
        // Não queremos incomodar o utilizador se isto falhar
        console.error("Erro ao registar visualização:", err.message);
    }
};