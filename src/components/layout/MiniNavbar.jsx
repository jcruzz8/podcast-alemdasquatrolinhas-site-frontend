import React from 'react';
import './MiniNavbar.css'; // Vamos criar este CSS

function MiniNavbar() {
    return (
        <div className="mini-navbar">
      <span>
        <strong className="grey-text">O vosso 5 inicial -</strong>
          {" "}José Cruz, Guilherme Silva, <strong className="grey-text">Rodrigo Almeida</strong>, Rodrigo Afonso, Ricardo Ramalho
      </span>
        </div>
    );
}

export default MiniNavbar;