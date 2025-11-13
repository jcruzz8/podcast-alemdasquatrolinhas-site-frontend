// frontend/src/components/posts/MiniPostCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './PostsCarousel.css';

// 1. Garante que ele ACEITA a prop (com o teu 'default' top)
function MiniPostCard({ post, objectPosition: previewPosition }) {

    const objectPosition = previewPosition || post.objectPosition || 'top';

    // 2. Garante que a lógica 'imageUrl' está correta
    let imageUrl = '/placeholder-imagem.jpg';
    if (post.foto) {
        if (post.foto.startsWith('http') || post.foto.startsWith('blob:')) {
            imageUrl = post.foto;
        } else {
            imageUrl = `http://localhost:5000${post.foto}`;
        }
    }

    return (
        <div className="mini-post-card">
            <Link to={`/noticias/${post._id}`}>
                <img
                    src={imageUrl}
                    alt={post.titulo}
                    className="mini-post-image"
                    // 3. Garante que ele USA a prop
                    style={{ objectPosition: objectPosition }}
                />
                <div className="mini-post-content">
                    <span className="mini-post-categoria">{post.categoria}</span>
                    <h3>{post.titulo}</h3>
                </div>
            </Link>
        </div>
    );
}

export default MiniPostCard;