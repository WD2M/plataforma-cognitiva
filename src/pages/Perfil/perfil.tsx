import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { cerrarSesion } from "../../services/authService";
import { useNavigate } from "react-router-dom";

import "./Perfil.css";

function Perfil() {
  const { user, perfil } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);

  const nombreCompleto = perfil
    ? `${perfil.nombre} ${perfil.apellido}`
    : "Cargando...";

  const inicial = perfil?.nombre
    ? perfil.nombre.charAt(0).toUpperCase()
    : "U";

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion();
      navigate("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <div className="perfil-page">

      {/* NAVBAR */}

      <header className="perfil-navbar">

        <div
          className="perfil-brand"
          onClick={() => navigate("/")}
        >
          <div className="perfil-brand-icon">
            Ψ
          </div>

          <div>
            <strong>LAPSUCC</strong>
            <span>Laboratorio Psicológico</span>
          </div>
        </div>

        <nav>
          <button onClick={() => navigate("/")}>
            Inicio
          </button>

          <button onClick={() => navigate("/resultados")}>
            Resultados
          </button>

          <button
            className="perfil-nav-active"
            onClick={() => navigate("/perfil")}
          >
            Perfil
          </button>
        </nav>

      </header>


      {/* CONTENIDO */}

      <main className="perfil-container">

        <div className="perfil-heading">

          <div>
            <span className="perfil-eyebrow">
              MI CUENTA
            </span>

            <h1>Mi perfil</h1>

            <p>
              Consulta y administra tu información personal.
            </p>
          </div>

        </div>


        {/* TARJETA PRINCIPAL */}

        <section className="perfil-card perfil-main-card">

          <div className="perfil-user-header">

            <div className="perfil-avatar">
              {inicial}
            </div>

            <div className="perfil-user-name">

              <h2>
                {nombreCompleto}
              </h2>

              <span className="perfil-role">
                {perfil?.rol || "Participante"}
              </span>

              <p>
                {user?.email}
              </p>

            </div>

          </div>

        </section>


        {/* INFORMACIÓN */}

        <section className="perfil-card">

          <div className="perfil-card-header">

            <div>
              <h2>Información personal</h2>

              <p>
                Información asociada a tu cuenta.
              </p>
            </div>

            <button
              className="perfil-edit-button"
              onClick={() => setEditando(!editando)}
            >
              {editando ? "Cancelar" : "Editar"}
            </button>

          </div>


          <div className="perfil-info-grid">

            <div className="perfil-field">

              <label>Nombre</label>

              <div className="perfil-field-value">
                {perfil?.nombre || "—"}
              </div>

            </div>


            <div className="perfil-field">

              <label>Apellido</label>

              <div className="perfil-field-value">
                {perfil?.apellido || "—"}
              </div>

            </div>


            <div className="perfil-field">

              <label>Correo electrónico</label>

              <div className="perfil-field-value">
                {user?.email || perfil?.email || "—"}
              </div>

            </div>


            <div className="perfil-field">

              <label>Tipo de usuario</label>

              <div className="perfil-field-value">
                {perfil?.rol || "Participante"}
              </div>

            </div>

          </div>

        </section>


        {/* ACTIVIDAD */}

        <section className="perfil-card">

          <div className="perfil-card-header">

            <div>
              <h2>Mi actividad</h2>

              <p>
                Resumen de tu actividad en la plataforma.
              </p>
            </div>

            <button
              className="perfil-secondary-button"
              onClick={() => navigate("/resultados")}
            >
              Ver resultados
            </button>

          </div>


          <div className="perfil-stats">

            <div className="perfil-stat">

              <span className="perfil-stat-icon">
                ◉
              </span>

              <div>
                <strong>0</strong>
                <span>Escenarios realizados</span>
              </div>

            </div>


            <div className="perfil-stat">

              <span className="perfil-stat-icon">
                %
              </span>

              <div>
                <strong>—</strong>
                <span>Puntuación promedio</span>
              </div>

            </div>


            <div className="perfil-stat">

              <span className="perfil-stat-icon">
                ◷
              </span>

              <div>
                <strong>—</strong>
                <span>Última actividad</span>
              </div>

            </div>

          </div>

        </section>


        {/* SEGURIDAD */}

        <section className="perfil-card perfil-security">

          <div>

            <h2>Sesión</h2>

            <p>
              Cierra tu sesión actual de LAPSUCC.
            </p>

          </div>

          <button
            className="perfil-logout-button"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>

        </section>

      </main>


      <footer className="perfil-footer">
        © 2026 LAPSUCC · Plataforma de escenarios interactivos
      </footer>

    </div>
  );
}

export default Perfil;