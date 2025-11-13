import React from 'react';
// 1. Importa os ícones específicos que queremos
import { FaSpotify, FaInstagram } from 'react-icons/fa';

// --- Estilos CSS ---
const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '2rem',
        textAlign: 'center',
        marginTop: 'auto'
    },
    socialLinks: {
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    socialIcon: {
        color: '#fff', // Cor do ícone
        fontSize: '2rem', // Tamanho do ícone (ex: 32px)
        margin: '0 1rem', // Espaçamento entre os ícones
        transition: 'color 0.2s', // Efeito 'hover' suave
    },
    spotifyIconHover: { // Cor 'hover' específica do Spotify
        color: '#1DB954',
    },
    instagramIconHover: { // Cor 'hover' específica do Instagram (um gradiente, mas vamos simplificar)
        color: '#E1306C',
    }
};

function Footer() {
    // 2. Estados para controlar o 'hover' (para a cor)
    const [spotifyHover, setSpotifyHover] = React.useState(false);
    const [instaHover, setInstaHover] = React.useState(false);

    return (
        <footer style={styles.footer}>
            <p>© 2025 <strong>Além das Quatro Linhas.</strong> Todos os direitos reservados.</p>
            <div style={styles.socialLinks}>

                {/* 3. O Link e Ícone do Spotify */}
                <a
                    href="https://open.spotify.com/show/1yxF06AF0tL1tX4GOIYur6?si=d08c644dbb78479a"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setSpotifyHover(true)}
                    onMouseLeave={() => setSpotifyHover(false)}
                >
                    <FaSpotify
                        style={{
                            ...styles.socialIcon,
                            ...(spotifyHover ? styles.spotifyIconHover : {})
                        }}
                    />
                </a>

                {/* 4. O Link e Ícone do Instagram */}
                <a
                    href="https://www.instagram.com/_alemdasquatrolinhas_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setInstaHover(true)}
                    onMouseLeave={() => setInstaHover(false)}
                >
                    <FaInstagram
                        style={{
                            ...styles.socialIcon,
                            ...(instaHover ? styles.instagramIconHover : {})
                        }}
                    />
                </a>
            </div>
        </footer>
    );
}

export default Footer;