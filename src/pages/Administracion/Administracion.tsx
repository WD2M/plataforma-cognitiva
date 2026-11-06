import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Administracion.css";
import { cerrarSesion } from "../../services/authService";
import {
  obtenerTodosLosResultados,
  obtenerPacientesConResultados,
  type RegistroResultado,
  type PacienteMonitoreo,
} from "../../services/resultadosService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import type { Timestamp } from "firebase/firestore";

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
  const [pacientes, setPacientes] = useState<PacienteMonitoreo[]>([]);
  const [escenarios, setEscenarios] = useState<EscenarioItem[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Búsqueda y detalle de paciente
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<PacienteMonitoreo | null>(null);
  const [partidaExpandidaId, setPartidaExpandidaId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let activo = true;

    async function cargarInformacionAdmin() {
      try {
        const [listaResultados, listaPacientes, escenariosSnap] =
          await Promise.all([
            obtenerTodosLosResultados().catch(() => [] as RegistroResultado[]),
            obtenerPacientesConResultados().catch(() => [] as PacienteMonitoreo[]),
            getDocs(collection(db, "escenarios")).catch(() => null),
          ]);

        const listaEscenarios: EscenarioItem[] = escenariosSnap
          ? escenariosSnap.docs.map((docSnap) => {
              const d = docSnap.data();
              const totalParticipantes = listaResultados.filter(
                (r) =>
                  r.escenarioId === docSnap.id || r.escenarioTitulo === d.titulo
              ).length;

              return {
                id: docSnap.id,
                nombre: d.titulo || "Sin título",
                categoria: d.categoria || "General",
                participantes: totalParticipantes,
                estado: d.activo ? "Activo" : "Inactivo",
              };
            })
          : [];

        if (activo) {
          setResultados(listaResultados);
          setPacientes(listaPacientes);
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

  // Filtrar pacientes por nombre o documento
  const termino = busquedaUsuario.trim().toLowerCase();
  const pacientesFiltrados = pacientes.filter((p) => {
    if (!termino) return true;
    return (
      p.nombreCompleto.toLowerCase().includes(termino) ||
      p.documento.toLowerCase().includes(termino) ||
      p.email.toLowerCase().includes(termino)
    );
  });

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

          <Link to="/perfil" className="menu-item">
            <span>◉</span>
            Perfil y Pacientes
          </Link>

          <p className="menu-title">GESTIÓN</p>

          <button
            className="menu-item"
            onClick={() => navigate("/perfil")}
          >
            <span>♙</span>
            Buscar Pacientes
          </button>

          <button
            className="menu-item"
            onClick={() => navigate("/administracion/nuevo-escenario")}
          >
            <span>▣</span>
            Nuevo Escenario
          </button>

          <Link to="/resultados" className="menu-item">
            <span>▤</span>
            Vista Resultados
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="back-home">
            ← Volver a la plataforma
          </Link>

          <form onSubmit={handleLogin}>
            <button className="exit-button" type="submit">
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
              Monitorea pacientes, busca por nombre o documento y supervisa los
              resultados detallados.
            </p>
          </div>

          <div
            className="admin-profile"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/perfil")}
          >
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>Ver mi perfil de supervisión →</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="admin-content">
          {/* STATS */}
          <section className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon users-icon">♙</div>

              <div>
                <span>Usuarios registrados</span>
                <strong>{cargandoDatos ? "..." : pacientes.length}</strong>
                <small>Total en sistema</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon scenarios-icon">▣</div>

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
              <div className="stat-icon results-icon">◉</div>

              <div>
                <span>Evaluaciones realizadas</span>
                <strong>{cargandoDatos ? "..." : resultados.length}</strong>
                <small>Historial total</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon activity-icon">◷</div>

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
              <button
                onClick={() => navigate("/administracion/nuevo-escenario")}
              >
                <span>+</span>
                Nuevo escenario
              </button>

              <button onClick={() => navigate("/perfil")}>
                <span>♙</span>
                Perfil de Supervisión
              </button>
            </div>
          </section>

          {/* DETALLE DEL PACIENTE SELECCIONADO (SI HAY UNO ACTIVO) */}
          {pacienteSeleccionado && (
            <section
              className="admin-panel"
              style={{
                marginTop: "22px",
                border: "2px solid #5969d9",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#5969d9",
                      letterSpacing: "1px",
                    }}
                  >
                    EXPEDIENTE CLÍNICO DEL PACIENTE
                  </span>
                  <h2 style={{ margin: "4px 0", fontSize: "19px" }}>
                    {pacienteSeleccionado.nombreCompleto}
                  </h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#75798b" }}>
                    Documento:{" "}
                    <strong>{pacienteSeleccionado.documento}</strong> · Correo:{" "}
                    {pacienteSeleccionado.email} · Edad:{" "}
                    {pacienteSeleccionado.edad
                      ? `${pacienteSeleccionado.edad} años`
                      : "S/R"}{" "}
                    · Escolaridad:{" "}
                    {pacienteSeleccionado.escolaridad || "S/R"}
                  </p>
                </div>

                <button
                  onClick={() => setPacienteSeleccionado(null)}
                  style={{
                    border: "1px solid #d5d7e5",
                    background: "#f5f6fa",
                    padding: "7px 13px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  ✕ Cerrar expediente
                </button>
              </div>

              {pacienteSeleccionado.resultados.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    background: "#f8f9fc",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#75798b",
                  }}
                >
                  Este paciente aún no registra resultados en los escenarios.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {pacienteSeleccionado.resultados.map((res, idx) => {
                    const abierto = partidaExpandidaId === res.id;
                    const d = res.datosUnity;
                    return (
                      <div
                        key={res.id || idx}
                        style={{
                          border: "1px solid #e7e8ee",
                          borderRadius: "11px",
                          padding: "14px 16px",
                          background: "#fbfcfe",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <strong
                              style={{ fontSize: "13px", color: "#2b2e41" }}
                            >
                              {res.escenarioTitulo} ({res.categoria})
                            </strong>
                            <span
                              style={{
                                display: "block",
                                fontSize: "11px",
                                color: "#8b8fa2",
                                marginTop: "2px",
                              }}
                            >
                              Fecha: {formatearFechaHora(res.creadoEn)}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                            }}
                          >
                            <div style={{ textAlign: "right" }}>
                              <strong
                                style={{ fontSize: "15px", color: "#5969d9" }}
                              >
                                {res.puntuacion}%
                              </strong>
                              <small
                                style={{
                                  display: "block",
                                  fontSize: "10px",
                                  color: "#75798b",
                                }}
                              >
                                {res.aciertosTotales} aciertos /{" "}
                                {res.fallosTotales} fallos
                              </small>
                            </div>

                            <button
                              onClick={() =>
                                setPartidaExpandidaId(
                                  abierto ? null : res.id || String(idx)
                                )
                              }
                              style={{
                                border: "none",
                                background: "#eef0ff",
                                color: "#5969d9",
                                padding: "6px 11px",
                                borderRadius: "7px",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {abierto ? "Ocultar niveles" : "Detalle por nivel"}
                            </button>
                          </div>
                        </div>

                        {abierto && d && (
                          <div
                            style={{
                              marginTop: "12px",
                              paddingTop: "12px",
                              borderTop: "1px dashed #dfe1ec",
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(150px, 1fr))",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                background: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ececf2",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#5969d9",
                                  fontWeight: 700,
                                  display: "block",
                                }}
                              >
                                TUTORIAL
                              </span>
                              <strong style={{ fontSize: "12px" }}>
                                {d.aciertosNivelTutorial || 0} aciertos /{" "}
                                {d.fallosNivelTutorial || 0} fallos
                              </strong>
                            </div>
                            <div
                              style={{
                                background: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ececf2",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#5969d9",
                                  fontWeight: 700,
                                  display: "block",
                                }}
                              >
                                NIVEL 1
                              </span>
                              <strong style={{ fontSize: "12px" }}>
                                {d.aciertosNivel1 || 0} aciertos /{" "}
                                {d.fallosNivel1 || 0} fallos
                              </strong>
                            </div>
                            <div
                              style={{
                                background: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ececf2",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#5969d9",
                                  fontWeight: 700,
                                  display: "block",
                                }}
                              >
                                NIVEL 2
                              </span>
                              <strong style={{ fontSize: "12px" }}>
                                {d.aciertosNivel2 || 0} aciertos /{" "}
                                {d.fallosNivel2 || 0} fallos
                              </strong>
                            </div>
                            <div
                              style={{
                                background: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ececf2",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#5969d9",
                                  fontWeight: 700,
                                  display: "block",
                                }}
                              >
                                NIVEL 3
                              </span>
                              <strong style={{ fontSize: "12px" }}>
                                {d.aciertosNivel3 || 0} aciertos /{" "}
                                {d.fallosNivel3 || 0} fallos
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TWO COLUMNS */}
          <section className="admin-grid">
            {/* USERS WITH SEARCH BAR BY NAME OR DOCUMENT */}
            <div className="admin-panel">
              <div className="panel-header">
                <div>
                  <h2>Pacientes y Usuarios</h2>
                  <p>Busca por nombre o número de documento</p>
                </div>

                <Link to="/perfil" className="view-all">
                  Buscador avanzado →
                </Link>
              </div>

              <div style={{ padding: "12px 20px 4px" }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar por nombre o documento..."
                  value={busquedaUsuario}
                  onChange={(e) => setBusquedaUsuario(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #dcdce8",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
              </div>

              <div className="users-list">
                {pacientesFiltrados.map((usuario) => (
                  <div
                    className="user-row"
                    key={usuario.uid}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setPacienteSeleccionado(usuario);
                      setPartidaExpandidaId(null);
                    }}
                  >
                    <div className="user-row-avatar">
                      {usuario.nombreCompleto.charAt(0).toUpperCase()}
                    </div>

                    <div className="user-data">
                      <strong>{usuario.nombreCompleto}</strong>

                      <span>
                        Doc: {usuario.documento} · {usuario.email}
                      </span>
                    </div>

                    <div className="user-role">
                      <span className="role-badge">
                        {usuario.totalPartidas} partidas (
                        {usuario.promedioDesempeno}%)
                      </span>
                    </div>

                    <div>
                      <span className="status status-active">Ver detalle</span>
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

                <button
                  className="view-all"
                  onClick={() => navigate("/administracion/nuevo-escenario")}
                >
                  + Agregar
                </button>
              </div>

              <div className="scenario-list">
                {escenarios.map((escenario) => (
                  <div className="scenario-row" key={escenario.id}>
                    <div className="scenario-icon">Ψ</div>

                    <div className="scenario-data">
                      <strong>{escenario.nombre}</strong>

                      <span>{escenario.categoria}</span>
                    </div>

                    <div className="scenario-participants">
                      <strong>{escenario.participantes}</strong>

                      <span>evaluaciones</span>
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
                <p>Evaluaciones y resultados registrados en la plataforma</p>
              </div>

              <Link to="/perfil" className="view-all">
                Ver todos en Perfil Supervisor
              </Link>
            </div>

            <div className="activity-table">
              <div className="table-header">
                <span>Paciente</span>
                <span>Desempeño</span>
                <span>Escenario</span>
                <span>Fecha</span>
                <span>Acción</span>
              </div>

              {cargandoDatos ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#77778a",
                  }}
                >
                  Cargando actividad...
                </div>
              ) : resultados.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#77778a",
                  }}
                >
                  No se han registrado evaluaciones todavía.
                </div>
              ) : (
                resultados.slice(0, 10).map((r) => {
                  const pac = pacientes.find((p) => p.uid === r.userUid);
                  return (
                    <div className="table-row" key={r.id}>
                      <span>
                        <strong style={{ color: "#222" }}>
                          {pac?.nombreCompleto ||
                            r.usuarioNombre ||
                            "Participante"}
                        </strong>
                        <small
                          style={{
                            display: "block",
                            color: "#888",
                            fontSize: "10px",
                          }}
                        >
                          Doc: {pac?.documento || "S/R"}
                        </small>
                      </span>

                      <span>
                        <strong style={{ color: "#6366f1" }}>
                          {r.puntuacion}%
                        </strong>{" "}
                        <small style={{ color: "#777" }}>
                          ({r.aciertosTotales ?? 0} aciertos /{" "}
                          {r.fallosTotales ?? 0} fallos)
                        </small>
                      </span>

                      <span>{r.escenarioTitulo || r.escenarioId}</span>

                      <span>{formatearFechaHora(r.creadoEn)}</span>

                      <span>
                        <button
                          onClick={() => {
                            if (pac) {
                              setPacienteSeleccionado(pac);
                              setPartidaExpandidaId(r.id || null);
                              window.scrollTo({ top: 150, behavior: "smooth" });
                            }
                          }}
                          style={{
                            border: "none",
                            background: "#eef0ff",
                            color: "#5969d9",
                            padding: "5px 9px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Ver detalle
                        </button>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* SYSTEM INFORMATION */}
          <section className="system-card">
            <div className="system-info">
              <div className="system-icon">✓</div>

              <div>
                <h3>Sistema operativo</h3>

                <p>
                  Todos los servicios principales de la plataforma se encuentran
                  disponibles.
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
