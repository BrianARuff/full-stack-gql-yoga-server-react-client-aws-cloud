import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { userPool } from "./main";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CognitoUser | null;
  pendingUser: CognitoUser | null;
  userError: string | null;
  requiresNewPassword: boolean;
  logout: () => void;
  resendConfirmationCode: (username: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  setUserError: (error: string | null) => void;
  completeNewPassword: (
    newPassword: string,
    cognitoUser: CognitoUser,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<CognitoUser | null>(null);
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession(
        (err: Error | null, session: CognitoUserSession | null) => {
          if (err) {
            setIsAuthenticated(false);
            setUser(null);
          } else if (session?.isValid()) {
            setIsAuthenticated(true);
            setUser(cognitoUser);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          setIsLoading(false);
        },
      );
    } else {
      setIsAuthenticated(false);
    }
  };

  const login = (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setUserError(null);

    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (_session) => {
          setIsAuthenticated(true);
          setUser(cognitoUser);
          setUserError(null);
          setIsLoading(false);
          resolve();
        },
        onFailure: (err) => {
          console.error("Authentication failed:", err);
          setUserError(err.message || "Authentication failed");
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          reject(err);
        },
        newPasswordRequired: (userAttributes) => {
          console.log(
            "New password required for user:",
            username,
            userAttributes,
          );
          setPendingUser(cognitoUser);
          setRequiresNewPassword(true);
          setIsLoading(false);
          setUserError("New password required. Please set a new password.");
          reject(new Error("New password required"));
        },
      });
    });
  };

  const logout = () => {
    setIsLoading(true);

    setTimeout(() => {
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.signOut();
      }

      setIsAuthenticated(false);
      setUser(null);
      setUserError(null);

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 0);
  };

  const signUp = (
    username: string,
    password: string,
    email: string,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: "email", Value: email })],
        [],
        (err, result) => {
          if (err) {
            setUserError(err.message || "Registration failed");
            reject(err);
          } else {
            if (result?.user) {
              setPendingUser(result.user);
            }

            resolve();
          }
        },
      );
    });
  };

  const completeNewPassword = (
    newPassword: string,
    cognitoUser: CognitoUser,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        {},
        {
          onSuccess: (session) => {
            console.log("Password change successful:", session);
            setIsAuthenticated(true);
            setUser(pendingUser);
            setPendingUser(null);
            setRequiresNewPassword(false);
            setUserError(null);
            setIsLoading(false);
            resolve();
          },
          onFailure: (err) => {
            console.error("Password change failed:", err);
            setUserError(err.message || "Password change failed");
            setIsLoading(false);
            reject(err);
          },
        },
      );
    });
  };

  const confirmSignUp = (username: string, code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          setUserError(err.message || "Confirmation failed");
          reject(err);
        } else {
          console.log("Confirmation successful:", result);
          setUserError(null);
          resolve();
        }
      });
    });
  };

  const resendConfirmationCode = (username: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          console.error("Failed to resend code:", err);
          setUserError(err.message || "Failed to resend code");
          reject(err);
          return;
        }

        console.log("Code resent:", result);
        setUserError(null);
        resolve();
      });
    });
  };

  // Clear userError on navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setUserError(null);
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener("popstate", handleLocationChange);

    // Store original pushState and replaceState
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    // Override pushState
    history.pushState = (...args) => {
      originalPushState(...args);
      handleLocationChange();
    };

    // Override replaceState
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        userError,
        pendingUser,
        isAuthenticated,
        requiresNewPassword,
        login,
        logout,
        signUp,
        setUserError,
        confirmSignUp,
        completeNewPassword,
        resendConfirmationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const getJwtToken = async (): Promise<string | null> => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) return null;

  return new Promise((resolve) => {
    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session?.isValid()) {
          resolve(null);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      },
    );
  });
};
