import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { Buffer } from "buffer";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

import { ApolloProvider } from "@apollo/client/react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { AuthProvider, getJwtToken } from "./AuthContext.tsx";

window.Buffer = Buffer;

export const poolData = {
  UserPoolId: import.meta.env.AGQL_BE_AWS_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_AGQL_FE_AWS_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

const httpLink = new HttpLink({
  uri:
    import.meta.env.AGQL_BE_NODE_ENV === "production"
      ? import.meta.env.VITE_AGQL_FE_APP_GRAPHQL_API_PROD
      : import.meta.env.VITE_AGQL_FE_APP_GRAPHQL_API,
});

const authLink = new SetContextLink(async (prevContext, _operation) => {
  const token = await getJwtToken();
  const prevHeaders = prevContext?.headers ?? {};
  return {
    headers: {
      ...prevHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>,
);
