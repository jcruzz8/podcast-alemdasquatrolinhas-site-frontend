import React from 'react';
import './SiteStats.css'; // Vamos reutilizar o mesmo CSS

function RecordStats({ stats }) {

    if (!stats) {
        return <p>A carregar recordes...</p>;
    }

    return (
        // Reutiliza o 'stats-container' para a grelha
        <div className="stats-container">

            {/* Caixa 1: Recorde Diário */}
            <div className="stat-card">
                <h3 className="stat-title">Máx. Vistas (Dia)</h3>
                <p className="stat-number">{stats.maxViewsDay}</p>
            </div>

            {/* Caixa 2: Recorde Mensal */}
            <div className="stat-card">
                <h3 className="stat-title">Máx. Vistas (Mês)</h3>
                <p className="stat-number">{stats.maxViewsMonth}</p>
            </div>

            {/* Caixa 3: Recorde Anual */}
            <div className="stat-card">
                <h3 className="stat-title">Máx. Vistas (Ano)</h3>
                <p className="stat-number">{stats.maxViewsYear}</p>
            </div>

        </div>
    );
}

export default RecordStats;