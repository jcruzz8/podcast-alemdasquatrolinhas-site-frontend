import React from 'react';
// 1. Vamos criar este ficheiro CSS para o estilo
import './Equipa.css';

const coach = {
    nome: "Rodrigo Almeida",
    descricao: "A nossa mais valia, mais valia ter ficado em casa.",
    imagem: "/Almeida.jpg"
};

const titulares = [
    {
        nome: "Miguel Dias",
        descricao: "Telefone estragado, ninguém percebe o que diz.",
        imagem: "/MiguelDias.png"
    },
    {
        nome: "Guilherme Silva",
        descricao: "Comentador de rara precisão, raramente acerta uma.",
        imagem: "/GuiBoss.jpg"
    },
    {
        nome: "Rodrigo Afonso",
        descricao: "Mudinho, por muito que fale ninguém o ouve.",
        imagem: "/Rodrigo_Afonso.jpg"
    },
    {
        nome: "Ricardo Ramalho",
        descricao: "Observador, vê tudo e comenta pouco.",
        imagem: "/Ramalho.jpg"
    },
    // ... (Adicionar mais membros aqui)
];

const staff = [
    {
        nome: "Joana Toscano",
        descricao: "Política, fala muito e não faz nada.",
        imagem: "/Joana.jpg"
    },
    {
        nome: "José Cruz",
        descricao: "Trolha, faz de tudo um pouco.",
        imagem: "/Cruz.JPEG"
    },
    // ... (Adicionar outros membros do staff)
];

// --- O Componente do Cartão de Membro ---
function MemberCard({ nome, descricao, imagem }) {
    return (
        <div className="member-card">
            <img src={imagem} alt={nome} className="member-image" />
            <h3 className="member-name">{nome}</h3>
            <p className="member-description">{descricao}</p>
        </div>
    );
}

// --- A Página Principal ---
function Equipa() {
    return (
        <div className="sobre-nos-container">
            <h1 className="page-title">Meet the Crew</h1>

            {/* --- Secção do Coach --- */}
            <section className="team-section">
                <h2 className="section-title">O Coach</h2>
                <div className="team-grid single-member">
                    <MemberCard
                        nome={coach.nome}
                        descricao={coach.descricao}
                        imagem={coach.imagem}
                    />
                </div>
            </section>

            {/* --- Secção dos Titulares --- */}
            <section className="team-section">
                <h2 className="section-title">Titulares</h2>
                <div className="team-grid">
                    {titulares.map(membro => (
                        <MemberCard
                            key={membro.nome}
                            nome={membro.nome}
                            descricao={membro.descricao}
                            imagem={membro.imagem}
                        />
                    ))}
                </div>
            </section>

            {/* --- Secção do Staff --- */}
            <section className="team-section">
                <h2 className="section-title">Equipa Técnica</h2>
                <div className="team-grid">
                    {staff.map(membro => (
                        <MemberCard
                            key={membro.nome}
                            nome={membro.nome}
                            descricao={membro.descricao}
                            imagem={membro.imagem}
                        />
                    ))}
                </div>
            </section>

        </div>
    );
}

export default Equipa;