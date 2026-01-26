export const helloWorldTypeDefs = `
    type Query {
      getIntroductionMessage(name: String!): GetIntroductionMessageResponse!
    }

    type GetIntroductionMessageResponse {
      message: String!
      name: String!
    }
`;
