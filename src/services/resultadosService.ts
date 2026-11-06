import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface DatosUnityEscenario {
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

export interface RegistroResultado {
  id?: string;
  userUid: string;
  usuarioNombre?: string;
  usuarioEmail?: string;
  escenarioId: string;
  escenarioTitulo: string;
  categoria: string;
  puntuacion: number; // Porcentaje de 0 a 100
  aciertosTotales: number;
  fallosTotales: number;
  intentosTotales: number;
  datosUnity: DatosUnityEscenario;
  creadoEn?: Timestamp | Date | null;
}

// Calcular porcentaje de acierto basado en los niveles
export function calcularPuntuacion(datos: DatosUnityEscenario): {
  puntuacion: number;
  aciertosTotales: number;
  fallosTotales: number;
  intentosTotales: number;
} {
  const aciertosTotales =
    (datos.aciertosNivel1 || 0) +
    (datos.aciertosNivel2 || 0) +
    (datos.aciertosNivel3 || 0);

  const fallosTotales =
    (datos.fallosNivel1 || 0) +
    (datos.fallosNivel2 || 0) +
    (datos.fallosNivel3 || 0);

  const intentosTotales =
    (datos.intentosNivel1 || 0) +
    (datos.intentosNivel2 || 0) +
    (datos.intentosNivel3 || 0);

  const totalEvaluado = aciertosTotales + fallosTotales;

  let puntuacion = 0;
  if (totalEvaluado > 0) {
    puntuacion = Math.round((aciertosTotales / totalEvaluado) * 100);
  } else if (intentosTotales > 0) {
    puntuacion = Math.max(0, Math.round(100 - fallosTotales * 10));
  } else {
    puntuacion = 100;
  }

  // Asegurar rango 0 - 100
  puntuacion = Math.max(0, Math.min(100, puntuacion));

  return {
    puntuacion,
    aciertosTotales,
    fallosTotales,
    intentosTotales,
  };
}

// Guardar un nuevo resultado en Firestore
export async function guardarResultadoEscenario(
  userUid: string,
  usuarioNombre: string,
  usuarioEmail: string,
  escenarioId: string,
  escenarioTitulo: string,
  categoria: string,
  datosUnity: DatosUnityEscenario
): Promise<string> {
  const calculo = calcularPuntuacion(datosUnity);

  const docRef = await addDoc(collection(db, "resultados"), {
    userUid,
    usuarioNombre,
    usuarioEmail,
    escenarioId,
    escenarioTitulo,
    categoria,
    puntuacion: calculo.puntuacion,
    aciertosTotales: calculo.aciertosTotales,
    fallosTotales: calculo.fallosTotales,
    intentosTotales: calculo.intentosTotales,
    datosUnity,
    creadoEn: serverTimestamp(),
  });

  return docRef.id;
}

// Obtener historial de resultados de un usuario
export async function obtenerResultadosUsuario(
  userUid: string
): Promise<RegistroResultado[]> {
  try {
    const q = query(
      collection(db, "resultados"),
      where("userUid", "==", userUid),
      orderBy("creadoEn", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as RegistroResultado[];
  } catch (error) {
    // Si falla por falta de índice compuesto, hacemos query sin orderBy y ordenamos en cliente
    console.warn("Fallo con orderBy, ordenando localmente:", error);
    const fallbackQ = query(
      collection(db, "resultados"),
      where("userUid", "==", userUid)
    );
    const fallbackSnap = await getDocs(fallbackQ);
    const docs = fallbackSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as RegistroResultado[];

    return docs.sort((a, b) => {
      const fechaA = (a.creadoEn as Timestamp)?.toMillis?.() || 0;
      const fechaB = (b.creadoEn as Timestamp)?.toMillis?.() || 0;
      return fechaB - fechaA;
    });
  }
}

// Obtener todos los resultados para el administrador
export async function obtenerTodosLosResultados(): Promise<RegistroResultado[]> {
  try {
    const q = query(collection(db, "resultados"), orderBy("creadoEn", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as RegistroResultado[];
  } catch (error) {
    console.warn("Fallo con orderBy general, fallback sin ordenar:", error);
    const snap = await getDocs(collection(db, "resultados"));
    const docs = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as RegistroResultado[];

    return docs.sort((a, b) => {
      const fechaA = (a.creadoEn as Timestamp)?.toMillis?.() || 0;
      const fechaB = (b.creadoEn as Timestamp)?.toMillis?.() || 0;
      return fechaB - fechaA;
    });
  }
}

