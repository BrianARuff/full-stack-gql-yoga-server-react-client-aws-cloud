import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader } from "./Loader";

type ConfirmSignUpProps = {
  initialUsername?: string;
  onVerified?: () => void | Promise<void>;
};

export const ConfirmSignUp = ({
  initialUsername,
  onVerified,
}: ConfirmSignUpProps) => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(
    initialUsername || searchParams.get("username") || "",
  );
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { confirmSignUp, resendConfirmationCode, userError, setUserError } =
    useAuth();

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  useEffect(() => {
    setUserError(null);
  }, []);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setInfoMessage("");
    setIsLoading(true);

    try {
      await confirmSignUp(username, code);
      setSuccessMessage("Account verified! Please log in.");
      await onVerified?.();
    } catch (error: unknown) {
      const cognitoError = error as { code?: string; message?: string };
      if (
        cognitoError.code === "NotAuthorizedException" ||
        cognitoError.message?.includes("Current status is CONFIRMED")
      ) {
        setSuccessMessage("Account is already verified. Please log in.");
        await onVerified?.();
      } else {
        console.error("Confirmation failed:", error);
        document.querySelector<HTMLInputElement>("#code")?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) {
      return;
    }

    setSuccessMessage("");
    setInfoMessage("");
    setIsLoading(true);

    try {
      await resendConfirmationCode(username);
      setInfoMessage("A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Failed to resend code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? <Loader /> : null}

      <h1 className="title-text">Verify Your Account</h1>

      <p className="info-message">
        Please enter the verification code sent to your email.
      </p>

      <form onSubmit={handleOnSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          className={userError ? "input-error" : ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          placeholder="Enter code"
          value={code}
          className={userError ? "input-error" : ""}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button type="submit">Verify Account</button>
      </form>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button type="button" onClick={handleResendCode} disabled={!username}>
          Resend Code
        </button>
      </div>

      {userError && (
        <p aria-live="assertive" aria-atomic="true" className="error-message">
          {userError}
        </p>
      )}

      {successMessage && (
        <p aria-live="polite" className="success-message">
          {successMessage}
        </p>
      )}

      {infoMessage && (
        <p aria-live="polite" className="info-message">
          {infoMessage}
        </p>
      )}
    </div>
  );
};
