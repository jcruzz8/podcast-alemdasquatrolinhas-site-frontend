import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- 1. Importa 'useParams' e 'useNavigate'
import { fetchPostById, updatePost } from '../services/postService'; // <-- 2. Importa 'fetchById' e 'updatePost'
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
    const ratiosPermitidos = [ 1/1, 1.91/1, 4/5, 3/4, 5/4, 4/3, 3/2 ];
    return ratiosPermitidos.some(
        allowedRatio => Math.abs(ratio - allowedRatio) < tolerance
    );
};

function EditPostPage() {
    // 3. Apanha o ID do post do URL
    const { postId } = useParams();
    const navigate = useNavigate(); // Para redirecionar o admin quando terminar

    // --- Estados do Formulário (iguais ao AdminDashboard) ---
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState(categories[0]);
    const [dataAgendada, setDataAgendada] = useState('');
    const [foto, setFoto] = useState(null); // 'null' se a foto não for mudada
    const [fotoFonte, setFotoFonte] = useState('');
    const [fotoPreview, setFotoPreview] = useState(null); // Para o preview
    const [objectPosition, setObjectPosition] = useState('top');
    const [mensagem, setMensagem] = useState(null);
    const fileInputRef = useRef(null);

    // 4. ---- CARREGAR OS DADOS DO POST ----
    useEffect(() => {
        const loadPostData = async () => {
            const postData = await fetchPostById(postId);
            if (postData) {
                // Preenche o formulário com os dados existentes
                setTitulo(postData.titulo);
                setSubtitulo(postData.subtitulo);
                setDescricao(postData.descricao);
                setCategoria(postData.categoria);
                setObjectPosition(postData.objectPosition || 'top');
                setFoto(postData.fotoFonte);
                // Formata a data para o input 'datetime-local'
                if (postData.dataAgendada) {
                    setDataAgendada(new Date(postData.dataAgendada).toISOString().slice(0, 16));
                }
                // Define o preview da foto *existente*
                const imageUrl = postData.foto.startsWith('http')
                    ? postData.foto
                    : `http://localhost:5000${postData.foto}`;
                setFotoPreview(imageUrl);
            } else {
                setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar o post para edição.' });
            }
        };
        loadPostData();
    }, [postId]); // Corre isto sempre que o ID do post mudar

    // 5. ---- LÓGICA DE PREVIEW (Igual ao AdminDashboard) ----
    useEffect(() => {
        if (!foto) { // Se 'foto' (o novo ficheiro) estiver vazio, não faz nada
            return;
        }
        // Se um *novo* ficheiro for escolhido, cria um preview para ele
        const objectUrl = URL.createObjectURL(foto);
        setFotoPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [foto]);

    // 6. ---- LÓGICA DE VALIDAÇÃO (Igual ao AdminDashboard) ----
    const handleFotoChange = (e) => {
        // ... (código 100% igual ao AdminDashboard.jsx)
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
                        texto: `Proporção inválida (${width}x${height}). Aceites: 1:1, 1.91:1, 4:5, 3:4, 5:4, 4:3, 3:2.`
                    });
                    setFoto(null);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // 7. ---- LÓGICA DE SUBMISSÃO (Atualizada para 'updatePost') ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem(null);

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('subtitulo', subtitulo);
        formData.append('descricao', descricao);
        formData.append('categoria', categoria);
        formData.append('objectPosition', objectPosition);
        formData.append('fotoFonte', fotoFonte);
        formData.append('dataAgendada', dataAgendada);

        // SÓ adiciona a foto se o admin escolheu uma *nova*
        if (foto) {
            formData.append('foto', foto);
        }

        const updatedPost = await updatePost(postId, formData); // <-- CHAMA O 'updatePost'

        if (updatedPost) {
            setMensagem({ tipo: 'sucesso', texto: 'Post atualizado com sucesso!' });
            // Redireciona o admin de volta para o dashboard
            setTimeout(() => {
                navigate('/admin');
            }, 1500); // Espera 1.5s
        } else {
            setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar o post.' });
        }
    };

    return (
        // 8. O JSX (igual ao AdminDashboard, mas com títulos mudados)
        <div className="admin-dashboard">
            <h1 style={{ color: '#fdd835', textAlign: 'center' }}>Editar Publicação</h1>

            <form onSubmit={handleSubmit} className="admin-form-container">
                <h2>Editar Publicação</h2>

                {mensagem && (
                    <p className={mensagem.tipo === 'erro' ? 'admin-error' : 'admin-success'}>
                        {mensagem.texto}
                    </p>
                )}

                {/* ... (O resto do formulário: Título, Descrição, Categoria) ... */}
                {/* (É 100% igual ao do AdminDashboard) */}
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="subtitulo">Subtítulo (Opcional)</label>
                    <input
                        type="text" id="subtitulo" value={subtitulo}
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
                        // NÃO é 'required' na edição
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fotoFonte">Fonte da Foto (Opcional)</label>
                    <input
                        type="text" id="fotoFonte" value={fotoFonte}
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

            {/* A pré-visualização (100% igual ao AdminDashboard) */}
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