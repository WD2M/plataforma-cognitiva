import { Link } from "react-router-dom";
import "./Administracion.css";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  fecha: string;
}

interface Escenario {
  id: number;
  nombre: string;
  categoria: string;
  participantes: number;
  estado: "Activo" | "Inactivo";
}

const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: "María González",
    correo: "maria.gonzalez@email.com",
    rol: "Participante",
    estado: "Activo",
    fecha: "12 Sep 2026",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    correo: "carlos.rodriguez@email.com",
    rol: "Participante",
    estado: "Activo",
    fecha: "11 Sep 2026",
  },
  {
    id: 3,
    nombre: "Laura Martínez",
    correo: "laura.martinez@email.com",
    rol: "Investigador",
    estado: "Activo",
    fecha: "08 Sep 2026",
  },
  {
    id: 4,
    nombre: "Andrés Pérez",
    correo: "andres.perez@email.com",
    rol: "Participante",
    estado: "Inactivo",
    fecha: "05 Sep 2026",
  },
];

const escenarios: Escenario[] = [
  {
    id: 1,
    nombre: "Memoria visual",
    categoria: "Memoria",
    participantes: 128,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Atención selectiva",
    categoria: "Atención",
    participantes: 94,
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Secuencia lógica",
    categoria: "Funciones ejecutivas",
    participantes: 76,
    estado: "Activo",
  },
];

import { useNavigate } from "react-router-dom";

function Administracion() {

  const navigate = useNavigate();

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-logo">Ψ</div>

          <div>
            <strong>LAPSUCC</strong>
            <span>Administración</span>
          </div>
        </div>

        <nav className="admin-menu">

          <p className="menu-title">GENERAL</p>

          <Link to="/administracion" className="menu-item active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/resultados" className="menu-item">
            <span>◉</span>
            Resultados
          </Link>

          <p className="menu-title">GESTIÓN</p>

          <button className="menu-item">
            <span>♙</span>
            Usuarios
          </button>

          <button className="menu-item">
            <span>▣</span>
            Escenarios
          </button>

          <button className="menu-item">
            <span>▤</span>
            Reportes
          </button>

          <p className="menu-title">SISTEMA</p>

          <button className="menu-item">
            <span>⚙</span>
            Configuración
          </button>

        </nav>

        <div className="sidebar-bottom">

          <Link to="/" className="back-home">
            ← Volver a la plataforma
          </Link>

        </div>

      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <div>
            <h1>Panel de administración</h1>
            <p>
              Gestiona usuarios, escenarios y resultados de la plataforma.
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrador</strong>
              <span>Administrador</span>
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="admin-content">

          {/* STATS */}
          <section className="admin-stats">

            <div className="stat-card">

              <div className="stat-icon users-icon">
                ♙
              </div>

              <div>
                <span>Usuarios registrados</span>
                <strong>324</strong>
                <small>+12 este mes</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon scenarios-icon">
                ▣
              </div>

              <div>
                <span>Escenarios activos</span>
                <strong>8</strong>
                <small>2 nuevas actividades</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon results-icon">
                ◉
              </div>

              <div>
                <span>Evaluaciones realizadas</span>
                <strong>1,286</strong>
                <small>+18.4% este mes</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon activity-icon">
                ◷
              </div>

              <div>
                <span>Actividad hoy</span>
                <strong>47</strong>
                <small>Evaluaciones completadas</small>
              </div>

            </div>

          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-actions">

            <div>
              <h2>Acciones rápidas</h2>
              <p>Accede rápidamente a las funciones principales.</p>
            </div>

            <div className="quick-buttons">

               
              <button onClick={() =>
                    navigate("/administracion/nuevo-escenario") 
                  }>
                <span>+</span>
                Nuevo escenario             
              </button>

              <button>
                <span>♙</span>
                Nuevo usuario
              </button>

              <button>
                <span>▤</span>
                Generar reporte
              </button>

            </div>

          </section>

          {/* TWO COLUMNS */}
          <section className="admin-grid">

            {/* USERS */}
            <div className="admin-panel">

              <div className="panel-header">

                <div>
                  <h2>Usuarios recientes</h2>
                  <p>Últimos usuarios registrados</p>
                </div>

                <button className="view-all">
                  Ver todos
                </button>

              </div>

              <div className="users-list">

                {usuarios.map((usuario) => (

                  <div className="user-row" key={usuario.id}>

                    <div className="user-row-avatar">
                      {usuario.nombre.charAt(0)}
                    </div>

                    <div className="user-data">

                      <strong>
                        {usuario.nombre}
                      </strong>

                      <span>
                        {usuario.correo}
                      </span>

                    </div>

                    <div className="user-role">
                      <span className="role-badge">
                        {usuario.rol}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`status ${
                          usuario.estado === "Activo"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {usuario.estado}
                      </span>
                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* SCENARIOS */}
            <div className="admin-panel">

              <div className="panel-header">

                <div>
                  <h2>Escenarios</h2>
                  <p>Actividades disponibles</p>
                </div>

                <button className="view-all">
                  Administrar
                </button>

              </div>

              <div className="scenario-list">

                {escenarios.map((escenario) => (

                  <div
                    className="scenario-row"
                    key={escenario.id}
                  >

                    <div className="scenario-icon">
                      Ψ
                    </div>

                    <div className="scenario-data">

                      <strong>
                        {escenario.nombre}
                      </strong>

                      <span>
                        {escenario.categoria}
                      </span>

                    </div>

                    <div className="scenario-participants">

                      <strong>
                        {escenario.participantes}
                      </strong>

                      <span>
                        participantes
                      </span>

                    </div>

                    <span className="status status-active">
                      {escenario.estado}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </section>

          {/* ACTIVITY */}
          <section className="admin-panel activity-panel">

            <div className="panel-header">

              <div>
                <h2>Actividad reciente</h2>
                <p>
                  Actividad registrada en la plataforma
                </p>
              </div>

              <button className="view-all">
                Ver historial
              </button>

            </div>

            <div className="activity-table">

              <div className="table-header">
                <span>Usuario</span>
                <span>Actividad</span>
                <span>Escenario</span>
                <span>Fecha</span>
                <span>Estado</span>
              </div>

              <div className="table-row">

                <span>
                  María González
                </span>

                <span>
                  Completó escenario
                </span>

                <span>
                  Memoria visual
                </span>

                <span>
                  Hoy, 10:32
                </span>

                <span className="status status-active">
                  Completado
                </span>

              </div>

              <div className="table-row">

                <span>
                  Carlos Rodríguez
                </span>

                <span>
                  Completó escenario
                </span>

                <span>
                  Atención selectiva
                </span>

                <span>
                  Hoy, 09:48
                </span>

                <span className="status status-active">
                  Completado
                </span>

              </div>

              <div className="table-row">

                <span>
                  Laura Martínez
                </span>

                <span>
                  Nuevo reporte
                </span>

                <span>
                  Funciones ejecutivas
                </span>

                <span>
                  Ayer, 16:20
                </span>

                <span className="status status-report">
                  Reporte
                </span>

              </div>

            </div>

          </section>

          {/* SYSTEM INFORMATION */}
          <section className="system-card">

            <div className="system-info">

              <div className="system-icon">
                ✓
              </div>

              <div>
                <h3>Sistema operativo</h3>

                <p>
                  Todos los servicios principales de la plataforma
                  se encuentran disponibles.
                </p>
              </div>

            </div>

            <div className="system-status">

              <div>
                <span></span>
                Firebase
              </div>

              <div>
                <span></span>
                Base de datos
              </div>

              <div>
                <span></span>
                WebGL
              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Administracion;