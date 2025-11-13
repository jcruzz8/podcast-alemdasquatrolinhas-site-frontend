import React, { useState, useEffect } from 'react';
// 1. Importa as funções de "ler" (público) e "apagar" (admin)
import { fetchPublicPolls, deletePoll } from '../../services/pollService';
import './ManagePosts.css'; // 2. Reutiliza o CSS da tabela

function ManagePolls() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // 3. Vai buscar todas as sondagens
    useEffect(() => {
        const loadPolls = async () => {
            setLoading(true);
            const pollsData = await fetchPublicPolls();
            setPolls(pollsData);
            setLoading(false);
        };
        loadPolls();
    }, []);

    // 4. Lógica para apagar a sondagem
    const handleDelete = async (pollId) => {
        if (window.confirm("Tem a certeza que quer apagar esta sondagem?")) {
            setFeedback(null);
            const success = await deletePoll(pollId);

            if (success) {
                // Remove a sondagem da lista na UI
                setPolls(prevPolls => prevPolls.filter(p => p._id !== pollId));
                setFeedback({ tipo: 'sucesso', texto: 'Sondagem apagada com sucesso.' });
            } else {
                setFeedback({ tipo: 'erro', texto: 'Erro ao apagar a sondagem.' });
            }
        }
    };

    if (loading) {
        return <p>A carregar sondagens...</p>;
    }

    return (
        <div className="manage-list-container">
            {feedback && (
                <p className={feedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                    {feedback.texto}
                </p>
            )}

            {polls.length === 0 ? (
                <p>Não há sondagens para gerir.</p>
            ) : (
                // 5. Reutiliza o estilo da tabela
                <table className="manage-table">
                    <thead>
                    <tr>
                        <th>Pergunta</th>
                        <th>Estado</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {polls.map(poll => {
                        // Define o estado da sondagem
                        const now = new Date();
                        let status = <span className="status-eternal">Eterna</span>;
                        if (poll.prazo) {
                            if (now > new Date(poll.prazo)) {
                                status = <span className="status-expired">Antiga</span>;
                            } else {
                                status = <span className="status-active">Ativa</span>;
                            }
                        }

                        return (
                            <tr key={poll._id}>
                                <td>{poll.pergunta}</td>
                                <td>{status}</td>
                                <td className="actions-cell">
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(poll._id)}
                                    >
                                        Apagar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManagePolls;