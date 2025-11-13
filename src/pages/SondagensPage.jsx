import React, { useState, useEffect } from 'react';
import { fetchPublicPolls } from '../services/pollService';
import Tabs from '../components/common/Tabs';
import SondagemCard from '../components/common/SondagemCard';

// ---- PÁGINA PRINCIPAL: SondagensPage ----
function SondagensPage() {
    const [allPolls, setAllPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('Sondagens Ativas');
    const tabOptions = ['Sondagens Ativas', 'Sondagens Eternas', 'Sondagens Antigas'];

    useEffect(() => {
        const getPolls = async () => {
            setLoading(true);
            const pollsData = await fetchPublicPolls();
            setAllPolls(pollsData);
            setLoading(false);
        };
        getPolls();
    }, []);

    // Função para atualizar a lista (quando um voto é feito num cartão)
    const handlePollUpdate = (updatedPoll) => {
        setAllPolls(prevPolls =>
            prevPolls.map(poll => (poll._id === updatedPoll._id ? updatedPoll : poll))
        );
    };

    // ---- LÓGICA DE FILTRAGEM ----
    const now = new Date();
    const filteredPolls = allPolls.filter(poll => {
        const prazo = poll.prazo ? new Date(poll.prazo) : null;

        switch(activeTab) {
            case 'Sondagens Ativas':
                return prazo && now < prazo;
            case 'Sondagens Eternas':
                return !prazo;
            case 'Sondagens Antigas':
                return prazo && now > prazo;
            default:
                return true;
        }
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Sondagens</h1>

            <Tabs
                options={tabOptions}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {loading && <p>A carregar sondagens...</p>}

            {!loading && filteredPolls.length === 0 && (
                <p>Não há sondagens nesta categoria.</p>
            )}

            {!loading && filteredPolls.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Mapeia a lista e usa o componente importado */}
                    {filteredPolls.map(poll => (
                        <SondagemCard
                            key={poll._id}
                            poll={poll}
                            onVote={handlePollUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SondagensPage;