import api from './api';

// ---- Função para ir buscar Utilizadores (com paginação) ----
export const fetchUsers = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);

        if (response.data.status === 'success') {
            return response.data.data; // Retorna o objeto { users, totalPages, currentPage }
        }
    } catch (err) {
        console.error("Erro ao buscar utilizadores:", err.message);
        return { users: [], totalPages: 0, currentPage: 1 };
    }
};

// ---- Função para ATUALIZAR A ROLE de um User ----
export const updateUserRole = async (userId, role) => {
    try {
        const response = await api.patch(`/users/${userId}`, { role });

        if (response.data.status === 'success') {
            return response.data.data.user; // Retorna o user atualizado
        }
    } catch (err) {
        console.error("Erro ao atualizar role:", err.response?.data?.message || err.message);
        return null;
    }
};

// ---- Função para APAGAR um User ----
export const deleteUser = async (userId) => {
    try {
        await api.delete(`/users/${userId}`);
        return true;
    } catch (err) {
        console.error("Erro ao apagar utilizador:", err.response?.data?.message || err.message);
        return false;
    }
};