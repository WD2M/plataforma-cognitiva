import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props) {

  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  return <>{children}</>;
}
export default ProtectedRoute;
