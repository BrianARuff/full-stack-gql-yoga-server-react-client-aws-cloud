import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useDeferredValue, useState } from "react";

const HELLO_NAME_QUERY = gql`
  query hello($name: String) {
    hello(name: $name)
  }
`;

export const ExampleGraphQL = () => {
  const [inputValue, setInputValue] = useState("");
  const deferredInputValue = useDeferredValue(inputValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const { loading, error, data } = useQuery<{ hello: string }>(
    HELLO_NAME_QUERY,
    {
      variables: { name: deferredInputValue },
    },
  );

  return (
    <div>
      {loading && <span>Loading...</span>}
      {error && <p>Error: {error.message}</p>}
      <h1
        style={{
          minHeight: "2.5em",
          margin: 0,
          lineHeight: "1.25",
        }}
      >
        {data?.hello}
      </h1>
      <input
        value={inputValue}
        onChange={handleChange}
        type="text"
        placeholder="Enter your name"
      />
      <button onClick={() => {}}>Sign in</button>
      <button onClick={() => {}}>Sign out</button>
    </div>
  );
};
