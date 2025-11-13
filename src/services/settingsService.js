import api from './api'; // Importa o seu 'api.js' (que tem o baseURL)

// Função PÚBLICA para ir buscar as settings
export const fetchSiteSettings = async () => {
    try {
        const { data } = await api.get('/settings');
        return data.data; // Retorna o objeto de settings
    } catch (error) {
        console.error('Erro ao buscar as settings:', error);
        return null;
    }
};

// Função de ADMIN para atualizar as settings
export const updateSiteSettings = async (settingsData) => {
    try {
        // 'settingsData' deve ser um objeto, ex: { spotifyTitle, spotifyIframe }
        const { data } = await api.patch('/settings', settingsData);
        return data.data;
    } catch (error) {
        console.error('Erro ao atualizar as settings:', error);
        return null;
    }
};

export const toggleSpotifyLike = async () => {
    try {
        // O backend já sabe quem é o user (através do token/cookie)
        const { data } = await api.patch('/settings/like');
        return data.data; // Devolve o objeto 'settings' atualizado
    } catch (error) {
        // Não mostramos o erro, só o logamos.
        // O frontend (botão) não precisa de saber o "porquê" de ter falhado.
        console.error('Erro ao dar like no Spotify:', error);
        return null;
    }
};