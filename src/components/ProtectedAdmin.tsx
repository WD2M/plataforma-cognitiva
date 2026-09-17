import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

function ProtectedAdmin({ children }: Props) {

  const { user, perfil, loading } = useAuth();


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (perfil?.rol !== "administrador") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedAdmin;