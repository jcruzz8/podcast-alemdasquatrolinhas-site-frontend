import React, { useState } from 'react';
import { voteOnPoll } from '../../services/pollService';
import { useAuth } from '../../context/AuthContext';

function SondagemCard({ poll: initialPoll, onVote }) {
    const [poll, setPoll] = useState(initialPoll);
    const [error, setError] = useState(null);
    const { isLoggedIn, user } = useAuth();

    const handleVote = async (optionId) => {
        setError(null);
        const updatedPoll = await voteOnPoll(poll._id, optionId);
        if (updatedPoll) {
            setPoll(updatedPoll);
            if (onVote) {
                onVote(updatedPoll);
            }
        } else {
            setError("Não foi possível registar o seu voto. (Já votou ou a sondagem expirou?)");
        }
    };

    const hasVoted = poll.votedBy.includes(user?._id);
    const isExpired = poll.prazo && new Date() > new Date(poll.prazo);

    // ---- ESTILOS ATUALIZADOS AQUI ----
    return (
        <div style={{
            backgroundColor: '#333', // Fundo cinzento-escuro
            color: '#fff', // <-- Letras brancas para contraste
            border: '1px solid #444',
            padding: '1.5rem',
            borderRadius: '8px'
        }}>
            <h2 style={{ marginTop: 0 }}>{poll.pergunta}</h2>

            {error && <p style={{ color: '#ff8a8a', fontWeight: 'bold' }}>{error}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {poll.opcoes.map(option => (
                    <div key={option._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span><strong>{option.texto}</strong></span>
                            {/* Cor do texto dos votos */}
                            <span style={{ marginLeft: '1rem', color: '#fdd835' }}>({option.votos} votos)</span>
                        </div>
                        <div>
                            {isLoggedIn && !hasVoted && !isExpired && (
                                <button
                                    onClick={() => handleVote(option._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        backgroundColor: '#fdd835',
                                        color: '#333', // Texto preto para contraste
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Votar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isLoggedIn && hasVoted && (
                <p style={{ color: '#81c784', fontWeight: 'bold', marginTop: '1rem' }}>Obrigado pelo seu voto!</p>
            )}
            {isExpired && (
                <p style={{ color: '#aaa', fontWeight: 'bold', marginTop: '1rem' }}>Sondagem encerrada.</p>
            )}

            <small style={{ marginTop: '1rem', display: 'block', color: '#ccc' }}>
                Publicado em: {new Date(poll.createdAt).toLocaleString('pt-PT')}
                {poll.prazo && <span> | Encerra em: {new Date(poll.prazo).toLocaleString('pt-PT')}</span>}
            </small>
        </div>
    );
}

export default SondagemCard;