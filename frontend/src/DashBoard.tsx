import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Books } from "./Books";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";

const HELLO_NAME_QUERY = gql`
  query GetIntroductionMessage($name: String!) {
    getIntroductionMessage(name: $name) {
      message
      name
    }
  }
`;

export const Dashboard = () => {
  const { user, logout } = useAuth();

  const { loading, error, data } = useQuery<{
    getIntroductionMessage: {
      message: string;
      name: string;
    };
  }>(HELLO_NAME_QUERY, {
    variables: { name: user?.getUsername() },
  });

  const [userAttributes, setUserAttributes] = useState<any>(null);

  useEffect(() => {
    if (user) {
      user.getUserAttributes((err, attributes) => {
        if (err) {
          console.error("Failed to get user attributes:", err);
          return;
        }
        setUserAttributes(attributes);
      });
    }
  }, [user]);

  return (
    <div>
      {loading ? <Loader /> : null}

      {data ? (
        <>
          <h1 className="title-text">
            GraphQL Server GetIntroductionMessage Query Reponse:
          </h1>
          <p className="subtitle-text">
            {data?.getIntroductionMessage?.message}:
            <span
              style={{
                marginLeft: "0.1rem",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              {data?.getIntroductionMessage?.name}
            </span>
          </p>

          <h2 className="subtitle-text">User Attributes:</h2>
          <div className="user-attributes-container">
            {userAttributes?.map(
              ({
                Name: name,
                Value: value,
              }: {
                Name: string;
                Value: string;
              }) => (
                <div key={name}>
                  <span
                    className="subtitle-text attribute-name"
                    style={{ marginRight: "10px" }}
                  >
                    {name}:
                  </span>
                  <span className="subtitle-text attribute-value">{value}</span>
                </div>
              ),
            )}
          </div>

          <Books />

          <form>
            <button className="logout" onClick={logout} type="submit">
              Logout
            </button>
          </form>
        </>
      ) : null}

      {error ? <ErrorMessage message={error?.message} /> : null}
    </div>
  );
};
