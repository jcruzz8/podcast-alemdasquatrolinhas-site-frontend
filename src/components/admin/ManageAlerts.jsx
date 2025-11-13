import React, { useState, useEffect } from 'react';
// 1. Importa as funções de "ler" (público) e "apagar" (admin)
import { fetchPublicAlerts, deleteAlert } from '../../services/alertService';
import './ManagePosts.css'; // 2. Vamos REUTILIZAR o CSS da tabela de posts

function ManageAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // 3. Vai buscar todos os alertas públicos
    useEffect(() => {
        const loadAlerts = async () => {
            setLoading(true);
            const alertsData = await fetchPublicAlerts();
            setAlerts(alertsData);
            setLoading(false);
        };
        loadAlerts();
    }, []);

    // 4. Lógica para apagar o alerta
    const handleDelete = async (alertId) => {
        if (window.confirm("Tem a certeza que quer apagar este alerta?")) {
            setFeedback(null);
            const success = await deleteAlert(alertId);

            if (success) {
                // Remove o alerta da lista na UI
                setAlerts(prevAlerts => prevAlerts.filter(a => a._id !== alertId));
                setFeedback({ tipo: 'sucesso', texto: 'Alerta apagado com sucesso.' });
            } else {
                setFeedback({ tipo: 'erro', texto: 'Erro ao apagar o alerta.' });
            }
        }
    };

    if (loading) {
        return <p>A carregar alertas...</p>;
    }

    return (
        <div className="manage-list-container">
            {feedback && (
                <p className={feedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                    {feedback.texto}
                </p>
            )}

            {alerts.length === 0 ? (
                <p>Não há alertas para gerir.</p>
            ) : (
                // 5. Reutiliza o estilo da tabela
                <table className="manage-table">
                    <thead>
                    <tr>
                        <th>Mensagem</th>
                        <th>Criado Em</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {alerts.map(alert => (
                        <tr key={alert._id}>
                            <td>{alert.mensagem}</td>
                            <td>{new Date(alert.createdAt).toLocaleString('pt-PT')}</td>
                            <td className="actions-cell">
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(alert._id)}
                                >
                                    Apagar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageAlerts;