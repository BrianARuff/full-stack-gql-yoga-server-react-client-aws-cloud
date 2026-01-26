import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ConfirmSignUp } from "./ConfirmSignUp";
import { Loader } from "./Loader";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, isLoading, login, userError, setUserError } =
    useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCreds, setPendingCreds] = useState<{
    username: string;
    password: string;
  } | null>(null);

  if (isAuthenticated) {
    return null;
  }

  useEffect(() => {
    setUserError(null);
  }, []);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error: unknown) {
      const cognitoError = error as { code?: string; message?: string };
      if (cognitoError.code === "UserNotConfirmedException") {
        setPendingCreds({ username, password });
        setShowConfirm(true);
        return;
      }
      console.error("Login failed!!!");
      document.querySelector<HTMLInputElement>("#username")?.focus();
    }
  };

  const handleOnChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (showConfirm) {
    return (
      <div>
        {isLoading ? <Loader /> : null}
        <ConfirmSignUp
          initialUsername={pendingCreds?.username || username}
          onVerified={() => {
            setShowConfirm(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {isLoading ? <Loader /> : null}

      <form onSubmit={handleOnSubmit}>
        <label htmlFor="username">Login</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          className={userError ? "input-error" : ""}
          onChange={handleOnChangeUsername}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          className={userError ? "input-error" : ""}
          onChange={handleOnChangePassword}
        />

        <button type="submit">Login</button>
      </form>

      {userError && (
        <p aria-live="assertive" aria-atomic="true" className="error-message">
          Invalid username or password. Please try again.
        </p>
      )}

      {/* redirect to createUser page */}
      <div className="create-user-account-container">
        <Link to="/signup" className="link">
          Create Account
        </Link>
      </div>
    </div>
  );
};
