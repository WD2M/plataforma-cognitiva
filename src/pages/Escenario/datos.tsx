import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const ORIGEN_UNITY = "https://wd2m.github.io/PruebaWebGL/";


interface ResultadoEscenario {
  nombreActualPlayer: string;
  nombreHombre: string;
  nombreMujer: string;
  avatar: number;
  colorCarro: number;
  isMutedVolumen: boolean;
  musicaVolumen: number;
  EfectosVolumen: number;
  primeraVezEntrando: boolean;
  intentosNivelTutorial: number;
  intentosNivel1: number;
  intentosNivel2: number;
  intentosNivel3: number;
  aciertosNivelTutorial: number;
  aciertosNivel1: number;
  aciertosNivel2: number;
  aciertosNivel3: number;
  fallosNivelTutorial: number;
  fallosNivel1: number;
  fallosNivel2: number;
  fallosNivel3: number;
}

export default function Escenario() {
  const { user } = useAuth();

  const [estado, setEstado] = useState("Esperando resultados...");
  const guardando = useRef(false);

  useEffect(() => {
    function recibirResultados(event: MessageEvent) {

      //if (event.origin !== ORIGEN_UNITY) return;

      if (
        !event.data ||
        event.data.tipo !== "RESULTADOS_ESCENARIO"
      ) {
        return;
      }

      if (guardando.current) return;

      if (!user) {
        setEstado("Debes iniciar sesión para guardar resultados.");
        return;
      }

      try {
        const resultado: ResultadoEscenario =
          typeof event.data.datos === "string"
            ? JSON.parse(event.data.datos)
            : event.data.datos;

            console.log("mlp resultado " + resultado.nombreActualPlayer);/// trabajamos aca ojo


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
          console.log("Fallo toda esta mierda")
          return;
        }

        guardando.current = true;
        setEstado("Guardando resultados...");


        

        void setDoc(doc(db, "resultados", user.uid), {
          useruid: user.uid,
          escenarioId: "memoria-001",
          datos: resultado,
          creadoEn: serverTimestamp(),
        })
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
  }, [user]);

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