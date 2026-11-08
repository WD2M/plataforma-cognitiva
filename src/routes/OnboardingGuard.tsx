import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function OnboardingGuard({ children }: Props) {
  const { user, perfil, loading } = useAuth();

  if (loading) {
    return <p>Cargando tu perfil...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil) {
    return <p>No se pudo cargar tu perfil.</p>;
  }

  // El administrador no requiere diligenciar el formulario inicial de participante
  const esAdmin = perfil.rol?.toLowerCase() === "administrador";
  if (!esAdmin && perfil.estado !== true) {
    return <Navigate to="/formularioinicial" replace />;
  }

  return <>{children}</>;
}