import api from './api'; // Importa o nosso 'mensageiro' Axios pré-configurado

// ---- Função para ir buscar TODOS os posts (a rota pública) ----
export const fetchPublicPosts = async () => {
    try {
        // Usa a nossa instância 'api'
        const response = await api.get('/posts');

        if (response.data.status === 'success') {
            return response.data.data.posts; // Retorna o array de posts
        } else {
            return []; // Retorna um array vazio se o status não for 'success'
        }
    } catch (err) {
        console.error("Erro ao buscar posts:", err.message);
        return []; // Retorna um array vazio em caso de erro
    }
};

// ---- Função para dar LIKE/UNLIKE num Post (Rota Protegida) ----
export const togglePostLike = async (postId) => {
    try {
        // O token é enviado automaticamente pelo 'api'
        const response = await api.post(`/posts/${postId}/like`);

        if (response.data.status === 'success') {
            return response.data.data.post; // Retorna o post ATUALIZADO
        }
    } catch (err) {
        console.error("Erro ao dar like:", err.response?.data?.message || err.message);
        return null;
    }
};

// ---- Função para ir buscar UM SÓ Post (pelo ID) ----
export const fetchPostById = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}`);

        if (response.data.status === 'success') {
            return response.data.data.post; // Retorna o objeto do post
        } else {
            return null;
        }
    } catch (err) {
        console.error("Erro ao buscar o post:", err.message);
        return null;
    }
};

export const createPost = async (postData) => {
    try {
        // POST http://localhost:5000/api/posts
        const response = await api.post('/posts', postData, {
            // É crucial dizer ao Axios que isto é um upload de ficheiro
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.status === 'success') {
            return response.data.data.post; // Retorna o post recém-criado
        } else {
            return null;
        }
    } catch (err) {
        console.error("Erro ao criar post:", err.response?.data?.message || err.message);
        return null; // Retorna null em caso de erro
    }
};

export const fetchAdminPosts = async (page = 1) => { // <-- 1. Aceita a 'page'
    try {
        // 2. Envia a 'page' como um "query parameter"
        const response = await api.get(`/posts/admin-all?page=${page}`);

        if (response.data.status === 'success') {
            // 3. Retorna o OBJETO completo (posts E totalPages)
            return response.data.data;
        } else {
            return { posts: [], totalPages: 0 }; // Devolve um objeto vazio
        }
    } catch (err) {
        console.error("Erro ao buscar posts de admin:", err.message);
        return { posts: [], totalPages: 0 };
    }
};

// ---- Função para APAGAR um Post (Rota de Admin) ----
export const deletePost = async (postId) => {
    try {
        await api.delete(`/posts/${postId}`);

        // Se a API não der erro (ex: 404), o delete teve sucesso
        return true;
    } catch (err) {
        console.error("Erro ao apagar post:", err.response?.data?.message || err.message);
        return false;
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await api.patch(`/posts/${postId}`, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.status === 'success') {
            return response.data.data.post; // Retorna o post atualizado
        } else {
            return null;
        }
    } catch (err) {
        console.error("Erro ao atualizar post:", err.response?.data?.message || err.message);
        return null;
    }
};

export const fetchPostsByCategory = async (categoryName) => {
    try {
        const response = await api.get(`/posts/categoria/${categoryName}`);

        if (response.data.status === 'success') {
            return response.data.data.posts; // Retorna o array de posts
        } else {
            return [];
        }
    } catch (err) {
        console.error("Erro ao buscar posts por categoria:", err.message);
        return [];
    }
};