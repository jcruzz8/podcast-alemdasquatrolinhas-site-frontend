import React, { useState, useEffect, useRef } from 'react';
import { fetchSiteSettings, updateSiteSettings } from '../services/settingsService';
import { createPost } from '../services/postService';
import { createAlert } from '../services/alertService';
import { createPoll } from '../services/pollService';
import MiniPostCard from '../components/posts/MiniPostCard';
import Tabs from '../components/common/Tabs';
import ManagePosts from '../components/admin/ManagePosts';
import ManageAlerts from '../components/admin/ManageAlerts';
import ManagePolls from '../components/admin/ManagePolls';
import SiteStats from '../components/admin/SiteStats';
import {fetchMonthlyViews, fetchSiteStats, fetchYearlyViews} from '../services/statsService';
import RecordStats from '../components/admin/RecordStats';
import EvolutionChart from '../components/admin/EvolutionChart';
import ManageUsers from '../components/admin/ManageUsers';
import RichTextEditor from '../components/common/RichTextEditor';
import '../components/common/RichTextEditor.css';

// As categorias
const categories = [
    'Futebol',
    'Modalidades',
    'NBA',
    'UFC',
    'Formula1',
    'Recordes Além das Quatro Linhas',
    'Hora do Treino'
];

// A função de validação
const isValidAspectRatio = (width, height, tolerance = 0.02) => {
    const ratio = width / height;
    const ratiosPermitidos = [ 1/1, 1.91/1, 4/5, 3/4, 5/4, 4/3, 3/2, 16/9, 7/5 ];
    return ratiosPermitidos.some(
        allowedRatio => Math.abs(ratio - allowedRatio) < tolerance
    );
};

function AdminDashboard() {
    // --- Todos os 'useState' ---
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState(categories[0]);
    const [dataAgendada, setDataAgendada] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [objectPosition, setObjectPosition] = useState('top');
    const [mensagem, setMensagem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertFeedback, setAlertFeedback] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']); // Começa com 2 opções vazias
    const [pollDeadline, setPollDeadline] = useState('');
    const [pollFeedback, setPollFeedback] = useState(null);
    const fileInputRef = useRef(null);

    // Estados para o spotify
    const [spotifyTitle, setSpotifyTitle] = useState('');
    const [spotifyIframe, setSpotifyIframe] = useState('');
    const [spotifyFeedback, setSpotifyFeedback] = useState(null);

    // --- O 'useState' das Abas ---
    const [activeTab, setActiveTab] = useState('Criar novo conteúdo');
    const tabOptions = ['Criar novo conteúdo', 'Gerir conteúdo', 'Gerir Users','Estatísticas do site'];

    const [statsData, setStatsData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [yearlyData, setYearlyData] = useState(null);

    useEffect(() => {
        // Quando a aba "Estatísticas" for aberta
        if (activeTab === 'Estatísticas do site') {
            // 1. Carrega as estatísticas das caixas
            if (!statsData) {
                const loadStats = async () => {
                    const data = await fetchSiteStats();
                    setStatsData(data);
                };
                loadStats();
            }
            // 2. Carrega os dados do gráfico Mensal
            if (!monthlyData) {
                const loadMonthly = async () => {
                    const data = await fetchMonthlyViews();
                    setMonthlyData(data);
                };
                loadMonthly();
            }
            // 3. Carrega os dados do gráfico Anual
            if (!yearlyData) {
                const loadYearly = async () => {
                    const data = await fetchYearlyViews();
                    setYearlyData(data);
                };
                loadYearly();
            }
        }
    }, [activeTab, statsData, monthlyData, yearlyData]); // Vigia a 'activeTab'

    // --- Os teus 'useEffect' ---
    useEffect(() => {
        if (!foto) {
            setFotoPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(foto);
        setFotoPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [foto]);

    useEffect(() => {
        // Quando o componente carrega, vai buscar as settings atuais
        const loadSettings = async () => {
            const settings = await fetchSiteSettings();
            if (settings) {
                setSpotifyTitle(settings.spotifyTitle);
                setSpotifyIframe(settings.spotifyIframe);
            }
        };
        loadSettings();
    }, []); // Corre só uma vez

    // --- As Funções (handleFotoChange, handleSubmit) ---
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        setMensagem(null);
        if (!file) { setFoto(null); return; }
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                if (isValidAspectRatio(width, height)) {
                    setFoto(file);
                } else {
                    setMensagem({
                        tipo: 'erro',
                        texto: `Proporção inválida (${width}x${height}). Aceites: 1:1, 1.91:1, 4:5, 3:4, 5:4, 4:3, 3:2, 16:9.`
                    });
                    setFoto(null);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem(null);
        if (!foto) {
            setMensagem({ tipo: 'erro', texto: 'Por favor, selecione uma foto.' });
            return;
        }
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        formData.append('categoria', categoria);
        formData.append('foto', foto);
        formData.append('objectPosition', objectPosition);
        if (dataAgendada) {
            formData.append('dataAgendada', dataAgendada);
        }
        const newPost = await createPost(formData);
        if (newPost) {
            setMensagem({ tipo: 'sucesso', texto: 'Post criado com sucesso!' });
            setTitulo('');
            setDescricao('');
            setFoto(null);
            setDataAgendada('');
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } else {
            setMensagem({ tipo: 'erro', texto: 'Erro ao criar o post.' });
        }
    };

    const handleAlertSubmit = async (e) => {
        e.preventDefault();
        setAlertFeedback(null); // Limpa mensagens antigas

        if (!alertMessage.trim()) {
            setAlertFeedback({ tipo: 'erro', texto: 'A mensagem do alerta não pode estar vazia.' });
            return;
        }

        const newAlert = await createAlert(alertMessage);

        if (newAlert) {
            setAlertFeedback({ tipo: 'sucesso', texto: 'Alerta criado com sucesso!' });
            setAlertMessage(''); // Limpa o formulário
        } else {
            setAlertFeedback({ tipo: 'erro', texto: 'Erro ao criar o alerta.' });
        }
    };

    // ---- FUNÇÕES PARA O FORMULÁRIO DE SONDAGEM ----

// Altera o texto de uma opção específica
    const handlePollOptionChange = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

// Adiciona uma nova opção vazia
    const addPollOption = () => {
        setPollOptions([...pollOptions, '']);
    };

// Remove uma opção (só se houver mais de 2)
    const removePollOption = (index) => {
        if (pollOptions.length > 2) {
            const newOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(newOptions);
        }
    };

// Submete a sondagem
    const handlePollSubmit = async (e) => {
        e.preventDefault();
        setPollFeedback(null);

        // Validação
        if (!pollQuestion.trim()) {
            setPollFeedback({ tipo: 'erro', texto: 'A pergunta não pode estar vazia.' });
            return;
        }
        const validOptions = pollOptions.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            setPollFeedback({ tipo: 'erro', texto: 'Precisa de pelo menos 2 opções válidas.' });
            return;
        }

        const newPoll = await createPoll({
            pergunta: pollQuestion,
            opcoes: validOptions,
            prazo: pollDeadline || null // Envia null se estiver vazio
        });

        if (newPoll) {
            setPollFeedback({ tipo: 'sucesso', texto: 'Sondagem criada com sucesso!' });
            setPollQuestion('');
            setPollOptions(['', '']);
            setPollDeadline('');
        } else {
            setPollFeedback({ tipo: 'erro', texto: 'Erro ao criar a sondagem.' });
        }
    };

    const handleSpotifySubmit = async (e) => {
        e.preventDefault();
        setSpotifyFeedback(null);

        if (!spotifyIframe.includes('<iframe')) {
            setSpotifyFeedback({ tipo: 'erro', texto: 'O código parece inválido. Cole o código <iframe> completo do Spotify.' });
            return;
        }

        const updatedSettings = await updateSiteSettings({
            spotifyTitle: spotifyTitle,
            spotifyIframe: spotifyIframe,
        });

        if (updatedSettings) {
            setSpotifyFeedback({ tipo: 'sucesso', texto: 'Episódio em destaque atualizado!' });
        } else {
            setSpotifyFeedback({ tipo: 'erro', texto: 'Erro ao atualizar.' });
        }
    };

    // ---- O 'return' ----
    return (
        <div className="admin-dashboard">
            <h1 style={{ color: '#fdd835', textAlign: 'center' }}>Dashboard de Admin</h1>

            {/* 1. As Abas (Tabs) */}
            <div className="admin-tabs-container">
                <Tabs
                    options={tabOptions}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* 2. Conteúdo da "Aba: Criar novo conteúdo" */}
            {activeTab === 'Criar novo conteúdo' && (
                <div>
                    {/* O formulário de "Criar Post" */}
                    <form onSubmit={handleSubmit} className="admin-form-container">
                        <h2>Publicar uma Notícia</h2>
                        {mensagem && (
                            <p className={mensagem.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                                {mensagem.texto}
                            </p>
                        )}
                        <div className="form-group">
                            <label htmlFor="titulo">Título</label>
                            <input
                                type="text" id="titulo" value={titulo}
                                onChange={(e) => setTitulo(e.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição</label>
                            <RichTextEditor
                                content={descricao}
                                onChange={setDescricao}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="foto">Foto da Notícia</label>
                            <input
                                type="file" id="foto" accept="image/*"
                                onChange={handleFotoChange}
                                ref={fileInputRef}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataAgendada">Agendar Para (Opcional)</label>
                            <input
                                type="datetime-local" id="dataAgendada"
                                value={dataAgendada}
                                onChange={(e) => setDataAgendada(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="admin-button">Publicar</button>
                    </form>

                    {/* A pré-visualização */}
                    {(titulo || fotoPreview) && (
                        <div className="admin-form-container" style={{ marginTop: '2rem' }}>
                            <h2>Pré-visualização do Post</h2>
                            {fotoPreview && (
                                <div className="form-group" style={{ textAlign: 'center' }}>
                                    <label>Ajustar Foco da Imagem:</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button type="button" onClick={() => setObjectPosition('top')} className="admin-button" style={{ width: 'auto', backgroundColor: '#555' }}>Topo</button>
                                        <button type="button" onClick={() => setObjectPosition('center')} className="admin-button" style={{ width: 'auto', backgroundColor: '#555' }}>Centro</button>
                                        <button type="button" onClick={() => setObjectPosition('bottom')} className="admin-button" style={{ width: 'auto', backgroundColor: '#555' }}>Baixo</button>
                                    </div>
                                </div>
                            )}
                            <MiniPostCard
                                post={{
                                    titulo: titulo || "O teu título aqui...",
                                    categoria: categoria,
                                    foto: fotoPreview || "/placeholder-imagem.jpg",
                                    _id: 'preview'
                                }}
                                objectPosition={objectPosition}
                            />
                        </div>
                    )}
                    <form onSubmit={handleAlertSubmit} className="admin-form-container" style={{ marginTop: '2rem' }}>
                        <h2>Publicar um Alerta</h2>

                        {/* Mensagem de Feedback */}
                        {alertFeedback && (
                            <p className={alertFeedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                                {alertFeedback.texto}
                            </p>
                        )}

                        <div className="form-group">
                            <label htmlFor="alertMessage">Mensagem do Alerta</label>
                            <input
                                type="text"
                                id="alertMessage"
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                                placeholder="Ex: Novo episódio amanhã às 20h!"
                                required
                            />
                        </div>

                        <button type="submit" className="admin-button">Publicar Alerta</button>
                    </form>
                    <form onSubmit={handlePollSubmit} className="admin-form-container" style={{ marginTop: '2rem' }}>
                        <h2>Publicar uma Sondagem</h2>

                        {pollFeedback && (
                            <p className={pollFeedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                                {pollFeedback.texto}
                            </p>
                        )}

                        <div className="form-group">
                            <label htmlFor="pollQuestion">Pergunta da Sondagem</label>
                            <input
                                type="text"
                                id="pollQuestion"
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Opções (mínimo 2)</label>
                            {pollOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                        placeholder={`Opção ${index + 1}`}
                                        style={{ flex: 1 }} /* O input ocupa o espaço todo */
                                    />
                                    {/* Só deixa remover se houver mais de 2 opções */}
                                    {pollOptions.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removePollOption(index)}
                                            className="admin-button"
                                            style={{ width: 'auto', backgroundColor: '#555' }}
                                        >
                                            &times; {/* Botão "X" para remover */}
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPollOption}
                                className="admin-button"
                                style={{ width: 'auto', backgroundColor: '#555', marginTop: '0.5rem' }}
                            >
                                + Adicionar Opção
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pollDeadline">Prazo (Opcional - se vazio, é eterna)</label>
                            <input
                                type="datetime-local"
                                id="pollDeadline"
                                value={pollDeadline}
                                onChange={(e) => setPollDeadline(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="admin-button">Publicar Sondagem</button>
                    </form>
                </div>
            )}

            {/* 3. Conteúdo da "Aba: Gerir conteúdo" */}
            {activeTab === 'Gerir conteúdo' && (
                <div>

                    {/* Caixa 0: Gerir Episódios */}
                    <form onSubmit={handleSpotifySubmit} className="admin-form-container">
                        <h2>Atualizar Episódio em Destaque</h2>

                        {spotifyFeedback && (
                            <p className={spotifyFeedback.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                                {spotifyFeedback.texto}
                            </p>
                        )}

                        <div className="form-group">
                            <label htmlFor="spotifyTitle">Título (Ex: "Vem ouvir a conversa...")</label>
                            <input
                                type="text" id="spotifyTitle" value={spotifyTitle}
                                onChange={(e) => setSpotifyTitle(e.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="spotifyIframe">Código `&lt;iframe&gt;` do Spotify</label>
                            <textarea
                                id="spotifyIframe" value={spotifyIframe}
                                onChange={(e) => setSpotifyIframe(e.target.value)}
                                rows="5" required
                                placeholder="Cole o código <iframe ...> aqui"
                            />
                        </div>
                        <button type="submit" className="admin-button">Atualizar Episódio</button>
                    </form>

                    {/* Caixa 1: Gerir Publicações */}
                    <div className="admin-form-container">
                        <h2>Gerir Publicações</h2>
                        <ManagePosts />
                    </div>

                    {/* Caixa 2: Gerir Alertas */}
                    <div className="admin-form-container" style={{ marginTop: '2rem' }}>
                        <h2 style={{ marginTop: '0' }}>Gerir Alertas</h2>
                        <ManageAlerts />
                    </div>

                    {/* Caixa 3: Gerir Sondagens */}
                    <div className="admin-form-container" style={{ marginTop: '2rem' }}>
                        <h2 style={{ marginTop: '0' }}>Gerir Sondagens</h2>
                        <ManagePolls />
                    </div>

                </div>
            )}

            {/* ---- 4. ABA: "Gerir Users" ---- */}
            {activeTab === 'Gerir Users' && (
                <div>
                    <div className="admin-form-container">
                        <h2>Gerir Utilizadores</h2>
                        <ManageUsers />
                    </div>
                </div>
            )}

            {/* 5. Conteúdo da "Aba: Estatísticas" */}
            {activeTab === 'Estatísticas do site' && (
                <div>

                    {/* Caixa 1: Estatísticas Gerais */}
                    <div className="admin-form-container">
                        <h2>Estatísticas Gerais</h2>
                        {/* Passa os 'statsData' para o componente filho */}
                        <SiteStats stats={statsData} />
                    </div>

                    {/* Caixa 2: Recordes de Visualizações */}
                    <div className="admin-form-container" style={{ marginTop: '2rem' }}>
                        <h2>Recordes de Visualizações</h2>
                        {/* Substitui o <p> pelo novo componente */}
                        <RecordStats stats={statsData} />
                    </div>

                    {/* ... (Caixa 3 e 4: Gráficos) ... */}

                    {/* Caixa 3: Gráfico Mensal (Placeholder) */}
                    <div className="admin-form-container" style={{ marginTop: '2rem', backgroundColor: '#333' }}>
                        <EvolutionChart
                            title="Evolução Mensal"
                            dataFetcher={fetchMonthlyViews} // Passa a FUNÇÃO que ele deve chamar
                        />
                    </div>

                    {/* Caixa 4: Gráfico Anual (Placeholder) */}
                    <div className="admin-form-container" style={{ marginTop: '2rem', backgroundColor: '#333' }}>
                        <EvolutionChart
                            title="Evolução Anual"
                            dataFetcher={fetchYearlyViews} // Passa a FUNÇÃO que ele deve chamar
                        />
                    </div>

                </div>
            )}

        </div> // Fim de .admin-dashboard
    );
}

export default AdminDashboard;