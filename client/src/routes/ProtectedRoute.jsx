import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-100 text-slate-600">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
