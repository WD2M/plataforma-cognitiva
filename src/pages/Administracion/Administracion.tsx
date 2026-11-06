import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Administracion.css";
import { cerrarSesion } from "../../services/authService";
import {
  obtenerTodosLosResultados,
  type RegistroResultado,
} from "../../services/resultadosService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import type { Timestamp } from "firebase/firestore";

interface UsuarioItem {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

interface EscenarioItem {
  id: string;
  nombre: string;
  categoria: string;
  participantes: number;
  estado: string;
}

function formatearFechaHora(fecha: unknown): string {
  if (!fecha) return "—";
  try {
    const timestamp = fecha as Timestamp;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(fecha as any);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function Administracion() {
  const navigate = useNavigate();

  const [, setError] = useState("");
  const [, setCargando] = useState(false);

  // Estados de datos reales
  const [resultados, setResultados] = useState<RegistroResultado[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [escenarios, setEscenarios] = useState<EscenarioItem[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarInformacionAdmin() {
      try {
        // 1. Obtener resultados de evaluaciones
        const listaResultados = await obtenerTodosLosResultados();

        // 2. Obtener usuarios registrados
        const usersSnap = await getDocs(collection(db, "users"));
        const listaUsuarios: UsuarioItem[] = usersSnap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            nombre: `${d.nombre || ""} ${d.apellido || ""}`.trim() || "Usuario",
            correo: d.email || "—",
            rol: d.rol || "Participante",
            estado: d.estado ? "Activo" : "Registrado",
          };
        });

        // 3. Obtener escenarios
        const escenariosSnap = await getDocs(collection(db, "escenarios"));
        const listaEscenarios: EscenarioItem[] = escenariosSnap.docs.map(
          (docSnap) => {
            const d = docSnap.data();
            const totalParticipantes = listaResultados.filter(
              (r) => r.escenarioId === docSnap.id || r.escenarioTitulo === d.titulo
            ).length;

            return {
              id: docSnap.id,
              nombre: d.titulo || "Sin título",
              categoria: d.categoria || "General",
              participantes: totalParticipantes,
              estado: d.activo ? "Activo" : "Inactivo",
            };
          }
        );

        if (activo) {
          setResultados(listaResultados);
          setUsuarios(listaUsuarios);
          setEscenarios(listaEscenarios);
        }
      } catch (err) {
        console.error("Error cargando panel de administración:", err);
      } finally {
        if (activo) {
          setCargandoDatos(false);
        }
      }
    }

    cargarInformacionAdmin();

    return () => {
      activo = false;
    };
  }, []);

  // Evaluaciones de hoy
  const hoyStr = new Date().toDateString();
  const evaluacionesHoy = resultados.filter((r) => {
    if (!r.creadoEn) return false;
    try {
      const timestamp = r.creadoEn as Timestamp;
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(r.creadoEn as any);
      return date.toDateString() === hoyStr;
    } catch {
      return false;
    }
  }).length;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setCargando(true);
      await cerrarSesion();
      navigate("/");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("No fue posible cerrar sesión.");
      }
    } finally {
      setCargando(false);
    }
  };

  

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-logo">Ψ</div>

          <div>
            <strong>Increase</strong>
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
          
          <form onSubmit={handleLogin}>
            
            <button className="exit-button"
              type="submit">
                ← Salir de la plataforma
              </button>
          </form>
          

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
                <strong>{cargandoDatos ? "..." : usuarios.length}</strong>
                <small>Total en sistema</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon scenarios-icon">
                ▣
              </div>

              <div>
                <span>Escenarios activos</span>
                <strong>
                  {cargandoDatos
                    ? "..."
                    : escenarios.filter((e) => e.estado === "Activo").length}
                </strong>
                <small>{escenarios.length} creados</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon results-icon">
                ◉
              </div>

              <div>
                <span>Evaluaciones realizadas</span>
                <strong>{cargandoDatos ? "..." : resultados.length}</strong>
                <small>Historial total</small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon activity-icon">
                ◷
              </div>

              <div>
                <span>Actividad hoy</span>
                <strong>{cargandoDatos ? "..." : evaluacionesHoy}</strong>
                <small>Evaluaciones hoy</small>
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
                  Evaluaciones y resultados registrados en la plataforma
                </p>
              </div>

              <Link to="/resultados" className="view-all">
                Ver todos
              </Link>

            </div>

            <div className="activity-table">

              <div className="table-header">
                <span>Usuario</span>
                <span>Desempeño</span>
                <span>Escenario</span>
                <span>Fecha</span>
                <span>Estado</span>
              </div>

              {cargandoDatos ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#77778a" }}>
                  Cargando actividad...
                </div>
              ) : resultados.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#77778a" }}>
                  No se han registrado evaluaciones todavía.
                </div>
              ) : (
                resultados.slice(0, 10).map((r) => (
                  <div className="table-row" key={r.id}>
                    <span>
                      <strong style={{ color: "#222" }}>
                        {r.usuarioNombre || "Participante"}
                      </strong>
                      <small style={{ display: "block", color: "#888", fontSize: "11px" }}>
                        {r.usuarioEmail || ""}
                      </small>
                    </span>

                    <span>
                      <strong style={{ color: "#6366f1" }}>{r.puntuacion}%</strong>{" "}
                      <small style={{ color: "#777" }}>
                        ({r.aciertosTotales ?? 0} aciertos / {r.fallosTotales ?? 0} fallos)
                      </small>
                    </span>

                    <span>{r.escenarioTitulo || r.escenarioId}</span>

                    <span>{formatearFechaHora(r.creadoEn)}</span>

                    <span className="status status-active">
                      Completado
                    </span>
                  </div>
                ))
              )}

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