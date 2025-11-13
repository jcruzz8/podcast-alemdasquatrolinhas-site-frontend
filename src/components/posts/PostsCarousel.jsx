import React from 'react';
import Slider from 'react-slick';
import MiniPostCard from './MiniPostCard';
// 1. Importa os ícones das setas
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './PostsCarousel.css';

// 2. Componente da Seta "Próximo"
function NextArrow(props) {
    const { onClick } = props;
    return (
        <div className="custom-arrow next-arrow" onClick={onClick}>
            <FaChevronRight />
        </div>
    );
}

// 3. Componente da Seta "Anterior"
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="custom-arrow prev-arrow" onClick={onClick}>
            <FaChevronLeft />
        </div>
    );
}

// Este é o componente do Carrossel
function PostsCarousel({ posts }) {

    // 4. ATUALIZA AS CONFIGURAÇÕES (settings)
    const settings = {
        className: "center-carousel", // Classe para o CSS
        centerMode: true,
        infinite: true,
        centerPadding: "110px", // Espaço para ver os slides laterais
        slidesToShow: 1,
        speed: 500,
        autoplay: true, // (Autoplay desligado para este efeito)

        // 5. Liga as nossas novas setas
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,

        // Ajusta para ecrãs mais pequenos
        responsive: [
            {
                breakpoint: 768, // Telemóveis
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20px',
                }
            }
        ]
    };

    return (
        <div className="posts-carousel-container">
            <Slider {...settings}>
                {posts.map(post => (
                    <MiniPostCard key={post._id} post={post} />
                ))}
            </Slider>
        </div>
    );
}

export default PostsCarousel;