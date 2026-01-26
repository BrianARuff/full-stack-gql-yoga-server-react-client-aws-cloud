import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ConfirmSignUp } from "./ConfirmSignUp";
import { Loader } from "./Loader";

const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($username: String!) {
    createAdminUser(username: $username)
  }
`;

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const { signUp, userError } = useAuth();
  const [createAdminUser] = useMutation(CREATE_ADMIN_USER, {
    variables: { username },
  });

  const getGraphQLErrorMessage = (error: unknown) => {
    // @ts-ignore
    return error?.graphQLErrors?.[0]?.message || (error as Error)?.message;
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMessage("");

    if (isAdmin) {
      setValidationError("");
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(username, password, email);

      if (isAdmin) {
        try {
          await createAdminUser({ variables: { username } });
        } catch (adminError) {
          const msg = getGraphQLErrorMessage(adminError);
          setValidationError(
            msg ||
              "Admin request failed. Please contact an administrator to grant access.",
          );
        }
      }

      setSuccessMessage(
        "Account created successfully! Please check your email to verify your account.",
      );
      setValidationError("");
      setConfirmUsername(username);
      setShowConfirm(true);

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup failed:", error);
      setValidationError("Failed to create account. Please try again.");
      document.querySelector<HTMLInputElement>("#username")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = validationError || userError;

  if (showConfirm) {
    return (
      <div>
        {isLoading ? <Loader /> : null}
        {successMessage && (
          <p aria-live="polite" className="success-message">
            {successMessage}
          </p>
        )}
        <ConfirmSignUp
          initialUsername={confirmUsername}
          onVerified={() => {
            setShowConfirm(false);
            navigate("/");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {isLoading ? <Loader /> : null}

      <h1 className="title-text">Create Account</h1>

      <form onSubmit={handleOnSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          className={displayError ? "input-error" : ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          className={displayError ? "input-error" : ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          className={displayError ? "input-error" : ""}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          className={displayError ? "input-error" : ""}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Request admin access
        </label>
        <p className="info-message">
          Admin access must be granted by a server-side admin process.
        </p>

        <button type="submit">Create Account</button>
      </form>

      {displayError && (
        <p aria-live="assertive" aria-atomic="true" className="error-message">
          {displayError}
        </p>
      )}

      {successMessage && (
        <p aria-live="polite" className="success-message">
          {successMessage}
        </p>
      )}

      <div className="create-user-account-container">
        <Link to="/" className="link">
          Login
        </Link>
      </div>
    </div>
  );
};
