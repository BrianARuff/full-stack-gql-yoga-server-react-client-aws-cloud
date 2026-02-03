import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ErrorMessage } from "./ErrorMessage";
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
    initialUsername ?? searchParams.get("username") ?? "",
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
  }, [setUserError]);

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage("");
      setInfoMessage("");

      if (!username.trim()) {
        setUserError("Username is required");
        return;
      }

      if (!code.trim()) {
        setUserError("Verification code is required");
        return;
      }

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
    },
    [username, code, confirmSignUp, onVerified, setUserError],
  );

  const handleResendCode = useCallback(async () => {
    if (!username.trim()) {
      setUserError("Username is required to resend code");
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
  }, [username, resendConfirmationCode, setUserError]);

  return (
    <div>
      {isLoading && <Loader />}

      <h1 className="title-text">Verify Your Account</h1>

      <p className="info-message">
        Please enter the verification code sent to your email.
      </p>

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

        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter code"
          value={code}
          autoComplete="one-time-code"
          className={userError ? "input-error" : ""}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Account"}
        </button>
      </form>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={!username.trim() || isLoading}
        >
          Resend Code
        </button>
      </div>

      {userError && <ErrorMessage message={userError} />}

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
