import React from 'react';

// CSS para esta página
const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto', // Centrar o conteúdo
        lineHeight: '1.6',
    },
    title: {
        borderBottom: '2px solid #fdd835',
        paddingBottom: '0.5rem',
    },
    linksContainer: {
        marginTop: '2rem',
    },
    link: {
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#e57d90',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
        marginRight: '1rem',
        fontWeight: 'bold',
    },
    spotifyLink: {
        backgroundColor: '#1DB954', // Cor do Spotify
    }
};

function SobreNosPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Sobre o Nosso Podcast</h1>

            <p>
                Além das Quatro Linhas é o o podcast onde a paixão pelo desporto ganha voz!
                Um grupo de amigos, que desde sempre vive e debate cada jogada, reuniu-se para trazer análises,
                curiosidades e discussões acesas sobre o desporto. Com conversas dinâmicas, opiniões fortes
                e aquele toque de boa disposição, o jogo continua fora de campo. Se és um verdadeiro amante do
                desporto e se o vives como nós, junta-te a nós e vem ouvir o nosso PodCast.
            </p>
            <p>
                Este site é a extensão da nossa conversa. Aqui podes encontrar as
                mais frescas notícias do mundo desportivo, os nossos alertas para episódios novos e
                participar das nossas sondagens.
            </p>

            <div style={styles.linksContainer}>
                <h3>Ouve-nos e Segue-nos!</h3>
                <p>Não percas nenhum episódio nem nenhuma das nossas reações a quente.</p>

                {/* Links para as redes */}
                <a
                    href="https://open.spotify.com/show/1yxF06AF0tL1tX4GOIYur6?si=cc290a162abf4d5e"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{...styles.link, ...styles.spotifyLink}}
                >
                    Ouve-nos no Spotify
                </a>

                <a
                    href="https://www.instagram.com/_alemdasquatrolinhas_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    Acompanha-nos no Instagram
                </a>
            </div>
        </div>
    );
}

export default SobreNosPage;