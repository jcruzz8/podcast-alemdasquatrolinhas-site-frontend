import api from './api';

// ---- Função para ir buscar as Estatísticas (Rota de Admin) ----
export const fetchSiteStats = async () => {
    try {
        // O token de Admin é enviado automaticamente
        const response = await api.get('/stats');

        if (response.data.status === 'success') {
            return response.data.data; // Retorna o objeto { totalUsers, totalPosts, ... }
        } else {
            return null;
        }
    } catch (err) {
        console.error("Erro ao buscar estatísticas:", err.message);
        return null;
    }
};

// ---- Função para ir buscar os dados do Gráfico (Rota de Admin) ----
/*export const fetchMonthlyViews = async () => {
    try {
        const response = await api.get('/stats/views-monthly');
        if (response.data.status === 'success') {
            return response.data.data.chartData;
        }
        return [];
    } catch (err) {
        console.error("Erro ao buscar dados do gráfico mensal:", err.message);
        return [];
    }
};
*/

/*
// ---- Função para ir buscar os dados do Gráfico ANUAL ----
export const fetchYearlyViews = async () => {
    try {
        const response = await api.get('/stats/views-yearly');
        if (response.data.status === 'success') {
            return response.data.data.chartData;
        }
        return [];
    } catch (err) {
        console.error("Erro ao buscar dados do gráfico anual:", err.message);
        return [];
    }
};
*/

export const fetchDailyViews = async () => {
    try {
        const response = await api.get('/stats/views-daily');
        if (response.data.status === 'success') {
            return response.data.data.chartData;
        }
        return [];
    } catch (err) {
        console.error("Erro ao buscar dados do gráfico diário:", err.message);
        return [];
    }
};