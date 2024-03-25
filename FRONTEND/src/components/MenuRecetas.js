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
  const [ingredientesBusqueda, setIngredientesBusqueda] = useState('');
  const [recetasEncontradas, setRecetasEncontradas] = useState([]);
  const [detallesReceta, setDetallesReceta] = useState(null);

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

  // Buscar recetas en API externa por ingrediente

  const buscarRecetas = async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientesBusqueda}`);
      const data = response.data;
      if (data && data.meals) {
        setRecetasEncontradas(data.meals);
      } else {
        setRecetasEncontradas([]);
      }
    } catch (error) {
      console.error('Error al buscar recetas:', error);
      // Acá voy a manejar errores de solicitud
    }
  };

  // Función para mostrar detalles de la receta seleccionada

  const mostrarDetallesReceta = async (receta) => {
    try {
      // Hacer la solicitud al nuevo endpoint para obtener los detalles de la receta por nombre
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${receta.strMeal}`);
      
      const data = response.data;
      if (data && data.meals && data.meals.length > 0) {
        // Setear los detalles de la receta
        setDetallesReceta(data.meals[0]);
      } else {
        console.error('No se encontraron detalles para la receta:', receta.strMeal);
      }
    } catch (error) {
      console.error('Error al obtener detalles de la receta:', error);
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

      {/* Formulario para buscar recetas por ingrediente en api externa*/}
      <div className="recetasfuera">
        <h2>¿Te levantaste con poca inspiración?</h2>
        <h3>Dejanos ayudarte. Buscá recetas nuevas, eligiendo el ingrediente principal.</h3>
        <h5>Aclaración: la receta y los ingredientes están en inglés. (Ej. Chicken, lamb, potato, etc)</h5>
        <div><h3>Ingrediente principal:</h3>
        <input
            type="text"
            value={ingredientesBusqueda}
            onChange={(e) => setIngredientesBusqueda(e.target.value)}
          />
          </div>
          <p></p>
        <button onClick={buscarRecetas}>Buscar recetas</button>
      </div>

      {/* Mostrar recetas encontradas */}
      <div>
        <h2>Recetas Encontradas</h2>
        <ul>
          {recetasEncontradas.map((receta) => (
            <li key={receta.idMeal} onClick={() => mostrarDetallesReceta(receta)}>
                <div>
                  <strong>{receta.strMeal}</strong>
                {/* Aquí se muestran los detalles de la receta */}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mostrar detalles de la receta seleccionada */}
    <div className="contenedor">
    {detallesReceta && (
      <div>
        <h2>Detalles de la Receta</h2>
        <table className="detalles-receta-table">
      <tbody>
        <tr>
          <th>Nombre:</th>
          <td>{detallesReceta.strMeal}</td>
        </tr>
        <tr>
          <th>Ingredientes:</th>
          <td>{detallesReceta.strIngredient1}, {detallesReceta.strIngredient2}, {detallesReceta.strIngredient3}, {detallesReceta.strIngredient4}, {detallesReceta.strIngredient5}, {detallesReceta.strIngredient6}, {detallesReceta.strIngredient7}, {detallesReceta.strIngredient8}, {detallesReceta.strIngredient9}, {detallesReceta.strIngredient10}</td>
        </tr>
        <tr>
          <th>Pasos:</th>
          <td>{detallesReceta.strInstructions}</td>
        </tr>
      </tbody>
    </table>
    {/* <button onClick={agregarRecetaEncontrada}>Agregar Receta Encontrada</button> */}
      </div>
    )}
    </div>

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