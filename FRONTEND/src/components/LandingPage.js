import React from 'react';
import './LandingPage.css';

const LandingPage = ({onComenzarClick}) => {
    const handleButtonClick = () => {
        // Lógica adicional antes de iniciar, si es necesario
        onComenzarClick();
      };
  return (
    <div className="landing.page">

      <header>
        <nav>
        <div className="logo">
            <img src="./logonew.png" alt="Logo" />
          </div>
          <ul>
          <li className="inicio"><a href="/">Inicio</a></li>
            {/* Puedes agregar más elementos de navegación según sea necesario */}
          </ul>
        </nav>
      </header>

      <main>
      <div className="content">
          <div className="image-container overflow">
            <img src="/fotoP8.jpg" alt="Foto central" />
          </div>
          <div className="text-container">
          <div className="logocentral">
            <img src="./logonew.png" alt="Logo" />
          </div>
          <h3>Deliciosas Creaciones en 10 Minutos.</h3>
          <h3>Sabores Intensos, Tiempo Mínimo.</h3>
        
        <div id="outer">
          <div className="button_slide slide_down" id="Comenzar" onClick={handleButtonClick}>COMENZAR</div>
        </div>
        </div>
        </div>
      </main>

      <div className= "footer">
        <footer>
        <p>Proyecto Integrador Backend Numem by Gerardo Almirón FS0423TM. 2024</p>
      </footer>
      </div>
    </div>
  );
}

export default LandingPage;