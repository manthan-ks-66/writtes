import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

// Protection Container
function AuthLayout({ children }) {
  const authStatus = useSelector((state) => state.auth.status);
  const verificationStatus = sessionStorage.getItem("verificationStatus");

  const location = useLocation();

  const currentPath = location.pathname;

  const isAuthRoute = currentPath.startsWith("/auth");

  const isVerificationRoute = currentPath.endsWith("/verify");

  const isProtectedRoute =
    currentPath.startsWith("/user") || currentPath.startsWith("/post/new");

  if (isAuthRoute && authStatus) return <Navigate to="/" replace />;

  if (isProtectedRoute && !authStatus)
    return <Navigate to="/auth/login" replace />;

  // TODO: Make another redux slice for un-authenticated user and use the verificationStatus on the slice
  if (isVerificationRoute && !verificationStatus)
    return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default AuthLayout;
