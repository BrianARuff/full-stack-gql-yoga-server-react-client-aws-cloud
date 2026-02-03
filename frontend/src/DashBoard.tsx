import { useQuery } from "@apollo/client/react";
import { useAuth } from "./AuthContext";
import { BookArticles } from "./BookArticles";
import { ErrorMessage } from "./ErrorMessage";
import { GET_INTRODUCTION_QUERY, type IntroductionData } from "./graphql";
import { Loader } from "./Loader";
import { LogoutButton } from "./LogoutButton";
import { UserAttributes } from "./UserAttributes";

export const Dashboard = () => {
  const { user } = useAuth();

  const username = user?.getUsername() ?? "";

  const { loading, error, data } = useQuery<IntroductionData>(
    GET_INTRODUCTION_QUERY,
    {
      variables: { name: username },
      skip: !username,
    },
  );

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!data) {
    return <ErrorMessage message="No data available" />;
  }

  return (
    <>
      <h1 className="title-text">
        GraphQL Server GetIntroductionMessage Query Response:
      </h1>
      <p className="subtitle-text">
        {data.getIntroductionMessage.message}:{" "}
        <span
          style={{
            marginLeft: "0.1rem",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          {data.getIntroductionMessage.name}
        </span>
      </p>

      <UserAttributes />

      <BookArticles />

      <LogoutButton />
    </>
  );
};
