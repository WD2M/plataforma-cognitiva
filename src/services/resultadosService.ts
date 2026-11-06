import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
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

// Calcular porcentaje de acierto basado en todos los niveles jugados (incluyendo Tutorial si hubo aciertos/fallos)
export function calcularPuntuacion(datos: DatosUnityEscenario): {
  puntuacion: number;
  aciertosTotales: number;
  fallosTotales: number;
  intentosTotales: number;
} {
  const aciertosNivelesPrincipales =
    (datos.aciertosNivel1 || 0) +
    (datos.aciertosNivel2 || 0) +
    (datos.aciertosNivel3 || 0);

  const fallosNivelesPrincipales =
    (datos.fallosNivel1 || 0) +
    (datos.fallosNivel2 || 0) +
    (datos.fallosNivel3 || 0);

  // Sumamos también el tutorial para que coincida siempre con lo que el jugador vio en pantalla
  const aciertosTotales =
    (datos.aciertosNivelTutorial || 0) + aciertosNivelesPrincipales;

  const fallosTotales =
    (datos.fallosNivelTutorial || 0) + fallosNivelesPrincipales;

  const intentosTotales =
    (datos.intentosNivelTutorial || 0) +
    (datos.intentosNivel1 || 0) +
    (datos.intentosNivel2 || 0) +
    (datos.intentosNivel3 || 0);

  const totalEvaluado = aciertosTotales + fallosTotales;

  let puntuacion = 0;
  if (totalEvaluado > 0) {
    puntuacion = Math.round((aciertosTotales / totalEvaluado) * 100);
  } else {
    puntuacion = 0;
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

// Guardar o actualizar el resultado de la sesión actual en Firestore
// Si se pasa `sesionDocId`, actualiza ese mismo informe para consolidar todos los aciertos/fallos en un único reporte final
export async function guardarOActualizarResultadoSesion(
  sesionDocId: string | null,
  userUid: string,
  usuarioNombre: string,
  usuarioEmail: string,
  escenarioId: string,
  escenarioTitulo: string,
  categoria: string,
  datosUnity: DatosUnityEscenario
): Promise<string> {
  const calculo = calcularPuntuacion(datosUnity);

  const payload = {
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
  };

  if (sesionDocId) {
    const docRef = doc(db, "resultados", sesionDocId);
    await setDoc(docRef, payload, { merge: true });
    return sesionDocId;
  } else {
    const docRef = await addDoc(collection(db, "resultados"), payload);
    return docRef.id;
  }
}

// Mantener alias por compatibilidad
export async function guardarResultadoEscenario(
  userUid: string,
  usuarioNombre: string,
  usuarioEmail: string,
  escenarioId: string,
  escenarioTitulo: string,
  categoria: string,
  datosUnity: DatosUnityEscenario
): Promise<string> {
  return guardarOActualizarResultadoSesion(
    null,
    userUid,
    usuarioNombre,
    usuarioEmail,
    escenarioId,
    escenarioTitulo,
    categoria,
    datosUnity
  );
}

// Normalizar un documento de Firestore (por si es antiguo o tiene estructura previa)
function normalizarDocumento(id: string, raw: Record<string, any>): RegistroResultado | null {
  const datosUnity: DatosUnityEscenario | undefined = raw.datosUnity || raw.datos;
  const calculo = datosUnity
    ? calcularPuntuacion(datosUnity)
    : {
        puntuacion: typeof raw.puntuacion === "number" ? raw.puntuacion : 0,
        aciertosTotales: raw.aciertosTotales ?? 0,
        fallosTotales: raw.fallosTotales ?? 0,
        intentosTotales: raw.intentosTotales ?? 0,
      };

  // Filtrar registros basura que tengan 0 aciertos y 0 fallos
  if (calculo.aciertosTotales === 0 && calculo.fallosTotales === 0) {
    return null;
  }

  return {
    id,
    userUid: raw.userUid || raw.useruid || raw.uid || "",
    usuarioNombre:
      raw.usuarioNombre ||
      datosUnity?.nombreActualPlayer ||
      "Participante",
    usuarioEmail: raw.usuarioEmail || "",
    escenarioId: raw.escenarioId || "1",
    escenarioTitulo: raw.escenarioTitulo || "Memoria visual",
    categoria: raw.categoria || "Memoria",
    puntuacion: calculo.puntuacion,
    aciertosTotales: calculo.aciertosTotales,
    fallosTotales: calculo.fallosTotales,
    intentosTotales: calculo.intentosTotales,
    datosUnity: datosUnity as DatosUnityEscenario,
    creadoEn: raw.creadoEn || null,
  };
}

// Consolida registros fragmentados de una misma sesión (cuando se guardaban por cada acierto/fallo)
// Si dos registros del mismo usuario y escenario ocurrieron con menos de 10 minutos de diferencia
// y uno es la continuación incremental del otro, nos quedamos únicamente con el reporte final consolidado.
function consolidarSesionesFragmentadas(
  lista: RegistroResultado[]
): RegistroResultado[] {
  // Asegurar orden del más reciente al más antiguo
  const ordenados = [...lista].sort((a, b) => {
    const fechaA = (a.creadoEn as Timestamp)?.toMillis?.() || 0;
    const fechaB = (b.creadoEn as Timestamp)?.toMillis?.() || 0;
    return fechaB - fechaA;
  });

  const resultadoConsolidado: RegistroResultado[] = [];

  for (const actual of ordenados) {
    const ultimoAceptado = resultadoConsolidado[resultadoConsolidado.length - 1];

    if (
      ultimoAceptado &&
      ultimoAceptado.userUid === actual.userUid &&
      ultimoAceptado.escenarioId === actual.escenarioId
    ) {
      const tUltimo = (ultimoAceptado.creadoEn as Timestamp)?.toMillis?.() || 0;
      const tActual = (actual.creadoEn as Timestamp)?.toMillis?.() || 0;
      const diferenciaMinutos = Math.abs(tUltimo - tActual) / (1000 * 60);

      // Si pertenecen a la misma sesión de juego (< 12 minutos entre eventos de la misma partida)
      // y el registro más reciente tiene igual o más jugadas acumuladas que el evento intermedio anterior
      const jugadasUltimo =
        ultimoAceptado.aciertosTotales + ultimoAceptado.fallosTotales;
      const jugadasActual = actual.aciertosTotales + actual.fallosTotales;

      if (diferenciaMinutos <= 12 && jugadasUltimo >= jugadasActual) {
        // Ignoramos este registro intermedio porque ya está incluido en el informe final de esa sesión (`ultimoAceptado`)
        continue;
      }
    }

    resultadoConsolidado.push(actual);
  }

  return resultadoConsolidado;
}

// Limpiar registros con 0 aciertos y 0 fallos o fragmentados de un usuario en la BD (en segundo plano)
export async function limpiarRegistrosBasuraUsuario(userUid: string): Promise<void> {
  try {
    const q = query(
      collection(db, "resultados"),
      where("userUid", "==", userUid)
    );
    const snap = await getDocs(q);
    const promesasBorrado: Promise<void>[] = [];

    const validos: { docId: string; item: RegistroResultado }[] = [];

    for (const d of snap.docs) {
      const normalizado = normalizarDocumento(d.id, d.data());
      if (!normalizado) {
        // Es un registro basura (0 aciertos y 0 fallos) -> se elimina de Firestore
        promesasBorrado.push(deleteDoc(doc(db, "resultados", d.id)));
      } else {
        validos.push({ docId: d.id, item: normalizado });
      }
    }

    // También detectar registros intermedios fragmentados de una misma sesión y eliminarlos de Firestore
    const consolidados = consolidarSesionesFragmentadas(
      validos.map((v) => v.item)
    );
    const idsConservados = new Set(consolidados.map((c) => c.id));

    for (const v of validos) {
      if (!idsConservados.has(v.docId)) {
        promesasBorrado.push(deleteDoc(doc(db, "resultados", v.docId)));
      }
    }

    if (promesasBorrado.length > 0) {
      await Promise.all(promesasBorrado);
    }
  } catch (e) {
    console.warn("No se pudieron limpiar registros vacíos/fragmentados:", e);
  }
}

// Obtener historial de resultados de un usuario
export async function obtenerResultadosUsuario(
  userUid: string
): Promise<RegistroResultado[]> {
  try {
    // Limpieza rápida de registros en 0 (color de carro, menús, etc.)
    await limpiarRegistrosBasuraUsuario(userUid);

    const q = query(
      collection(db, "resultados"),
      where("userUid", "==", userUid),
      orderBy("creadoEn", "desc")
    );
    const snap = await getDocs(q);
    const validos = snap.docs
      .map((docSnap) => normalizarDocumento(docSnap.id, docSnap.data()))
      .filter((item): item is RegistroResultado => item !== null);

    return consolidarSesionesFragmentadas(validos);
  } catch (error) {
    console.warn("Fallo con orderBy, ordenando localmente:", error);
    const fallbackQ = query(
      collection(db, "resultados"),
      where("userUid", "==", userUid)
    );
    const fallbackSnap = await getDocs(fallbackQ);
    const validos = fallbackSnap.docs
      .map((docSnap) => normalizarDocumento(docSnap.id, docSnap.data()))
      .filter((item): item is RegistroResultado => item !== null);

    return consolidarSesionesFragmentadas(validos);
  }
}

// Obtener todos los resultados para el administrador
export async function obtenerTodosLosResultados(): Promise<RegistroResultado[]> {
  try {
    const q = query(collection(db, "resultados"), orderBy("creadoEn", "desc"));
    const snap = await getDocs(q);
    const validos = snap.docs
      .map((docSnap) => normalizarDocumento(docSnap.id, docSnap.data()))
      .filter((item): item is RegistroResultado => item !== null);

    return consolidarSesionesFragmentadas(validos);
  } catch (error) {
    console.warn("Fallo con orderBy general, fallback sin ordenar:", error);
    const snap = await getDocs(collection(db, "resultados"));
    const validos = snap.docs
      .map((docSnap) => normalizarDocumento(docSnap.id, docSnap.data()))
      .filter((item): item is RegistroResultado => item !== null);

    return consolidarSesionesFragmentadas(validos);
  }
}
