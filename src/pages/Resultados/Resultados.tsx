import { Link } from "react-router-dom";
import "./Resultados.css";

interface Resultado {
  id: number;
  escenario: string;
  categoria: string;
  fecha: string;
  tiempo: string;
  puntuacion: number;
  estado: string;
}

const resultados: Resultado[] = [
  {
    id: 1,
    escenario: "Memoria visual",
    categoria: "Memoria",
    fecha: "12 Sep 2026",
    tiempo: "08:42",
    puntuacion: 87,
    estado: "Completado",
  },
  {
    id: 2,
    escenario: "Atención selectiva",
    categoria: "Atención",
    fecha: "10 Sep 2026",
    tiempo: "06:18",
    puntuacion: 74,
    estado: "Completado",
  },
  {
    id: 3,
    escenario: "Secuencia lógica",
    categoria: "Funciones ejecutivas",
    fecha: "08 Sep 2026",
    tiempo: "10:25",
    puntuacion: 92,
    estado: "Completado",
  },
  {
    id: 4,
    escenario: "Reconocimiento de patrones",
    categoria: "Atención",
    fecha: "05 Sep 2026",
    tiempo: "07:51",
    puntuacion: 68,
    estado: "Completado",
  },
];

function Resultados() {
  const promedio = Math.round(
    resultados.reduce(
      (total, resultado) => total + resultado.puntuacion,
      0
    ) / resultados.length
  );

  return (
    <div className="results-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <header className="results-navbar">

        <Link to="/" className="results-brand">

          <div className="results-brand-icon">
            Ψ
          </div>

          <span>LAPSUCC</span>

        </Link>


        <nav className="results-nav">

          <Link to="/">
            Inicio
          </Link>

          <Link to="/catalogo">
            Escenarios
          </Link>

          <Link
            to="/resultados"
            className="active"
          >
            Mi progreso
          </Link>

        </nav>


        <div className="results-user">

          <div className="results-user-info">

            <strong>
              Usuario
            </strong>

            <span>
              Participante
            </span>

          </div>

          <div className="results-avatar">
            U
          </div>

        </div>

      </header>


      {/* =====================================
          CONTENIDO
      ====================================== */}

      <main className="results-main">

        {/* Encabezado */}

        <section className="results-header">

          <div>

            <span className="results-label">
              MI PROGRESO
            </span>

            <h1>
              Resultados y desempeño
            </h1>

            <p>
              Consulta el historial de tus actividades
              y observa cómo ha evolucionado tu desempeño.
            </p>

          </div>


          <Link
            to="/catalogo"
            className="results-action"
          >
            Realizar escenario
            <span>→</span>
          </Link>

        </section>


        {/* =====================================
            ESTADÍSTICAS
        ====================================== */}

        <section className="stats-grid">

          {/* Escenarios */}

          <div className="stat-card">

            <div className="stat-icon purple">
              ◈
            </div>

            <div className="stat-content">

              <span>
                Escenarios realizados
              </span>

              <strong>
                {resultados.length}
              </strong>

              <small>
                Actividades completadas
              </small>

            </div>

          </div>


          {/* Promedio */}

          <div className="stat-card">

            <div className="stat-icon blue">
              ◉
            </div>

            <div className="stat-content">

              <span>
                Promedio de desempeño
              </span>

              <strong>
                {promedio}%
              </strong>

              <small>
                Basado en tus actividades
              </small>

            </div>

          </div>


          {/* Tiempo */}

          <div className="stat-card">

            <div className="stat-icon green">
              ◷
            </div>

            <div className="stat-content">

              <span>
                Tiempo de actividad
              </span>

              <strong>
                33 min
              </strong>

              <small>
                Tiempo acumulado
              </small>

            </div>

          </div>


          {/* Última actividad */}

          <div className="stat-card">

            <div className="stat-icon orange">
              ★
            </div>

            <div className="stat-content">

              <span>
                Última actividad
              </span>

              <strong>
                87%
              </strong>

              <small>
                Memoria visual
              </small>

            </div>

          </div>

        </section>


        {/* =====================================
            RESUMEN DE DESEMPEÑO
        ====================================== */}

        <section className="performance-section">

          <div className="section-title">

            <div>

              <span>
                RESUMEN
              </span>

              <h2>
                Desempeño general
              </h2>

            </div>

          </div>


          <div className="performance-card">

            <div className="performance-score">

              <div className="score-circle">

                <div>

                  <strong>
                    {promedio}
                  </strong>

                  <span>
                    %
                  </span>

                </div>

              </div>

              <div>

                <h3>
                  Promedio de desempeño
                </h3>

                <p>
                  Resultado promedio de las actividades
                  realizadas en la plataforma.
                </p>

              </div>

            </div>


            <div className="performance-bars">

              <div className="bar-item">

                <div className="bar-header">

                  <span>
                    Memoria
                  </span>

                  <strong>
                    87%
                  </strong>

                </div>

                <div className="bar">
                  <div
                    className="bar-fill memory"
                    style={{ width: "87%" }}
                  />
                </div>

              </div>


              <div className="bar-item">

                <div className="bar-header">

                  <span>
                    Atención
                  </span>

                  <strong>
                    71%
                  </strong>

                </div>

                <div className="bar">
                  <div
                    className="bar-fill attention"
                    style={{ width: "71%" }}
                  />
                </div>

              </div>


              <div className="bar-item">

                <div className="bar-header">

                  <span>
                    Funciones ejecutivas
                  </span>

                  <strong>
                    92%
                  </strong>

                </div>

                <div className="bar">
                  <div
                    className="bar-fill executive"
                    style={{ width: "92%" }}
                  />
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            HISTORIAL
        ====================================== */}

        <section className="history-section">

          <div className="history-header">

            <div>

              <span>
                ACTIVIDAD
              </span>

              <h2>
                Historial de resultados
              </h2>

            </div>

            <button className="filter-button">
              Todas las actividades
              <span>⌄</span>
            </button>

          </div>


          <div className="history-card">

            {/* Cabecera */}

            <div className="history-table-header">

              <span>
                ESCENARIO
              </span>

              <span>
                CATEGORÍA
              </span>

              <span>
                FECHA
              </span>

              <span>
                TIEMPO
              </span>

              <span>
                DESEMPEÑO
              </span>

              <span>
                ESTADO
              </span>

            </div>


            {/* Filas */}

            {resultados.map((resultado) => (

              <div
                className="history-row"
                key={resultado.id}
              >

                <div className="scenario-name">

                  <div className="scenario-icon">
                    ◈
                  </div>

                  <strong>
                    {resultado.escenario}
                  </strong>

                </div>


                <span className="category">
                  {resultado.categoria}
                </span>


                <span className="date">
                  {resultado.fecha}
                </span>


                <span className="time">
                  {resultado.tiempo}
                </span>


                <div className="score">

                  <strong>
                    {resultado.puntuacion}%
                  </strong>

                  <div className="mini-bar">

                    <div
                      style={{
                        width:
                          `${resultado.puntuacion}%`,
                      }}
                    />

                  </div>

                </div>


                <span className="status">
                  {resultado.estado}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* =====================================
            NOTA
        ====================================== */}

        <section className="results-note">

          <div className="note-icon">
            i
          </div>

          <div>

            <strong>
              Sobre tus resultados
            </strong>

            <p>
              Los resultados mostrados representan indicadores
              de desempeño obtenidos durante las actividades
              interactivas. Estos datos tienen fines académicos
              y de investigación y no constituyen por sí mismos
              un diagnóstico psicológico.
            </p>

          </div>

        </section>

      </main>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="results-footer">

        <div className="results-footer-brand">

          <div className="results-brand-icon">
            Ψ
          </div>

          <span>
            LAPSUCC
          </span>

        </div>

        <p>
          © 2026 LAPSUCC · Universidad Católica de Colombia
        </p>

      </footer>

    </div>
  );
}

export default Resultados;