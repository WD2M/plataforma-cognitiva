
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface Escenario {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  dificultad: string;
  duracion: string;
  webglUrl: string;
  imgUrl: string;
  activo: boolean;
  creadoEn?: unknown;
}

export type NuevoEscenarioDatos = Omit<
  Escenario,
  "id" | "creadoEn"
>;

// Obtener los escenarios activos para los participantes
export async function obtenerEscenariosActivos(): Promise<Escenario[]> {
  const consulta = query(
    collection(db, "escenarios"),
    where("activo", "==", true)
  );

  const resultado = await getDocs(consulta);

  return resultado.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Escenario[];
}

// Obtener todos los escenarios para Administración
export async function obtenerTodosLosEscenarios(): Promise<Escenario[]> {
  const consulta = query(
    collection(db, "escenarios"),
    orderBy("creadoEn", "desc")
  );

  const resultado = await getDocs(consulta);

  return resultado.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Escenario[];
}

// Crear un escenario desde Administración
export async function crearEscenario(
  datos: NuevoEscenarioDatos
): Promise<string> {
  const referencia = await addDoc(collection(db, "escenarios"), {
    ...datos,
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    webglUrl: datos.webglUrl.trim(),
    imgUrl: datos.imgUrl.trim(),
    creadoEn: serverTimestamp(),
  });

  return referencia.id;
}

// Activar o desactivar un escenario
export async function cambiarEstadoEscenario(
  id: string,
  activo: boolean
): Promise<void> {
  await updateDoc(doc(db, "escenarios", id), {
    activo,
  });
}
