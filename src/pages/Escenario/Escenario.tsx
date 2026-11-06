import { useParams, Link } from "react-router-dom";
import "./Escenario.css";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  guardarOActualizarResultadoSesion,
  type DatosUnityEscenario,
} from "../../services/resultadosService";




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
    webglUrl: "https://1lxldbc3-3000.use2.devtunnels.ms/",
  },
};


function Escenario() {
  const { id } = useParams();
  const { user, perfil } = useAuth();

  const escenario =
    escenarios[id as unknown as keyof typeof escenarios] ?? escenarios[1];

  const [estado, setEstado] = useState("Esperando inicio de la actividad...");
  const guardando = useRef(false);
  const sesionDocIdRef = useRef<string | null>(null);
  const ultimoHashPartida = useRef<string>("");
  const maxJugadasSesionRef = useRef<number>(0);

  useEffect(() => {
    function recibirResultados(event: MessageEvent) {
      if (!event.data || event.data.tipo !== "RESULTADOS_ESCENARIO") {
        return;
      }

      if (!user) {
        setEstado("Debes iniciar sesión para registrar tu actividad.");
        return;
      }

      try {
        const resultado: DatosUnityEscenario =
          typeof event.data.datos === "string"
            ? JSON.parse(event.data.datos)
            : event.data.datos;

        // 1. Validar formato numérico básico
        if (
          !resultado ||
          !Number.isFinite(resultado.fallosNivel1) ||
          !Number.isFinite(resultado.fallosNivel2) ||
          !Number.isFinite(resultado.fallosNivel3)
        ) {
          return;
        }

        // 2. Comprobar que existan aciertos o fallos reales (no solo intentos o menús/color de carro)
        const totalAciertos =
          (resultado.aciertosNivelTutorial || 0) +
          (resultado.aciertosNivel1 || 0) +
          (resultado.aciertosNivel2 || 0) +
          (resultado.aciertosNivel3 || 0);

        const totalFallos =
          (resultado.fallosNivelTutorial || 0) +
          (resultado.fallosNivel1 || 0) +
          (resultado.fallosNivel2 || 0) +
          (resultado.fallosNivel3 || 0);

        const totalEvaluado = totalAciertos + totalFallos;

        // Si no hay ni un solo acierto ni fallo real, se ignora por completo (menús, color de carro, inicio de nivel)
        if (totalEvaluado === 0) {
          return;
        }

        // Si el usuario reinició la partida desde 0 dentro de Unity (los contadores bajaron respecto al máximo de esta sesión),
        // iniciamos un nuevo documento de informe para la nueva partida
        if (totalEvaluado < maxJugadasSesionRef.current) {
          sesionDocIdRef.current = null;
          maxJugadasSesionRef.current = 0;
        }
        maxJugadasSesionRef.current = totalEvaluado;

        // 3. Evitar guardar exactamente el mismo estado si no ha cambiado el marcador
        const hashEstado = `${resultado.nombreActualPlayer}_${totalAciertos}_${totalFallos}`;
        if (hashEstado === ultimoHashPartida.current) {
          return;
        }

        if (guardando.current) return;

        guardando.current = true;
        setEstado(
          `Progreso registrado: ${totalAciertos} aciertos, ${totalFallos} fallos...`
        );

        const nombreUsuario = perfil
          ? `${perfil.nombre} ${perfil.apellido}`.trim()
          : resultado.nombreActualPlayer || "Participante";

        guardarOActualizarResultadoSesion(
          sesionDocIdRef.current,
          user.uid,
          nombreUsuario,
          user.email || "",
          id || "1",
          escenario.titulo,
          escenario.categoria,
          resultado
        )
          .then((docId) => {
            sesionDocIdRef.current = docId;
            ultimoHashPartida.current = hashEstado;
            setEstado(
              `Informe actualizado (${totalAciertos} aciertos / ${totalFallos} fallos).`
            );
          })
          .catch((error) => {
            console.error("Error guardando resultados:", error);
            setEstado("No se pudieron guardar los resultados.");
          })
          .finally(() => {
            guardando.current = false;
          });
      } catch (error) {
        console.error("Mensaje de Unity no parseable:", error);
      }
    }

    window.addEventListener("message", recibirResultados);

    return () => {
      window.removeEventListener("message", recibirResultados);
    };
  }, [user, perfil, id, escenario]);
  return (
    <div className="escenario-page">

      {/* NAVBAR */}
      <nav className="escenario-navbar">
        <Link to="/" className="escenario-logo">
          <span className="logo-symbol">Ψ</span>

          <div>
            <strong>Increase</strong>
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
              //src={escenario.webglUrl}
              src="https://wd2m.github.io/PruebaWebGL/JuegoCarro/"
              title={escenario.titulo}
              className="webgl-frame"
              allowFullScreen
            />
            
          </div>
          <p role="status">{estado}</p>

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
          <strong>Increase</strong>
          <p>
            Plataforma web de escenarios interactivos
            para el estudio y evaluación de constructos psicológicos.
          </p>
        </div>

        <span>
          © 2026 Increase
        </span>

      </footer>

    </div>
  );
}

export default Escenario;