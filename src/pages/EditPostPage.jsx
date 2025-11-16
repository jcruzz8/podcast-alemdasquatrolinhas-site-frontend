import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost } from '../services/postService';
import './AdminDashboard.css'; // Reutiliza o estilo do admin
import MiniPostCard from '../components/posts/MiniPostCard';
import RichTextEditor from '../components/common/RichTextEditor';
import '../components/common/RichTextEditor.css';

// As categorias (copiado do AdminDashboard)
const categories = [
    'Futebol','Modalidades','NBA','UFC','Formula1',
    'Recordes Além das Quatro Linhas','Hora do Treino'
];

// A função de validação (copiado do AdminDashboard)
const isValidAspectRatio = (width, height, tolerance = 0.02) => {
    const ratio = width / height;
    const ratiosPermitidos = [ 1/1, 1.91/1, 4/5, 3/4, 5/4, 4/3, 3/2, 16/9, 7/5 ];
    return ratiosPermitidos.some(
        allowedRatio => Math.abs(ratio - allowedRatio) < tolerance
    );
};

function EditPostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();

    // --- 1. OS ESTADOS COMPLETOS (com subtitulo e fotoFonte) ---
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState(categories[0]);
    const [dataAgendada, setDataAgendada] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoFonte, setFotoFonte] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [objectPosition, setObjectPosition] = useState('top');
    const [mensagem, setMensagem] = useState(null);
    const fileInputRef = useRef(null);

    // --- 2. O 'useEffect' DE CARREGAR OS DADOS (COMPLETO) ---
    useEffect(() => {
        const loadPostData = async () => {
            const postData = await fetchPostById(postId);
            if (postData) {
                // Preenche todos os campos (incluindo os novos)
                setTitulo(postData.titulo);
                setSubtitulo(postData.subtitulo || '');
                setDescricao(postData.descricao || '');
                setCategoria(postData.categoria);
                setObjectPosition(postData.objectPosition || 'top');
                setFotoFonte(postData.fotoFonte || '');

                if (postData.dataAgendada) {
                    setDataAgendada(new Date(postData.dataAgendada).toISOString().slice(0, 16));
                }

                // Define o preview da foto (funciona em local e produção)
                setFotoPreview(postData.foto);

            } else {
                setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar o post para edição.' });
            }
        };
        loadPostData();
    }, [postId]);

    // --- 3. O 'useEffect' DO PREVIEW (FICA IGUAL) ---
    useEffect(() => {
        if (!foto) {
            return;
        }
        const objectUrl = URL.createObjectURL(foto);
        setFotoPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [foto]);

    // --- 4. O 'handleFotoChange' ---
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
                        texto: `Proporção inválida (${width}x${height}). Aceites: 1:1, 1.91/1, 4:5, 3:4, 5:4, 4:3, 3:2, 16:9.`
                    });
                    setFoto(null);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // --- 5. O 'handleSubmit' ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem(null);

        const formData = new FormData();
        // Adiciona TODOS os campos ao formulário
        formData.append('titulo', titulo);
        formData.append('subtitulo', subtitulo);
        formData.append('descricao', descricao);
        formData.append('categoria', categoria);
        formData.append('objectPosition', objectPosition);
        formData.append('dataAgendada', dataAgendada);
        formData.append('fotoFonte', fotoFonte);

        if (foto) {
            formData.append('foto', foto);
        }

        const updatedPost = await updatePost(postId, formData);

        if (updatedPost) {
            setMensagem({ tipo: 'sucesso', texto: 'Post atualizado com sucesso!' });
            setTimeout(() => {
                navigate('/admin');
            }, 1500);
        } else {
            setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar o post.' });
        }
    };

    // --- 6. O JSX ---
    return (
        <div className="admin-dashboard">
            <h1 style={{ color: '#fdd835', textAlign: 'center' }}>Editar Publicação</h1>

            <form onSubmit={handleSubmit} className="admin-form-container">
                <h2>Editar Publicação</h2>
                {mensagem && (
                    <p className={mensagem.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                        {mensagem.texto}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>

                {/* --- CAMPO SUBTÍTULO --- */}
                <div className="form-group">
                    <label htmlFor="subtitulo">Subtítulo (Opcional)</label>
                    <input
                        type="text"
                        id="subtitulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
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
                    <label htmlFor="categoria">Categoria</label>
                    <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="foto">Nova Foto (Opcional - só se quiser mudar)</label>
                    <input
                        type="file" id="foto" accept="image/*"
                        onChange={handleFotoChange}
                        ref={fileInputRef}
                    />
                </div>

                {/* --- CAMPO FONTE DA FOTO --- */}
                <div className="form-group">
                    <label htmlFor="fotoFonte">Fonte da Foto (Opcional)</label>
                    <input
                        type="text"
                        id="fotoFonte"
                        value={fotoFonte}
                        onChange={(e) => setFotoFonte(e.target.value)}
                        placeholder="Ex: Getty Images"
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

                <button type="submit" className="admin-button">Atualizar Publicação</button>
            </form>

            {/* A pré-visualização (fica igual) */}
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
        </div>
    );
}

export default EditPostPage;
