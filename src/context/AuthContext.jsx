import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

function AuthProvider({ children }) {

    // --- 1. O ESTADO INICIAL ---
    // o estado inicial TENTA ler do localStorage
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );

    // --- 2. CONFIGURAR O AXIOS AO CARREGAR ---
    // Este useEffect corre UMA VEZ quando a app arranca
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Se temos um token, diz ao 'api.js' para o usar como "default"
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []); // O array vazio `[]` garante que isto só corre 1 vez

    // --- 3. FUNÇÃO DE LOGIN ---
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            if (response.data.status === 'success') {
                const { token, data } = response.data;

                // Guarda no estado
                setToken(token);
                setUser(data.user);

                // Guarda no localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Define o header default do Axios para futuros pedidos
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return true;
            }

        } catch (err) {
            if (err.response) {
                console.error("Falha no login (backend):", err.response.data.message);
            } else if (err.request) {
                console.error("Falha no login (rede):", "O servidor não respondeu. Verifica o CORS.");
            } else {
                console.error("Falha no login (geral):", err.message);
            }
            return false;
        }
    };

    // --- 4. FUNÇÃO DE LOGOUT ---
    const logout = () => {
        // Limpa o estado
        setToken(null);
        setUser(null);

        // Limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Remove o header default do Axios
        delete api.defaults.headers.common['Authorization'];
    };

    // (Função de REGISTO)
    const register = async (nome, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                nome,
                email,
                password,
            });

            if (response.data.status === 'success') {
                // Chama o login, que GUARDA no localStorage
                return await login(email, password);
            }
        } catch (err) {
            let errorMessage = 'Ocorreu um erro. Tente novamente.';

            if (err.response) {
                // Apanha a mensagem amigável que o backend enviou!
                errorMessage = err.response.data.message;
                console.error("Falha no registo (backend):", errorMessage);
            } else if (err.request) {
                errorMessage = 'O servidor não respondeu.';
                console.error("Falha no registo (rede):", errorMessage);
            } else {
                console.error("Falha no registo (geral):", err.message);
            }

            // Em vez de devolver 'false', devolve a MENSAGEM de erro
            return errorMessage;
        }
    };

    // --- 5. O "FORNECEDOR" ---
    return (
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            register,
            isLoggedIn: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// O 'useAuth' (Hook)
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };