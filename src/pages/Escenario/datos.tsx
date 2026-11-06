import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  guardarOActualizarResultadoSesion,
  type DatosUnityEscenario,
} from "../../services/resultadosService";

export default function Escenario() {
  const { user, perfil } = useAuth();

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
        setEstado("Debes iniciar sesión para guardar resultados.");
        return;
      }

      try {
        const resultado: DatosUnityEscenario =
          typeof event.data.datos === "string"
            ? JSON.parse(event.data.datos)
            : event.data.datos;

        if (
          !resultado ||
          !Number.isFinite(resultado.fallosNivel1) ||
          !Number.isFinite(resultado.fallosNivel2) ||
          !Number.isFinite(resultado.fallosNivel3)
        ) {
          return;
        }

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

        if (totalEvaluado === 0) {
          return;
        }

        if (totalEvaluado < maxJugadasSesionRef.current) {
          sesionDocIdRef.current = null;
          maxJugadasSesionRef.current = 0;
        }
        maxJugadasSesionRef.current = totalEvaluado;

        const hashEstado = `${resultado.nombreActualPlayer}_${totalAciertos}_${totalFallos}`;
        if (hashEstado === ultimoHashPartida.current) {
          return;
        }

        if (guardando.current) return;

        guardando.current = true;
        setEstado("Actualizando informe de la partida...");

        const nombreUsuario = perfil
          ? `${perfil.nombre} ${perfil.apellido}`.trim()
          : resultado.nombreActualPlayer || "Participante";

        guardarOActualizarResultadoSesion(
          sesionDocIdRef.current,
          user.uid,
          nombreUsuario,
          user.email || "",
          "memoria-001",
          "Memoria visual",
          "Memoria",
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
        console.error("Mensaje de Unity inválido:", error);
      }
    }

    window.addEventListener("message", recibirResultados);

    return () => {
      window.removeEventListener("message", recibirResultados);
    };
  }, [user, perfil]);

  return (
    <section>
      <h1>Escenario cognitivo</h1>

      <iframe
        src="https://1lxldbc3-3000.use2.devtunnels.ms/"
        title="Escenario de memoria visual"
        width="100%"
        height="700"
        style={{ border: 0 }}
      />

      <p role="status">{estado}</p>
    </section>
  );
}