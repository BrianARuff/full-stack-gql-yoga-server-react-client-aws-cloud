import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ConfirmSignUp } from "./ConfirmSignUp";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";

const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($username: String!) {
    createAdminUser(username: $username)
  }
`;

const PASSWORD_MIN_LENGTH = 8;

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
  const [createAdminUser] = useMutation(CREATE_ADMIN_USER);

  const getGraphQLErrorMessage = (error: unknown): string => {
    const gqlError = error as {
      graphQLErrors?: Array<{ message: string }>;
      message?: string;
    };
    return (
      gqlError?.graphQLErrors?.[0]?.message ??
      gqlError?.message ??
      "Unknown error"
    );
  };

  const validateForm = useCallback((): string | null => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (!email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }, [username, email, password, confirmPassword]);

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setValidationError("");
      setSuccessMessage("");

      const error = validateForm();
      if (error) {
        setValidationError(error);
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
        const errMsg = getGraphQLErrorMessage(error);
        setValidationError(
          errMsg || "Failed to create account. Please try again.",
        );
        document.querySelector<HTMLInputElement>("#username")?.focus();
      } finally {
        setIsLoading(false);
      }
    },
    [username, email, password, isAdmin, validateForm, signUp, createAdminUser],
  );

  const displayError = validationError || userError;

  if (showConfirm) {
    return (
      <div>
        {isLoading && <Loader />}
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
      {isLoading && <Loader />}

      <h1 className="title-text">Create Account</h1>

      <form onSubmit={handleOnSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          className={displayError ? "input-error" : ""}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          className={displayError ? "input-error" : ""}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="new-password"
          className={displayError ? "input-error" : ""}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          autoComplete="new-password"
          className={displayError ? "input-error" : ""}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            disabled={isLoading}
          />
          Request admin access
        </label>
        <p className="info-message">
          Admin access must be granted by a server-side admin process.
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {displayError && <ErrorMessage message={displayError} />}

      {successMessage && !showConfirm && (
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
