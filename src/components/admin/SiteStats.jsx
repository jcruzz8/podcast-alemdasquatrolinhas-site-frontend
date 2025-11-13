import React from 'react';
import './SiteStats.css';

// Este componente agora é "dumb" (burro)
// Ele apenas recebe 'stats' como uma prop
function SiteStats({ stats }) {

    // Se os 'stats' ainda não chegaram (a carregar), não mostra nada
    if (!stats) {
        return <p>A carregar estatísticas gerais...</p>;
    }

    return (
        <div className="stats-container">
            <div className="stat-card">
                <h3 className="stat-title">Total de Ouvintes</h3>
                <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Admins</h3>
                <p className="stat-number">{stats.totalAdmins}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Posts</h3>
                <p className="stat-number">{stats.totalPosts}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Comentários</h3>
                <p className="stat-number">{stats.totalComments}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Alertas</h3>
                <p className="stat-number">{stats.totalAlerts}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Sondagens</h3>
                <p className="stat-number">{stats.totalPolls}</p>
            </div>
            <div className="stat-card">
                <h3 className="stat-title">Total de Visualizações</h3>
                <p className="stat-number">{stats.totalViews}</p>
            </div>
        </div>
    );
}

export default SiteStats;