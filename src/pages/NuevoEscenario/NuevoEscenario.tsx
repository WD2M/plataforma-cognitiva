import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/config";

import "./NuevoEscenario.css";

function NuevoEscenario() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Memoria");
  const [descripcion, setDescripcion] = useState("");
  const [dificultad, setDificultad] = useState("Media");
  const [duracion, setDuracion] = useState("");
  const [webglUrl, setWebglUrl] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [activo, setActivo] = useState(true);


  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const guardarEscenario = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (!webglUrl.trim()) {
      setError("La URL del escenario WebGL es obligatoria.");
      return;
    }

    if (!imagenUrl.trim()) {
      setError("La URL de la imagen es obligatoria.");
      return;
    }

    try {
      setGuardando(true);

      await addDoc(collection(db, "escenarios"), {
        titulo: titulo.trim(),
        categoria,
        descripcion: descripcion.trim(),
        dificultad,
        duracion: duracion.trim(),
        webglUrl: webglUrl.trim(),
        activo,
        creadoEn: serverTimestamp(),
        imagenUrl: imagenUrl.trim(),
      });

      alert("Escenario creado correctamente.");

      navigate("/administracion");

    } catch (error) {
      console.error("Error creando escenario:", error);
      setError("No fue posible crear el escenario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="nuevo-escenario">

      <div className="nuevo-escenario-header">
        <div>
          <span className="nuevo-escenario-label">
            ADMINISTRACIÓN
          </span>

          <h1>Nuevo escenario</h1>

          <p>
            Registra un nuevo escenario interactivo en la plataforma.
          </p>
        </div>

        <button
          type="button"
          className="btn-volver"
          onClick={() => navigate("/administracion")}
        >
          ← Volver
        </button>
      </div>

      <form
        className="escenario-form"
        onSubmit={guardarEscenario}
      >

        <div className="form-section">

          <h2>Información general</h2>

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="titulo">
                Nombre del escenario
              </label>

              <input
                className="textos"
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Memoria visual"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">
                Categoría
              </label>

              <select
              className="textos"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="Memoria">Memoria</option>
                <option value="Atención">Atención</option>
                <option value="Funciones ejecutivas">
                  Funciones ejecutivas
                </option>
              </select>
            </div>

            <div className="form-group form-full">
              <label htmlFor="descripcion">
                Descripción
              </label>

              <textarea
                className="textos"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente el objetivo del escenario..."
                rows={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dificultad">
                Dificultad
              </label>

              <select
                className="textos"
                id="dificultad"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duracion">
                Duración aproximada
              </label>

              <input
                className="textos"
                id="duracion"
                type="text"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                placeholder="Ej. 5 - 10 minutos"
              />
            </div>

          </div>

        </div>


        <div className="form-section">

          <h2>Escenario WebGL</h2>

          <p className="section-description">
            Introduce la dirección donde está alojado el escenario
            interactivo.
          </p>

          <div className="form-group">

            <label htmlFor="webglUrl">
              URL del escenario
            </label>

            <input 
              className="textos"
              id="webglUrl"
              type="url"
              value={webglUrl}
              onChange={(e) => setWebglUrl(e.target.value)}
              placeholder="https://usuario.github.io/memoria/"
            />

            <small>
              Ejemplo: https://usuario.github.io/escenarios/memoria/
            </small>

          </div>

        </div>

         <div className="form-section">

          <h2>Imagen del escenario</h2>

          <p className="section-description">
            Introduce la dirección donde está alojada la imagen del escenario
            interactivo.
          </p>

          <div className="form-group">

            <label htmlFor="webglUrl">
              URL de la imagen
            </label>

            <input
              className="textos"
              id="imagenUrl"
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://usuario.github.io/memoria/"
            />

            <small>
              Ejemplo: https://usuario.github.io/escenarios/memoria/
            </small>

          </div>

        </div>

        <div className="form-section">

          <h2>Estado</h2>

          <label className="switch-container">

            <input
              className="textos"
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />

            <span className="switch"></span>

            <div>
              <strong>
                Escenario activo
              </strong>

              <p>
                Los participantes podrán visualizar y ejecutar
                este escenario.
              </p>
            </div>

          </label>

        </div>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        <div className="form-actions">

          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/administracion")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Crear escenario"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default NuevoEscenario;