import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

export async function registrarUsuario(
  nombre: string,
  apellido: string,
  email: string,
  password: string,
) {


  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = credential.user;
  
  await setDoc(doc(db, "users", user.uid), {
    nombre: nombre,
    apellido: apellido,
    email: email,
    rol: "participante",
    creadoEn: serverTimestamp(),
    estado: true,
  });  

  return user;
}

export async function iniciarSesion(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}