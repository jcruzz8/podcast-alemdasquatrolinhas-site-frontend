import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // <-- Importa o 'Filler' para a cor de fundo
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler // <-- Regista o 'Filler'
);

// Este componente recebe o 'fetcher' (a função do serviço) e o 'title'
function EvolutionChart({ title, dataFetcher }) {

    const [chartData, setChartData] = useState({ datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChartData = async () => {
            setLoading(true);
            const statsData = await dataFetcher(); // Chama a função que lhe passámos

            if (statsData && statsData.length > 0) {
                const labels = statsData.map(data => data._id); // Eixo X (Mês ou Ano)
                const counts = statsData.map(data => data.count); // Eixo Y (Contagem)

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Visualizações',
                            data: counts,
                            borderColor: '#38A169', // <-- Linha verde
                            backgroundColor: (context) => { // <-- Fundo verde (como no mockup)
                                const ctx = context.chart.ctx;
                                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                                gradient.addColorStop(0, 'rgba(56, 161, 105, 0.5)');
                                gradient.addColorStop(1, 'rgba(56, 161, 105, 0)');
                                return gradient;
                            },
                            fill: true, // <-- Diz ao gráfico para preencher
                            tension: 0.3
                        }
                    ]
                });
            } else {
                setChartData({ labels: [], datasets: [] }); // Dados vazios
            }
            setLoading(false);
        };
        loadChartData();
    }, [dataFetcher]); // Recarrega se a função 'dataFetcher' mudar

    // ---- OPÇÕES DE ESTILO (TEMA ESCURO) ----
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite-nos controlar a altura
        scales: {
            y: { // Eixo Y
                ticks: { color: '#A0AEC0' }, // Cor dos números (cinza claro)
                grid: { color: '#4A5568' } // Cor das linhas da grelha (cinza escuro)
            },
            x: { // Eixo X
                ticks: { color: '#A0AEC0' },
                grid: { color: '#4A5568' }
            }
        },
        plugins: {
            legend: {
                labels: { color: '#E2E8F0' } // Cor da legenda (branca)
            },
            title: {
                display: true,
                text: title, // Título dinâmico
                color: '#FFFFFF', // Cor do título (branca)
                font: {
                    size: 20 // Tamanho em pixels (podes ajustar)
                }
            },
        },
    };

    if (loading) {
        return <p style={{ color: '#ccc' }}>A carregar gráfico...</p>;
    }

    return (
        // Define uma altura para o gráfico
        <div style={{ height: '350px' }}>
            <Line options={options} data={chartData} />
        </div>
    );
}

export default EvolutionChart;