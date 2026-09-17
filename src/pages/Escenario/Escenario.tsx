import { useParams, Link } from "react-router-dom";
import "./Escenario.css";

const escenarios = {
  1: {
    titulo: "Memoria visual",
    categoria: "Memoria",
    descripcion:
      "Pon a prueba tu capacidad para recordar y reconocer diferentes elementos visuales.",
    dificultad: "Media",
    duracion: "5 - 10 minutos",
    instrucciones: [
      "Observa cuidadosamente los elementos que aparecen en pantalla.",
      "Memoriza la información presentada.",
      "Responde según lo que recuerdes.",
      "Al finalizar podrás consultar tu desempeño.",
    ],
    // Cambia esta URL por la URL real de tu WebGL
    webglUrl: "https://wd2m.github.io/PruebaWebGL/",
  },

  2: {
    titulo: "Atención selectiva",
    categoria: "Atención",
    descripcion:
      "Actividad interactiva orientada a trabajar la atención y la identificación de estímulos.",
    dificultad: "Media",
    duracion: "5 - 10 minutos",
    instrucciones: [
      "Observa los estímulos que aparecen.",
      "Identifica aquellos que cumplen con la condición indicada.",
      "Responde lo más rápido y correctamente posible.",
      "Al terminar podrás consultar tu desempeño.",
    ],
    webglUrl: "https://wd2m.github.io/Landing_me/",
  },

  3: {
    titulo: "Secuencia lógica",
    categoria: "Funciones ejecutivas",
    descripcion:
      "Resuelve diferentes secuencias y patrones mediante el análisis de información.",
    dificultad: "Alta",
    duracion: "10 minutos",
    instrucciones: [
      "Analiza cuidadosamente cada secuencia.",
      "Identifica el patrón presente.",
      "Selecciona la respuesta que consideres correcta.",
      "Continúa hasta completar la actividad.",
    ],
    webglUrl: "http://localhost:8080/secuencia/index.html",
  },
};

function Escenario() {
  const { id } = useParams();
  const escenario =
    escenarios[id as unknown as keyof typeof escenarios] ?? escenarios[1];
  return (
    <div className="escenario-page">

      {/* NAVBAR */}
      <nav className="escenario-navbar">
        <Link to="/" className="escenario-logo">
          <span className="logo-symbol">Ψ</span>

          <div>
            <strong>LAPSUCC</strong>
            <small>Laboratorio de Psicología</small>
          </div>
        </Link>

        <div className="escenario-nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Escenarios</Link>
          <Link to="/resultados">Mi progreso</Link>
        </div>

        <div className="escenario-user">
          <div className="user-avatar">U</div>
          <span>Usuario</span>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="escenario-container">

        {/* MIGAS */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Escenarios</Link>
          <span>/</span>
          <strong>{escenario.titulo}</strong>
        </div>

        {/* HEADER */}
        <section className="escenario-header">

          <div className="escenario-header-info">

            <span className="categoria-badge">
              {escenario.categoria}
            </span>

            <h1>{escenario.titulo}</h1>

            <p>{escenario.descripcion}</p>

            <div className="escenario-metadata">

              <div>
                <span>◈</span>
                <div>
                  <small>Dificultad</small>
                  <strong>{escenario.dificultad}</strong>
                </div>
              </div>

              <div>
                <span>◷</span>
                <div>
                  <small>Duración</small>
                  <strong>{escenario.duracion}</strong>
                </div>
              </div>

            </div>

          </div>

          <div className="escenario-symbol">
            Ψ
          </div>

        </section>

        {/* INSTRUCCIONES */}
        <section className="instrucciones-section">

          <div className="section-title">
            <span className="title-icon">i</span>

            <div>
              <h2>Instrucciones</h2>
              <p>Antes de comenzar, ten en cuenta lo siguiente.</p>
            </div>
          </div>

          <div className="instrucciones-list">

            {escenario.instrucciones.map((instruccion, index) => (
              <div className="instruccion" key={index}>

                <span className="instruction-number">
                  {index + 1}
                </span>

                <p>{instruccion}</p>

              </div>
            ))}

          </div>

        </section>

        {/* WEBGL */}
        <section className="webgl-section">

          <div className="webgl-header">

            <div>
              <span className="online-indicator"></span>
              <strong>Escenario interactivo</strong>
            </div>

            <span className="webgl-status">
              WebGL
            </span>

          </div>

          <div className="webgl-container">

            <iframe
              src={escenario.webglUrl}
              title={escenario.titulo}
              className="webgl-frame"
              allowFullScreen
            />

          </div>

          <p className="webgl-help">
            El escenario se ejecuta directamente en tu navegador.
            Utiliza las instrucciones indicadas para completar la actividad.
          </p>

        </section>

        {/* RESULTADOS */}
        <section className="resultado-info">

          <div className="resultado-icon">
            ✓
          </div>

          <div>
            <h3>Al finalizar</h3>

            <p>
              Tu desempeño podrá ser registrado para consultar posteriormente
              tus resultados y evolución en las actividades realizadas.
            </p>
          </div>

        </section>

        {/* BOTONES */}
        <div className="escenario-actions">

          <Link
            to="/catalogo"
            className="btn-secondary"
          >
            ← Volver a escenarios
          </Link>

          <Link
            to="/resultados"
            className="btn-primary"
          >
            Ver mis resultados →
          </Link>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="escenario-footer">

        <div>
          <strong>LAPSUCC</strong>
          <p>
            Plataforma web de escenarios interactivos
            para el estudio y evaluación de constructos psicológicos.
          </p>
        </div>

        <span>
          © 2026 LAPSUCC
        </span>

      </footer>

    </div>
  );
}

export default Escenario;