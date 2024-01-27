import React, { useState} from 'react';
import LandingPage from './components/LandingPage';
import MenuRecetas from './components/MenuRecetas';
import './App.css';

function App() {
  const [mostrarMenuRecetas, setMostrarMenuRecetas] = useState(false);

  const handleComenzarClick = () => {
    setMostrarMenuRecetas(true);
  };
  return (
    <div className="App">
      {mostrarMenuRecetas ? (
        <MenuRecetas />
      ) : (
        <LandingPage onComenzarClick={handleComenzarClick} />
      )}
      
    </div>
  );
}

export default App;