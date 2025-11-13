import React from 'react';
import './Tabs.css';

// Recebe as 'opções' (array de strings) e o 'ativo'
function Tabs({ options, activeTab, onTabChange }) {
    return (
        <div className="tabs-container">
            {options.map(option => (
                <button
                    key={option}
                    // Define a classe 'active' se o 'option' for o 'activeTab'
                    className={`tab-button ${activeTab === option ? 'active' : ''}`}
                    onClick={() => onTabChange(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default Tabs;