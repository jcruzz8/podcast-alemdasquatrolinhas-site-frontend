import React, { forwardRef } from 'react';
import './MiniNavbar.css'; // Vamos criar este CSS

const MiniNavbar = forwardRef((props, ref) => {
    return (
        <div ref={ref} className="mini-navbar">
      <span>
        <strong className="grey-text">O 5 inicial -</strong>
          {" "}Miguel Dias, Guilherme Silva, Rodrigo Afonso, Ricardo Ramalho, <strong className="grey-text">Rodrigo Almeida</strong>
      </span>
        </div>
    );
});

export default MiniNavbar;