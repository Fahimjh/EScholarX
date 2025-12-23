import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }: any) {
  const { user } = useAuth();

  // Avoid redirecting to login before AuthContext hydrates from localStorage
  const storedUser = typeof window !== "undefined"
    ? window.localStorage.getItem("user")
    : null;

  if (!user && storedUser) {
    // Still hydrating auth state; render nothing or a small placeholder
    return null;
  }

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}
