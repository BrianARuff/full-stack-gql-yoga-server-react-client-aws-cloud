import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Dashboard } from "./DashBoard";
import { Loader } from "./Loader";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loader during initial auth check
  if (isLoading) {
    return <Loader message="Checking authentication..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
