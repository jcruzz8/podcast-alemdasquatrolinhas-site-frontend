import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // O nosso "atalho"

// CSS Básico
import './Form.css';

function LoginPage() {
    // 1. Estados para guardar o que o utilizador escreve
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Estado para mensagens de erro

    // 2. Importar as funções que precisamos
    const { login } = useAuth(); // A nossa função de login do Contexto
    const navigate = useNavigate(); // Para redirecionar o utilizador

    // 3. O que acontece quando o utilizador submete o formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o "refresh" da página
        setError(null); // Limpa erros antigos

        try {
            const success = await login(email, password); // Tenta fazer login

            if (success) {
                // SUCESSO! Redireciona para a página principal
                navigate('/');
            } else {
                // FALHA! (O backend devolveu um erro)
                setError('Email ou password incorretos.');
            }
        } catch (err) {
            // Erro de rede ou algo que não estávamos à espera
            setError('Ocorreu um erro. Tente novamente.');
        }
    };

    // 4. A estrutura (JSX) do formulário
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>

                {/* Mostra a mensagem de erro, se existir */}
                {error && <p className="form-error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Atualiza o estado 'email'
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Atualiza o estado 'password'
                        required
                    />
                </div>

                <button type="submit" className="form-button">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;