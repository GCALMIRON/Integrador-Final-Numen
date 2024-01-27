import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './MenuRecetas.css';

const MenuRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [nuevaReceta, setNuevaReceta] = useState({
    nombre: '',
    ingredientes: '',
    pasos: ''
  });
  const [recetaModificando, setRecetaModificando] = useState(null);
  const [errores, setErrores] = useState([]);
  const [chiste, setChiste] = useState([]);

  // Obtener el chiste de Chuck Norris desde una API externa
  useEffect(() => {
    const getChiste = async () => {
      const response = await fetch('https://api.chucknorris.io/jokes/random')
      const { value } = await response.json();
      setChiste({
        broma: value,
      })
    }
    getChiste()
  }, [])
  
  const { broma } = chiste

  // Obtener las recetas al cargar el componente

  useEffect(() => {
    obtenerRecetas();
  }, []);

  // Pedir recetas a la DB

  const obtenerRecetas = async () => {
    try {
      const response = await axios.get('/recetas');
      setRecetas(response.data);
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    }
  };

  // Agregar recetas a la DBase

  const agregarReceta = async () => {
    try {
      console.log('Agregando receta...');
      const response = await axios.post('/recetas', nuevaReceta);
      console.log('Respuesta del servidor:', response);

      // Verifica si la respuesta tiene errores
      if (response.data && response.data.errores) {
        console.error('Error al agregar receta:', response.data.errores);
        setErrores(response.data.errores.map(error => error.msg));
        return;
      }

      // Si no hay errores, continua la carga de receta
      obtenerRecetas(); // Vuelve a cargar la lista
      setNuevaReceta({
        nombre: '',
        ingredientes: '',
        pasos: ''
      });

      setErrores([]);
    } catch (error) {
      console.error('Error al agregar receta:', error);
      alertaVacio()
    }
  };

  const alertaVacio=()=>{
    swal({
      title: "La receta no puede tener campos vacíos",
      text: 'Por favor, revisa tu receta y volvé a enviarla.',
      icon: "error",
      button: 'aceptar'
    });

  }

  // Eliminar receta de la DB

  const eliminarReceta = async (id) => {
    try {
      await axios.delete(`/recetas/${id}`);
      obtenerRecetas(); // Vuelve a cargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar receta:', error);
    }
  };

  // Modificar receta de la DB

  const handleModificarReceta = async () => {
    try {
      if (!recetaModificando) {
        console.error('Receta a modificar no está definida');
        return;
      }

      const { _id, nombre, ingredientes, pasos } = recetaModificando;

      await axios.put(`/recetas/${_id}`, {
        nombre,
        ingredientes,
        pasos,
      });

      obtenerRecetas();
      setRecetaModificando(null);
    } catch (error) {
      console.error('Error al modificar receta:', error);
    }
  };

  return (
    <div>
      <header>
        <nav>
          <div className="logo">
            <img src="./logonew.png" alt="Logo" />
          </div>
          <div className="broma">
            <p>{ broma }</p>
          </div>
          <ul>
            <li className="inicio"><a href="/">Inicio</a></li>
          </ul>
        </nav>
      </header>

      {/* Formulario para agregar nueva receta */}

      <h2>Agregar Nueva Receta</h2>

      <form id="receta-form" onSubmit={(e) => { e.preventDefault(); agregarReceta(); }}>

        {/* Mostrar mensajes de error */}
        {errores.length > 0 && (
          <div className="error-container">
            <p>Error al agregar receta:</p>
            <ul>
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <label>Nombre:</label>
        <input
          name="nombre"
          value={nuevaReceta.nombre}
          onChange={(e) => setNuevaReceta({ ...nuevaReceta, nombre: e.target.value })}
        />

        <label>Ingredientes:</label>
        <textarea
          name="ingredientes"
          value={nuevaReceta.ingredientes}
          onChange={(e) => setNuevaReceta({ ...nuevaReceta, ingredientes: e.target.value })}
        />

        <label>Instrucciones:</label>
        <textarea
          name="pasos"
          value={nuevaReceta.pasos}
          onChange={(e) => setNuevaReceta({ ...nuevaReceta, pasos: e.target.value })}
        />

        <button type="submit">Agregar Receta</button>
      </form>

      {/* Botón de modificar receta */}
      {recetaModificando && (
        <div>
          <h2>Modificar Receta</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleModificarReceta(); }}>

            {/* Campos de input para modificar la receta */}
            <label>Nombre:</label>
            <input
              type="text"
              value={recetaModificando.nombre}
              onChange={(e) => setRecetaModificando({ ...recetaModificando, nombre: e.target.value })}
            />
            <label>Ingredientes:</label>
            <textarea
              value={recetaModificando.ingredientes}
              onChange={(e) => setRecetaModificando({ ...recetaModificando, ingredientes: e.target.value })}
            />
            <label>Pasos:</label>
            <textarea
              value={recetaModificando.pasos}
              onChange={(e) => setRecetaModificando({ ...recetaModificando, pasos: e.target.value })}
            />
            <button type="submit">Guardar Modificación</button>
          </form>
        </div>
      )}

      {/* Lista de recetas */}
      <h2>Lista de Recetas</h2>
      <ul>
        {recetas.map((receta) => (
          <li key={receta._id}>
            <div>
              <strong>{receta.nombre}</strong>
              <p>Ingredientes: {receta.ingredientes}</p>
              <p>Instrucciones: {receta.pasos}</p>
            </div>
            <button onClick={() => setRecetaModificando(receta)}>Modificar</button>
            <button onClick={() => eliminarReceta(receta._id)}>Eliminar</button>
          </li>
        ))}
      </ul>



    </div>
  );
}

export default MenuRecetas;