import { Link } from "react-router-dom";
import "./Inicio.css";

import { useAuth } from "../../context/AuthContext";

function Inicio() {

  const { perfil } = useAuth();
  
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

          <span>LAPSUCC</span>
        </Link>


        <nav className="home-nav">

          <Link to="/" className="active">
            Inicio
          </Link>

          <Link to="/catalogo">
            Escenarios
          </Link>

          <Link to="/resultados">
            Mi progreso
          </Link>

        </nav>


        <div className="home-user">

          <div className="home-user-info">
            <strong>
              {perfil
              ? `${perfil.nombre}`
              : "Cargando..."}
            </strong>

            <span>
              {perfil
              ? `${perfil.rol}`
              : "Cargando..."}
            </span>
          </div>

          
          <Link to="/administracion">
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
              PLATAFORMA INTERACTIVA
            </span>

            <h1>
              Explora tu
              <br />

              <span>experiencia cognitiva.</span>
            </h1>

            <p>
              Participa en escenarios interactivos diseñados
              para explorar diferentes procesos cognitivos como
              memoria, atención y funciones ejecutivas.
            </p>


            <div className="hero-buttons">

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
                12
              </strong>

            </div>


            <div className="floating-card card-bottom">

              <span>Progreso</span>

              <strong>
                78%
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

            <Link
              to="/catalogo"
              className="see-all"
            >
              Ver todos →
            </Link>

          </div>


          <div className="quick-grid">


            {/* Escenarios */}

            <Link
              to="/catalogo"
              className="quick-card"
            >

              <div className="quick-icon purple">
                ◈
              </div>

              <div>

                <h3>
                  Explorar escenarios
                </h3>

                <p>
                  Descubre las actividades interactivas
                  disponibles.
                </p>

              </div>

              <span className="card-arrow">
                →
              </span>

            </Link>


            {/* Progreso */}

            <Link
              to="/resultados"
              className="quick-card"
            >

              <div className="quick-icon blue">
                ◉
              </div>

              <div>

                <h3>
                  Consultar progreso
                </h3>

                <p>
                  Revisa tus resultados y desempeño.
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
                  Mi perfil
                </h3>

                <p>
                  Administra la información de tu cuenta.
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

              <Link
                to="/catalogo"
                className="about-link"
              >
                Comenzar una actividad →
              </Link>

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

export default Inicio;