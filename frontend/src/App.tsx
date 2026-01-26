import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Login } from "./Login";
import { Dashboard } from "./DashBoard";
import { SignUp } from "./SignUp";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Dashboard />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
