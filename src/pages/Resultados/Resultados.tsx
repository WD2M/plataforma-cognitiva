import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Resultados.css";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerResultadosUsuario,
  obtenerTodosLosResultados,
  type RegistroResultado,
} from "../../services/resultadosService";
import type { Timestamp } from "firebase/firestore";

function formatearFecha(fecha: unknown): string {
  if (!fecha) return "—";
  try {
    const timestamp = fecha as Timestamp;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(fecha as string | number);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function Resultados() {
  const { user, perfil } = useAuth();
  const esAdmin = perfil?.rol?.toLowerCase() === "administrador";
  const [resultados, setResultados] = useState<RegistroResultado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      if (!user) {
        setCargando(false);
        return;
      }

      try {
        const datos = esAdmin
          ? await obtenerTodosLosResultados()
          : await obtenerResultadosUsuario(user.uid);
        if (activo) {
          setResultados(datos);
        }
      } catch (error) {
        console.error("Error al obtener resultados:", error);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [user, esAdmin]);

  const total = resultados.length;
  const promedio =
    total > 0
      ? Math.round(
          resultados.reduce((acc, r) => acc + (r.puntuacion || 0), 0) / total
        )
      : 0;

  // Promedio por categoría
  const categoriasMap: Record<string, { total: number; suma: number }> = {};
  for (const r of resultados) {
    const cat = r.categoria || "General";
    if (!categoriasMap[cat]) {
      categoriasMap[cat] = { total: 0, suma: 0 };
    }
    categoriasMap[cat].total += 1;
    categoriasMap[cat].suma += r.puntuacion || 0;
  }

  const ultimaActividad = resultados[0];

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

          <span>Increase</span>

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

          <Link to={esAdmin ? "/administracion" : "/perfil"}>
              <div className="home-avatar">
                {perfil? `${perfil.nombre[0]}` : "Cargando..."}
              </div>
          </Link>

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
              {esAdmin ? "MONITOREO GENERAL" : "MI PROGRESO"}
            </span>

            <h1>
              {esAdmin ? "Resultados globales de participantes" : "Resultados y desempeño"}
            </h1>

            <p>
              {esAdmin
                ? "Supervisa el historial consolidado de evaluaciones realizadas en la plataforma."
                : "Consulta el historial de tus actividades y observa cómo ha evolucionado tu desempeño."}
            </p>

          </div>


          <Link
            to={esAdmin ? "/perfil" : "/catalogo"}
            className="results-action"
          >
            {esAdmin ? "Buscar paciente por nombre / documento" : "Realizar escenario"}
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
                {cargando ? "..." : total}
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
                {cargando ? "..." : `${promedio}%`}
              </strong>

              <small>
                Basado en tus actividades
              </small>

            </div>

          </div>


          {/* Aciertos totales */}

          <div className="stat-card">

            <div className="stat-icon green">
              ◷
            </div>

            <div className="stat-content">

              <span>
                Aciertos acumulados
              </span>

              <strong>
                {cargando
                  ? "..."
                  : resultados.reduce((acc, r) => acc + (r.aciertosTotales || 0), 0)}
              </strong>

              <small>
                Respuestas correctas
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
                {cargando
                  ? "..."
                  : ultimaActividad
                  ? `${ultimaActividad.puntuacion}%`
                  : "—"}
              </strong>

              <small>
                {ultimaActividad ? ultimaActividad.escenarioTitulo : "Sin registros"}
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
                    {cargando ? "..." : promedio}
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

              {Object.keys(categoriasMap).length > 0 ? (
                Object.entries(categoriasMap).map(([categoria, stat]) => {
                  const catPromedio = Math.round(stat.suma / stat.total);
                  const cls =
                    categoria.toLowerCase().includes("memoria")
                      ? "memory"
                      : categoria.toLowerCase().includes("atención") ||
                        categoria.toLowerCase().includes("atencion")
                      ? "attention"
                      : "executive";

                  return (
                    <div className="bar-item" key={categoria}>
                      <div className="bar-header">
                        <span>{categoria}</span>
                        <strong>{catPromedio}%</strong>
                      </div>
                      <div className="bar">
                        <div
                          className={`bar-fill ${cls}`}
                          style={{ width: `${catPromedio}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "#77778a", fontSize: "14px" }}>
                  Aún no has completado escenarios para calcular tu desempeño por categoría.
                </p>
              )}

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
                ACIERTOS / FALLOS
              </span>

              <span>
                DESEMPEÑO
              </span>

              <span>
                ESTADO
              </span>

            </div>


            {/* Filas */}

            {cargando ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#77778a" }}>
                Cargando historial de resultados...
              </div>
            ) : resultados.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#77778a" }}>
                Aún no tienes resultados registrados. Completa una actividad desde el catálogo.
              </div>
            ) : (
              resultados.map((resultado) => (
                <div className="history-row" key={resultado.id}>
                  <div className="scenario-name">
                    <div className="scenario-icon">◈</div>
                    <div>
                      <strong style={{ display: "block" }}>
                        {resultado.escenarioTitulo || "Escenario"}
                      </strong>
                      {esAdmin && (
                        <small style={{ color: "#6366f1", fontSize: "11px" }}>
                          Paciente: {resultado.usuarioNombre || "Participante"}
                        </small>
                      )}
                    </div>
                  </div>

                  <span className="category">{resultado.categoria || "General"}</span>

                  <span className="date">{formatearFecha(resultado.creadoEn)}</span>

                  <span className="time">
                    {resultado.aciertosTotales ?? 0} aciertos / {resultado.fallosTotales ?? 0} fallos
                  </span>

                  <div className="score">
                    <strong>{resultado.puntuacion}%</strong>
                    <div className="mini-bar">
                      <div
                        style={{
                          width: `${resultado.puntuacion}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="status">Completado</span>
                </div>
              ))
            )}

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

export default Resultados;