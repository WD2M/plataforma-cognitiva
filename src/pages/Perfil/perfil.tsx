import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { cerrarSesion } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  obtenerResultadosUsuario,
  obtenerPacientesConResultados,
  type RegistroResultado,
  type PacienteMonitoreo,
} from "../../services/resultadosService";
import { doc, updateDoc, type Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

import "./Perfil.css";

function formatearFecha(fecha: unknown): string {
  if (!fecha) return "—";
  try {
    const timestamp = fecha as Timestamp;
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(fecha as string | number);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function Perfil() {
  const { user, perfil } = useAuth();
  const navigate = useNavigate();

  const esAdmin = perfil?.rol?.toLowerCase() === "administrador";

  // Estados edición de perfil personal
  const [editando, setEditando] = useState(false);
  const [nombreEdit, setNombreEdit] = useState("");
  const [apellidoEdit, setApellidoEdit] = useState("");
  const [documentoEdit, setDocumentoEdit] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  // Estados para Participante
  const [resultados, setResultados] = useState<RegistroResultado[]>([]);
  const [cargandoResultados, setCargandoResultados] = useState(true);

  // Estados para Administrador (Monitoreo de pacientes)
  const [pacientes, setPacientes] = useState<PacienteMonitoreo[]>([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<PacienteMonitoreo | null>(null);
  const [resultadoExpandidoId, setResultadoExpandidoId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (perfil) {
      setNombreEdit(perfil.nombre || "");
      setApellidoEdit(perfil.apellido || "");
      setDocumentoEdit(perfil.documento || "");
    }
  }, [perfil]);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      if (!user) {
        setCargandoResultados(false);
        setCargandoPacientes(false);
        return;
      }

      if (esAdmin) {
        try {
          setCargandoPacientes(true);
          const lista = await obtenerPacientesConResultados();
          if (activo) {
            // Filtramos para mostrar participantes (o todos menos el propio admin si no tiene partidas)
            setPacientes(lista);
          }
        } catch (err) {
          console.error("Error cargando pacientes para monitoreo:", err);
        } finally {
          if (activo) {
            setCargandoPacientes(false);
            setCargandoResultados(false);
          }
        }
      } else {
        try {
          setCargandoResultados(true);
          const datos = await obtenerResultadosUsuario(user.uid);
          if (activo) {
            setResultados(datos);
          }
        } catch (err) {
          console.error("Error cargando resultados del perfil:", err);
        } finally {
          if (activo) {
            setCargandoResultados(false);
            setCargandoPacientes(false);
          }
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [user, esAdmin]);

  const handleGuardarDatosPersonales = async () => {
    if (!user) return;
    try {
      setGuardandoPerfil(true);
      await updateDoc(doc(db, "users", user.uid), {
        nombre: nombreEdit.trim(),
        apellido: apellidoEdit.trim(),
        documento: documentoEdit.trim(),
      });
      setEditando(false);
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  // Cálculos dinámicos para Participante
  const totalEscenarios = resultados.length;
  const promedioPuntuacion =
    totalEscenarios > 0
      ? Math.round(
          resultados.reduce((acc, r) => acc + (r.puntuacion || 0), 0) /
            totalEscenarios
        )
      : null;

  const ultimaActividad =
    totalEscenarios > 0 ? formatearFecha(resultados[0].creadoEn) : "—";

  // Cálculos dinámicos para Administrador
  const soloParticipantes = pacientes.filter(
    (p) => p.rol?.toLowerCase() !== "administrador" || p.totalPartidas > 0
  );
  const totalPacientesMonitoreados = soloParticipantes.length;
  const totalEvaluacionesGlobal = pacientes.reduce(
    (acc, p) => acc + p.totalPartidas,
    0
  );
  const pacientesConEvaluaciones = pacientes.filter((p) => p.totalPartidas > 0);
  const promedioGlobalDesempeno =
    pacientesConEvaluaciones.length > 0
      ? Math.round(
          pacientesConEvaluaciones.reduce(
            (acc, p) => acc + p.promedioDesempeno,
            0
          ) / pacientesConEvaluaciones.length
        )
      : null;

  // Historial global de todas las evaluaciones para el administrador
  const historialGlobalResultados = pacientes
    .flatMap((p) =>
      p.resultados.map((r) => ({
        ...r,
        pacienteNombre: p.nombreCompleto,
        pacienteDocumento: p.documento,
        pacienteUid: p.uid,
      }))
    )
    .sort((a, b) => {
      const fA = (a.creadoEn as Timestamp)?.toMillis?.() || 0;
      const fB = (b.creadoEn as Timestamp)?.toMillis?.() || 0;
      return fB - fA;
    });

  // Filtrado por barra de búsqueda (por nombre o por número de documento)
  const terminoBusqueda = busqueda.trim().toLowerCase();
  const pacientesFiltrados = soloParticipantes.filter((p) => {
    if (!terminoBusqueda) return true;
    const coincideNombre = p.nombreCompleto
      .toLowerCase()
      .includes(terminoBusqueda);
    const coincideDocumento = p.documento
      .toLowerCase()
      .includes(terminoBusqueda);
    const coincideEmail = p.email.toLowerCase().includes(terminoBusqueda);
    return coincideNombre || coincideDocumento || coincideEmail;
  });

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
        <div className="perfil-brand" onClick={() => navigate("/")}>
          <div className="perfil-brand-icon">Ψ</div>
          <div>
            <strong>LAPSUCC</strong>
            <span>
              {esAdmin
                ? "Panel de Supervisión Clínica"
                : "Laboratorio Psicológico"}
            </span>
          </div>
        </div>

        <nav>
          <button onClick={() => navigate("/")}>Inicio</button>

          {esAdmin ? (
            <button onClick={() => navigate("/administracion")}>
              Panel Admin
            </button>
          ) : (
            <button onClick={() => navigate("/resultados")}>Resultados</button>
          )}

          <button
            className="perfil-nav-active"
            onClick={() => navigate("/perfil")}
          >
            {esAdmin ? "Perfil Supervisor" : "Perfil"}
          </button>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="perfil-container">
        <div className="perfil-heading">
          <div>
            <span className="perfil-eyebrow">
              {esAdmin ? "CUENTA DE ADMINISTRADOR · SUPERVISIÓN" : "MI CUENTA"}
            </span>

            <h1>{esAdmin ? "Perfil del Administrador" : "Mi perfil"}</h1>

            <p>
              {esAdmin
                ? "Monitorea el progreso clínico de los participantes, busca pacientes por nombre o documento y consulta el detalle de cada evaluación."
                : "Consulta y administra tu información personal."}
            </p>
          </div>
        </div>

        {/* TARJETA PRINCIPAL */}
        <section className="perfil-card perfil-main-card">
          <div
            className="perfil-user-header"
            style={{ justifyContent: "space-between", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
              <div className="perfil-avatar">{inicial}</div>

              <div className="perfil-user-name">
                <h2>{nombreCompleto}</h2>

                <span className="perfil-role">
                  {esAdmin
                    ? "Administrador / Investigador"
                    : perfil?.rol || "Participante"}
                </span>

                <p>{user?.email}</p>
              </div>
            </div>

            {esAdmin && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="perfil-secondary-button"
                  onClick={() => navigate("/administracion")}
                >
                  Ir al Dashboard Administrativo →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* INFORMACIÓN PERSONAL */}
        <section className="perfil-card">
          <div className="perfil-card-header">
            <div>
              <h2>Información de la cuenta</h2>
              <p>
                {esAdmin
                  ? "Credenciales e identificación del administrador."
                  : "Información asociada a tu cuenta."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {editando && (
                <button
                  className="perfil-edit-button"
                  style={{ background: "#6366f1", color: "white" }}
                  onClick={handleGuardarDatosPersonales}
                  disabled={guardandoPerfil}
                >
                  {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
                </button>
              )}
              <button
                className="perfil-edit-button"
                onClick={() => setEditando(!editando)}
              >
                {editando ? "Cancelar" : "Editar"}
              </button>
            </div>
          </div>

          <div className="perfil-info-grid">
            <div className="perfil-field">
              <label>Nombre</label>
              {editando ? (
                <input
                  className="perfil-input-edit"
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                />
              ) : (
                <div className="perfil-field-value">
                  {perfil?.nombre || "—"}
                </div>
              )}
            </div>

            <div className="perfil-field">
              <label>Apellido</label>
              {editando ? (
                <input
                  className="perfil-input-edit"
                  value={apellidoEdit}
                  onChange={(e) => setApellidoEdit(e.target.value)}
                />
              ) : (
                <div className="perfil-field-value">
                  {perfil?.apellido || "—"}
                </div>
              )}
            </div>

            <div className="perfil-field">
              <label>Número de documento</label>
              {editando ? (
                <input
                  className="perfil-input-edit"
                  placeholder="Ej. 1002345678"
                  value={documentoEdit}
                  onChange={(e) => setDocumentoEdit(e.target.value)}
                />
              ) : (
                <div className="perfil-field-value">
                  {perfil?.documento || "Sin registrar"}
                </div>
              )}
            </div>

            <div className="perfil-field">
              <label>Correo electrónico</label>
              <div className="perfil-field-value">
                {user?.email || perfil?.email || "—"}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            VISTA EXCLUSIVA DEL ADMINISTRADOR: MONITOREO Y BÚSQUEDA
        ========================================================== */}
        {esAdmin ? (
          <>
            {/* ÍNDICES GLOBALES DE SUPERVISIÓN */}
            <section className="perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Índices globales de monitoreo</h2>
                  <p>
                    Indicadores consolidados de los pacientes y evaluaciones en
                    la plataforma.
                  </p>
                </div>

                <button
                  className="perfil-secondary-button"
                  onClick={() => navigate("/administracion/nuevo-escenario")}
                >
                  + Crear escenario
                </button>
              </div>

              <div className="perfil-stats">
                <div className="perfil-stat">
                  <span className="perfil-stat-icon">♙</span>
                  <div>
                    <strong>
                      {cargandoPacientes ? "..." : totalPacientesMonitoreados}
                    </strong>
                    <span>Pacientes registrados</span>
                  </div>
                </div>

                <div className="perfil-stat">
                  <span className="perfil-stat-icon">◉</span>
                  <div>
                    <strong>
                      {cargandoPacientes ? "..." : totalEvaluacionesGlobal}
                    </strong>
                    <span>Evaluaciones registradas</span>
                  </div>
                </div>

                <div className="perfil-stat">
                  <span className="perfil-stat-icon">%</span>
                  <div>
                    <strong>
                      {cargandoPacientes
                        ? "..."
                        : promedioGlobalDesempeno !== null
                        ? `${promedioGlobalDesempeno}%`
                        : "—"}
                    </strong>
                    <span>Índice promedio global</span>
                  </div>
                </div>
              </div>
            </section>

            {/* BUSCADOR DE PACIENTES POR NOMBRE O NÚMERO DE DOCUMENTO */}
            <section className="perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Directorio y buscador de pacientes</h2>
                  <p>
                    Busca un paciente por su nombre completo o número de
                    documento para inspeccionar su expediente e historial
                    detallado.
                  </p>
                </div>
              </div>

              <div className="admin-search-bar">
                <span className="admin-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar paciente por nombre, apellido o número de documento (C.C. / T.I.)..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button
                    className="admin-search-clear"
                    onClick={() => setBusqueda("")}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {cargandoPacientes ? (
                <div className="admin-empty-state">
                  Cargando directorio de pacientes...
                </div>
              ) : pacientesFiltrados.length === 0 ? (
                <div className="admin-empty-state">
                  No se encontraron pacientes que coincidan con "{busqueda}".
                </div>
              ) : (
                <div className="admin-patients-list">
                  {pacientesFiltrados.map((paciente) => {
                    const activoSeleccion =
                      pacienteSeleccionado?.uid === paciente.uid;
                    return (
                      <div
                        key={paciente.uid}
                        className={`admin-patient-item ${
                          activoSeleccion ? "selected" : ""
                        }`}
                      >
                        <div className="admin-patient-main">
                          <div className="admin-patient-avatar">
                            {paciente.nombreCompleto.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="admin-patient-title">
                              <strong>{paciente.nombreCompleto}</strong>
                              <span className="admin-doc-badge">
                                Doc: {paciente.documento}
                              </span>
                            </div>
                            <span className="admin-patient-sub">
                              {paciente.email} ·{" "}
                              {paciente.edad
                                ? `${paciente.edad} años`
                                : "Edad s/r"}{" "}
                              · {paciente.ciudad || "Ciudad s/r"}
                            </span>
                          </div>
                        </div>

                        <div className="admin-patient-metrics">
                          <div>
                            <strong>{paciente.totalPartidas}</strong>
                            <span>Partidas</span>
                          </div>
                          <div>
                            <strong style={{ color: "#6366f1" }}>
                              {paciente.totalPartidas > 0
                                ? `${paciente.promedioDesempeno}%`
                                : "—"}
                            </strong>
                            <span>Promedio</span>
                          </div>
                          <button
                            className="perfil-secondary-button"
                            onClick={() => {
                              setPacienteSeleccionado(
                                activoSeleccion ? null : paciente
                              );
                              setResultadoExpandidoId(null);
                            }}
                          >
                            {activoSeleccion
                              ? "Cerrar expediente"
                              : "Ver resultados"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* EXPEDIENTE DETALLADO DEL PACIENTE SELECCIONADO */}
            {pacienteSeleccionado && (
              <section className="perfil-card admin-expediente-card">
                <div className="perfil-card-header">
                  <div>
                    <span className="perfil-eyebrow">
                      EXPEDIENTE DEL PACIENTE
                    </span>
                    <h2 style={{ marginTop: "4px", fontSize: "22px" }}>
                      {pacienteSeleccionado.nombreCompleto}
                    </h2>
                    <p>
                      Documento:{" "}
                      <strong>{pacienteSeleccionado.documento}</strong> ·
                      Correo: {pacienteSeleccionado.email}
                    </p>
                  </div>

                  <button
                    className="perfil-edit-button"
                    onClick={() => setPacienteSeleccionado(null)}
                  >
                    ✕ Cerrar detalle
                  </button>
                </div>

                {/* Datos de caracterización del paciente */}
                <div className="admin-patient-profile-summary">
                  <div className="summary-pill">
                    <span>Edad</span>
                    <strong>
                      {pacienteSeleccionado.edad
                        ? `${pacienteSeleccionado.edad} años`
                        : "No registrada"}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Género</span>
                    <strong>
                      {pacienteSeleccionado.genero || "No registrado"}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Escolaridad</span>
                    <strong>
                      {pacienteSeleccionado.escolaridad || "No registrada"}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Ocupación</span>
                    <strong>
                      {pacienteSeleccionado.ocupacionActual || "No registrada"}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Aciertos / Fallos totales</span>
                    <strong>
                      {pacienteSeleccionado.aciertosAcumulados} /{" "}
                      {pacienteSeleccionado.fallosAcumulados}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Desempeño general</span>
                    <strong style={{ color: "#6366f1" }}>
                      {pacienteSeleccionado.totalPartidas > 0
                        ? `${pacienteSeleccionado.promedioDesempeno}%`
                        : "Sin evaluar"}
                    </strong>
                  </div>
                </div>

                {/* Historial de partidas del paciente con desglose por niveles */}
                <h3
                  style={{
                    fontSize: "16px",
                    margin: "24px 0 12px",
                    color: "#202033",
                  }}
                >
                  Historial de evaluaciones del paciente (
                  {pacienteSeleccionado.resultados.length})
                </h3>

                {pacienteSeleccionado.resultados.length === 0 ? (
                  <div className="admin-empty-state">
                    Este paciente aún no ha completado ningún escenario
                    cognitivo.
                  </div>
                ) : (
                  <div className="admin-results-detail-list">
                    {pacienteSeleccionado.resultados.map((res, idx) => {
                      const expandido = resultadoExpandidoId === res.id;
                      const d = res.datosUnity;
                      return (
                        <div key={res.id || idx} className="admin-result-item">
                          <div className="admin-result-row">
                            <div>
                              <strong
                                style={{
                                  fontSize: "15px",
                                  color: "#202033",
                                  display: "block",
                                }}
                              >
                                {res.escenarioTitulo || "Memoria visual"}
                              </strong>
                              <span
                                style={{ fontSize: "12px", color: "#77778a" }}
                              >
                                {formatearFecha(res.creadoEn)} · Categoría:{" "}
                                {res.categoria}
                              </span>
                            </div>

                            <div className="admin-result-Right">
                              <div style={{ textAlign: "right" }}>
                                <strong
                                  style={{ fontSize: "16px", color: "#6366f1" }}
                                >
                                  {res.puntuacion}%
                                </strong>
                                <span
                                  style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "#77778a",
                                  }}
                                >
                                  {res.aciertosTotales} aciertos ·{" "}
                                  {res.fallosTotales} fallos
                                </span>
                              </div>

                              <button
                                className="perfil-edit-button"
                                onClick={() =>
                                  setResultadoExpandidoId(
                                    expandido ? null : res.id || String(idx)
                                  )
                                }
                              >
                                {expandido
                                  ? "Ocultar niveles ▲"
                                  : "Ver desglose ▼"}
                              </button>
                            </div>
                          </div>

                          {expandido && d && (
                            <div className="admin-level-breakdown">
                              <div className="level-box">
                                <span>Nivel Tutorial</span>
                                <strong>
                                  {d.aciertosNivelTutorial || 0} aciertos /{" "}
                                  {d.fallosNivelTutorial || 0} fallos
                                </strong>
                                <small>
                                  Intentos: {d.intentosNivelTutorial || 0}
                                </small>
                              </div>
                              <div className="level-box">
                                <span>Nivel 1</span>
                                <strong>
                                  {d.aciertosNivel1 || 0} aciertos /{" "}
                                  {d.fallosNivel1 || 0} fallos
                                </strong>
                                <small>Intentos: {d.intentosNivel1 || 0}</small>
                              </div>
                              <div className="level-box">
                                <span>Nivel 2</span>
                                <strong>
                                  {d.aciertosNivel2 || 0} aciertos /{" "}
                                  {d.fallosNivel2 || 0} fallos
                                </strong>
                                <small>Intentos: {d.intentosNivel2 || 0}</small>
                              </div>
                              <div className="level-box">
                                <span>Nivel 3</span>
                                <strong>
                                  {d.aciertosNivel3 || 0} aciertos /{" "}
                                  {d.fallosNivel3 || 0} fallos
                                </strong>
                                <small>Intentos: {d.intentosNivel3 || 0}</small>
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

            {/* HISTORIAL DE REGISTROS DE SUPERVISIÓN DEL ADMINISTRADOR */}
            <section className="perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Historial general de evaluaciones supervisadas</h2>
                  <p>
                    Registro cronológico de todas las pruebas completadas por
                    los pacientes en la plataforma.
                  </p>
                </div>
              </div>

              {historialGlobalResultados.length === 0 ? (
                <div className="admin-empty-state">
                  Aún no hay evaluaciones registradas en la plataforma.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {historialGlobalResultados.slice(0, 8).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px 16px",
                        background: "#f8f8fc",
                        borderRadius: "11px",
                        border: "1px solid #ececf4",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "#202033",
                            fontSize: "14px",
                          }}
                        >
                          {item.pacienteNombre}{" "}
                          <span
                            style={{
                              fontWeight: 500,
                              color: "#6366f1",
                              fontSize: "12px",
                            }}
                          >
                            (Doc: {item.pacienteDocumento})
                          </span>
                        </strong>
                        <span style={{ fontSize: "12px", color: "#77778a" }}>
                          {item.escenarioTitulo} · {formatearFecha(item.creadoEn)}
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
                          <strong style={{ color: "#6366f1", fontSize: "15px" }}>
                            {item.puntuacion}%
                          </strong>
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "#77778a",
                            }}
                          >
                            {item.aciertosTotales} aciertos /{" "}
                            {item.fallosTotales} fallos
                          </span>
                        </div>

                        <button
                          className="perfil-edit-button"
                          onClick={() => {
                            const encontrado = pacientes.find(
                              (p) => p.uid === item.pacienteUid
                            );
                            if (encontrado) {
                              setPacienteSeleccionado(encontrado);
                              setResultadoExpandidoId(item.id || null);
                            }
                          }}
                        >
                          Inspeccionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* =========================================================
              VISTA ESTÁNDAR DEL PARTICIPANTE
          ========================================================== */
          <section className="perfil-card">
            <div className="perfil-card-header">
              <div>
                <h2>Mi actividad</h2>
                <p>Resumen de tu actividad en la plataforma.</p>
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
                <span className="perfil-stat-icon">◉</span>
                <div>
                  <strong>
                    {cargandoResultados ? "..." : totalEscenarios}
                  </strong>
                  <span>Escenarios realizados</span>
                </div>
              </div>

              <div className="perfil-stat">
                <span className="perfil-stat-icon">%</span>
                <div>
                  <strong>
                    {cargandoResultados
                      ? "..."
                      : promedioPuntuacion !== null
                      ? `${promedioPuntuacion}%`
                      : "—"}
                  </strong>
                  <span>Puntuación promedio</span>
                </div>
              </div>

              <div className="perfil-stat">
                <span className="perfil-stat-icon">◷</span>
                <div>
                  <strong>
                    {cargandoResultados ? "..." : ultimaActividad}
                  </strong>
                  <span>Última actividad</span>
                </div>
              </div>
            </div>

            {resultados.length > 0 && (
              <div
                style={{
                  marginTop: "24px",
                  borderTop: "1px solid #e8e8ef",
                  paddingTop: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    marginBottom: "14px",
                    color: "#333346",
                  }}
                >
                  Historial reciente
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {resultados.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#fbfbfe",
                        borderRadius: "10px",
                        border: "1px solid #f0f0f5",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "#1f1f2e",
                            fontSize: "14px",
                          }}
                        >
                          {r.escenarioTitulo || "Escenario"}
                        </strong>
                        <span style={{ fontSize: "12px", color: "#77778a" }}>
                          {formatearFecha(r.creadoEn)} · {r.categoria}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ color: "#6366f1", fontSize: "15px" }}>
                          {r.puntuacion}%
                        </strong>
                        <span
                          style={{
                            display: "block",
                            fontSize: "11px",
                            color: "#77778a",
                          }}
                        >
                          {r.aciertosTotales} aciertos / {r.fallosTotales}{" "}
                          fallos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* SEGURIDAD */}
        <section className="perfil-card perfil-security">
          <div>
            <h2>Sesión</h2>
            <p>Cierra tu sesión actual de LAPSUCC.</p>
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
