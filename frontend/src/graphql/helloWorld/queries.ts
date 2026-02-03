import { gql } from "@apollo/client";

export const GET_INTRODUCTION_QUERY = gql`
  query GetIntroductionMessage($name: String!) {
    getIntroductionMessage(name: $name) {
      message
      name
    }
  }
`;
