import { useCallback } from "react";
import { useAuth } from "./AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      logout();
    },
    [logout],
  );

  return (
    <button className="logout" onClick={handleLogout}>
      Logout
    </button>
  );
};
