import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, doc, getCountFromServer, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";

interface PerfilUsuario {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: boolean;
}
interface Escenarios{
  count: 0
}

interface AuthContextType {
  user: User | null;
  perfil: PerfilUsuario | null;
  escenario: Escenarios | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  loading: true,
  escenario: null,
});

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [escenario, setEscenario] = useState<Escenarios | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setPerfil(null);
        setLoading(false);
        return;
      }

      try {
        // ÚNICA consulta al perfil durante esta sesión
        const usuarioRef = doc(db, "users", currentUser.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          console.log(usuarioSnap.data())
          setPerfil(usuarioSnap.data() as PerfilUsuario);
        }

        // ÚNICA consulta al perfil durante esta sesión
        const escenariosRef = collection(db, "escenarios");
        const escenariosSnap = await getCountFromServer(escenariosRef);

        if (escenariosSnap.data) {
          console.log(escenariosSnap.data())
          setEscenario(escenariosSnap.data() as unknown as Escenarios)
          console.log(escenario)
          //setPerfil(usuarioSnap.data() as PerfilUsuario);
        }

      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        console.log(perfil)
        console.log(escenario?.count)
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        loading,
        escenario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}