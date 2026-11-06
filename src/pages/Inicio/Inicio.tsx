import { Link } from "react-router-dom";
import "./Inicio.css";

import { useAuth } from "../../context/AuthContext";

function Inicio() {

  const { perfil, escenario } = useAuth();
  const esAdmin = perfil?.rol?.toLowerCase() === "administrador";
  
  return (
    <div className="home-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <header className="home-navbar">

        <Link to="/" className="home-brand">
          <div className="home-brand-icon">
            Ψ
          </div>

          <span>Increase</span>
        </Link>


        <nav className="home-nav">

          <Link to="/" className="active">
            Inicio
          </Link>

          {esAdmin ? (
            <>
              <Link to="/administracion">
                Panel Admin
              </Link>
              <Link to="/perfil">
                Monitoreo de Pacientes
              </Link>
            </>
          ) : (
            <>
              <Link to="/catalogo">
                Escenarios
              </Link>

              <Link to="/resultados">
                Mi progreso
              </Link>
            </>
          )}

        </nav>


        <div className="home-user">

          <div className="home-user-info">
            <strong>
              {perfil
              ? `${perfil.nombre}`
              : "Cargando..."}
            </strong>

            <span>
              {perfil? `${perfil.rol}` : "Cargando..."}
            </span>
          </div>

          
          <Link to="/perfil">
              <div className="home-avatar">
                {perfil? `${perfil.nombre[0]}` : "Cargando..."}
              </div>
          </Link>

        </div>

      </header>


      {/* =====================================
          HERO
      ====================================== */}

      <main>

        <section className="home-hero">

          <div className="hero-content">

            <span className="hero-tag">
              {esAdmin ? "PANEL DE SUPERVISIÓN CLÍNICA" : "PLATAFORMA INTERACTIVA"}
            </span>

            <h1>
              {esAdmin ? "Supervisa el" : "Explora tu"}
              <br />

              <span>
                {esAdmin ? "desempeño cognitivo." : "experiencia cognitiva."}
              </span>
            </h1>

            <p>
              {esAdmin
                ? "Monitorea a los pacientes registrados, consulta sus evaluaciones por nombre o documento y analiza el desglose detallado de aciertos y fallos por nivel."
                : "Participa en escenarios interactivos diseñados para explorar diferentes procesos cognitivos como memoria, atención y funciones ejecutivas."}
            </p>


            <div className="hero-buttons">

              {esAdmin ? (
                <>
                  <Link
                    to="/perfil"
                    className="primary-button"
                  >
                    Monitorear pacientes
                    <span>→</span>
                  </Link>

                  <Link
                    to="/administracion"
                    className="secondary-button"
                  >
                    Panel de administración
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/catalogo"
                    className="primary-button"
                  >
                    Explorar escenarios
                    <span>→</span>
                  </Link>

                  <Link
                    to="/resultados"
                    className="secondary-button"
                  >
                    Ver mi progreso
                  </Link>
                </>
              )}

            </div>

          </div>


          {/* Elemento visual */}

          <div className="hero-visual">

            <div className="visual-glow"></div>

            <div className="brain-card">

              <div className="brain-symbol">
                Ψ
              </div>

              <div className="brain-ring ring-one"></div>
              <div className="brain-ring ring-two"></div>
              <div className="brain-ring ring-three"></div>

              <div className="brain-dot dot-one"></div>
              <div className="brain-dot dot-two"></div>
              <div className="brain-dot dot-three"></div>

            </div>


            <div className="floating-card card-top">

              <span>Escenarios</span>

              <strong>
                {escenario? `${escenario.count}` : "Cargando..."}
              </strong>

            </div>


            <div className="floating-card card-bottom">

              <span>{esAdmin ? "Supervisión" : "Progreso"}</span>

              <strong>
                {esAdmin ? "Activa" : "78%"}
              </strong>

              <div className="progress-mini">
                <div></div>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            ACCESOS RÁPIDOS
        ====================================== */}

        <section className="quick-section">

          <div className="section-header">

            <div>
              <span className="section-label">
                ACCESO RÁPIDO
              </span>

              <h2>
                ¿Qué quieres hacer?
              </h2>
            </div>

          </div>


          <div className="quick-grid">


            {/* Escenarios / Administración */}

            <Link
              to={esAdmin ? "/administracion" : "/catalogo"}
              className="quick-card"
            >

              <div className="quick-icon purple">
                ◈
              </div>

              <div>

                <h3>
                  {esAdmin ? "Panel Administrativo" : "Explorar escenarios"}
                </h3>

                <p>
                  {esAdmin
                    ? "Supervisa métricas, escenarios y actividad global."
                    : "Descubre las actividades interactivas disponibles."}
                </p>

              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>


            {/* Progreso / Pacientes */}

            <Link
              to={esAdmin ? "/perfil" : "/resultados"}
              className="quick-card"
            >

              <div className="quick-icon blue">
                ◉
              </div>

              <div>

                <h3>
                  {esAdmin ? "Buscar pacientes y resultados" : "Consultar progreso"}
                </h3>

                <p>
                  {esAdmin
                    ? "Busca por nombre o documento e inspecciona sus informes."
                    : "Revisa tus resultados y desempeño."}
                </p>

              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>


            {/* Perfil */}

            <Link
              to="/perfil"
              className="quick-card"
            >

              <div className="quick-icon green">
                ◎
              </div>

              <div>

                <h3>
                  {esAdmin ? "Perfil de Supervisor" : "Mi perfil"}
                </h3>

                <p>
                  {esAdmin
                    ? "Gestiona tu cuenta e historial de supervisión."
                    : "Administra la información de tu cuenta."}
                </p>

              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>

          </div>

        </section>


        {/* =====================================
            INFORMACIÓN
        ====================================== */}

        <section className="about-section">

          <div className="about-card">

            <div className="about-symbol">
              Ψ
            </div>

            <div className="about-content">

              <span>
                SOBRE LA PLATAFORMA
              </span>

              <h2>
                Una experiencia interactiva
                para el estudio cognitivo.
              </h2>

              <p>
                Esta plataforma integra escenarios interactivos
                orientados al estudio de diferentes constructos
                psicológicos. Las actividades permiten registrar
                información relacionada con el desempeño del
                participante.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="home-footer">

        <div className="footer-brand">
          <div className="home-brand-icon">
            Ψ
          </div>

          <span>
            Increase
          </span>
        </div>

        <p>
          © 2026 Increase
        </p>

      </footer>

    </div>
  );
}

export default Inicio;
