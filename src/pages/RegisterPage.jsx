import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Form.css';

function RegisterPage() {
    // 1. Estados para os campos
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Verifica se as passwords coincidem ANTES de chamar o backend
        if (password !== confirmPassword) {
            setError('As passwords não coincidem.');
            return; // Para a submissão
        }
        // ---------------------------------

        try {
            // (O 'register' continua a enviar só uma password, o que está correto)
            const result = await register(nome, email, password);

            if (result === true) {
                navigate('/');
            } else {
                setError(result);
            }
        } catch (err) {
            setError('Ocorreu um erro. Tente novamente.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Criar Conta</h2>

                {error && <p className="form-error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="3"
                        required
                    />
                </div>

                {/* ---- 3. CAMPO DE INPUT ---- */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {/* ---------------------------------- */}

                <button type="submit" className="form-button">Registar</button>
            </form>
        </div>
    );
}

export default RegisterPage;