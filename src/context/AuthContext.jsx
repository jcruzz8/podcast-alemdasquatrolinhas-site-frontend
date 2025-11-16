import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// --- FUNÇÃO DE SEGURANÇA (NOVA) ---
// Isto lê o 'user' do localStorage de forma segura e limpa dados "partidos"
const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');

    // Se não houver user, ou se o user for a string "undefined" (um bug comum)
    if (!storedUser || storedUser === "undefined") {
        localStorage.removeItem('user'); // Limpa o lixo
        localStorage.removeItem('token'); // E o token, por segurança
        return null;
    }

    // Tenta fazer o parse. Se falhar (JSON inválido), limpa e devolve null
    try {
        return JSON.parse(storedUser);
    } catch (e) {
        console.error("Erro ao fazer parse do user no localStorage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
}


function AuthProvider({ children }) {

    // --- 1. O ESTADO INICIAL ---
    const [token, setToken] = useState(null); // Começa como null
    const [user, setUser] = useState(null);   // Começa como null

    // Um estado para sabermos se já lemos o localStorage
    const [authLoading, setAuthLoading] = useState(true);

    // --- 2. CONFIGURAR O AXIOS E LER O localStorage ---
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
            // Se temos dados, diz ao 'api.js' para os usar
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // E define o estado
            setToken(storedToken);
            setUser(storedUser);
        }

        // Terminou de carregar (mesmo que não tenha encontrado nada)
        setAuthLoading(false);

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

                setToken(token);
                setUser(data.user);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return true;
            }
        } catch (err) {
            console.error("Falha no login:", err.message);
            return false;
        }
    };

    // --- 4. FUNÇÃO DE LOGOUT ---
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
                return await login(email, password);
            }
        } catch (err) {
            let errorMessage = 'Ocorreu um erro. Tente novamente.';
            if (err.response) {
                errorMessage = err.response.data.message;
            } else if (err.request) {
                errorMessage = 'O servidor não respondeu.';
            }
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
            isLoggedIn: !!token,
            authLoading
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