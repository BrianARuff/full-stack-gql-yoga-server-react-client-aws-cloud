import { delay } from "../../../utils/delay";

export const getIntroductionMessage = async (
  _: unknown,
  args: { name: string },
) => {
  await delay(1000); // Simulate a delay of 1 second

  return {
    message: `Hello, ${args.name}! Welcome to our GraphQL API.`,
    name: args.name,
  };
};
