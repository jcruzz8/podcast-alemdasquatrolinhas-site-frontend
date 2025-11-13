import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext'; // 1. Para sabermos quem SOMOS
import './ManagePosts.css'; // Reutiliza o CSS da tabela

function ManageUsers() {
    const { user: currentUser } = useAuth(); // 2. Apanha o admin logado
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // 3. Estados da Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // 4. Vai buscar os utilizadores
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            const data = await fetchUsers(page);
            if (data) {
                setUsers(data.users);
                setTotalPages(data.totalPages);
            }
            setLoading(false);
        };
        loadUsers();
    }, [page]); // Recarrega sempre que a 'page' mudar

    // 5. Lógica de Apagar
    const handleDelete = async (userId) => {
        if (window.confirm("Tem a certeza? Apagar um utilizador é irreversível.")) {
            setFeedback(null);
            const success = await deleteUser(userId);
            if (success) {
                setFeedback({ tipo: 'sucesso', texto: 'Utilizador apagado.' });
                // Atualiza a lista
                setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
            } else {
                setFeedback({ tipo: 'erro', texto: 'Erro ao apagar utilizador.' });
            }
        }
    };

    // 6. Lógica de Mudar Role
    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'ouvinte' : 'admin';
        if (window.confirm(`Mudar este utilizador para "${newRole}"?`)) {
            setFeedback(null);
            const updatedUser = await updateUserRole(userId, newRole);
            if (updatedUser) {
                setFeedback({ tipo: 'sucesso', texto: 'Role atualizada.' });
                // Atualiza a lista
                setUsers(prevUsers =>
                    prevUsers.map(u => (u._id === userId ? updatedUser : u))
                );
            } else {
                setFeedback({ tipo: 'erro', texto: 'Erro ao atualizar a role.' });
            }
        }
    };

    if (loading) {
        return <p>A carregar utilizadores...</p>;
    }

    return (
        <div className="manage-list-container">
            {feedback && (
                <p className={feedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                    {feedback.texto}
                </p>
            )}

            {users.length === 0 ? (
                <p>Não há utilizadores para gerir.</p>
            ) : (
                <table className="manage-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Role Atual</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => {
                        // 7. Não podemos apagar ou mudar a role de nós próprios!
                        const isCurrentUser = user._id === currentUser._id;

                        return (
                            <tr key={user._id}>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>
                    <span className={user.role === 'admin' ? 'status-scheduled' : 'status-published'}>
                      {user.role}
                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleRoleChange(user._id, user.role)}
                                        disabled={isCurrentUser} // Desativa o botão se for o próprio admin
                                    >
                                        {user.role === 'admin' ? 'Mudar para Ouvinte' : 'Mudar para Admin'}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(user._id)}
                                        disabled={isCurrentUser} // Desativa o botão se for o próprio admin
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

            {/* ---- 8. OS BOTÕES DE PAGINAÇÃO ---- */}
            <div className="pagination-controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="admin-button"
                    style={{ width: 'auto', marginRight: '1rem' }}
                >
                    &larr; Página Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="admin-button"
                    style={{ width: 'auto', marginLeft: '1rem' }}
                >
                    Próxima Página &rarr;
                </button>
            </div>

        </div>
    );
}

export default ManageUsers;