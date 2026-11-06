import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  guardarResultadoEscenario,
  type DatosUnityEscenario,
} from "../../services/resultadosService";

export default function Escenario() {
  const { user, perfil } = useAuth();

  const [estado, setEstado] = useState("Esperando resultados...");
  const guardando = useRef(false);

  useEffect(() => {
    function recibirResultados(event: MessageEvent) {
      if (!event.data || event.data.tipo !== "RESULTADOS_ESCENARIO") {
        return;
      }

      if (guardando.current) return;

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
          typeof resultado.nombreActualPlayer !== "string" ||
          resultado.nombreActualPlayer.length === 0 ||
          !Number.isFinite(resultado.fallosNivel3) ||
          !Number.isFinite(resultado.fallosNivel2) ||
          !Number.isFinite(resultado.fallosNivel1) ||
          resultado.fallosNivel2 < 0 ||
          resultado.fallosNivel1 < 0
        ) {
          setEstado("El formato de los resultados no es válido.");
          return;
        }

        guardando.current = true;
        setEstado("Guardando resultados...");

        const nombreUsuario = perfil
          ? `${perfil.nombre} ${perfil.apellido}`.trim()
          : resultado.nombreActualPlayer || "Participante";

        guardarResultadoEscenario(
          user.uid,
          nombreUsuario,
          user.email || "",
          "memoria-001",
          "Memoria visual",
          "Memoria",
          resultado
        )
          .then(() => {
            setEstado("Resultados guardados correctamente.");
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
        setEstado("No se pudieron interpretar los resultados.");
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