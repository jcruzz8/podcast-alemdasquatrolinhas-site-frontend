import React from 'react';
import './MiniNavbar.css'; // Vamos criar este CSS

function MiniNavbar() {
    return (
        <div className="mini-navbar">
      <span>
        <strong className="grey-text">O 5 inicial -</strong>
          {" "}Miguel Dias, Guilherme Silva, Rodrigo Afonso, Ricardo Ramalho, <strong className="grey-text">Rodrigo Almeida</strong>
      </span>
        </div>
    );
}

export default MiniNavbar;