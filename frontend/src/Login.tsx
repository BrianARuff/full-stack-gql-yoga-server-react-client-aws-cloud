import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ConfirmSignUp } from "./ConfirmSignUp";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCreds, setPendingCreds] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const { isAuthenticated, isLoading, login, userError, setUserError } =
    useAuth();

  useEffect(() => {
    setUserError(null);
  }, [setUserError]);

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!username.trim() || !password) {
        setUserError("Username and password are required");
        return;
      }

      try {
        await login(username, password);
      } catch (error: unknown) {
        const cognitoError = error as { code?: string; message?: string };
        if (cognitoError.code === "UserNotConfirmedException") {
          setPendingCreds({ username, password });
          setShowConfirm(true);
          return;
        }
        console.error("Login failed:", cognitoError.message);
        document.querySelector<HTMLInputElement>("#username")?.focus();
      }
    },
    [username, password, login, setUserError],
  );

  if (isAuthenticated) {
    return null;
  }

  if (showConfirm) {
    return (
      <div>
        {isLoading && <Loader />}
        <ConfirmSignUp
          initialUsername={pendingCreds?.username ?? username}
          onVerified={() => {
            setShowConfirm(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {isLoading && <Loader />}

      <h1 className="title-text">Login</h1>

      <form onSubmit={handleOnSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          className={userError ? "input-error" : ""}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          className={userError ? "input-error" : ""}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {userError && <ErrorMessage message={userError} />}

      <div className="create-user-account-container">
        <Link to="/signup" className="link">
          Create Account
        </Link>
      </div>
    </div>
  );
};
