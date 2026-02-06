export const exposedEnvVars: Record<string, any> | undefined = {
  global: "globalThis",
  // Add import.meta.env.* mappings so import.meta.env.AGQL_BE_* is defined in the client bundle
  "import.meta.env.AGQL_BE_PORT": JSON.stringify(process.env.AGQL_BE_PORT),
  "import.meta.env.AGQL_BE_NODE_ENV": JSON.stringify(
    process.env.AGQL_BE_NODE_ENV,
  ),
  "import.meta.env.AGQL_BE_AWS_REGION": JSON.stringify(
    process.env.AGQL_BE_AWS_REGION,
  ),
  "import.meta.env.AGQL_BE_AWS_ACCESS_KEY_ID": JSON.stringify(
    process.env.AGQL_BE_AWS_ACCESS_KEY_ID,
  ),
  "import.meta.env.AGQL_BE_AWS_DDB_BOOKS_TABLE": JSON.stringify(
    process.env.AGQL_BE_AWS_DDB_BOOKS_TABLE,
  ),
  "import.meta.env.AGQL_BE_AWS_SECRET_ACCESS_KEY": JSON.stringify(
    process.env.AGQL_BE_AWS_SECRET_ACCESS_KEY,
  ),
  "import.meta.env.AGQL_BE_AWS_COGNITO_USER_POOL_ID": JSON.stringify(
    process.env.AGQL_BE_AWS_COGNITO_USER_POOL_ID,
  ),
  "import.meta.env.AGQL_BE_AWS_COGNITO_USER_POOL_GROUP_NAME": JSON.stringify(
    process.env.AGQL_BE_AWS_COGNITO_USER_POOL_GROUP_NAME,
  ),
  "import.meta.env.AGQL_BE_GMX_PORT": JSON.stringify(
    process.env.AGQL_BE_GMX_PORT,
  ),
  "import.meta.env.AGQL_BE_GMX_HOST": JSON.stringify(
    process.env.AGQL_BE_GMX_HOST,
  ),
  "import.meta.env.AGQL_BE_GMX_PASSWORD": JSON.stringify(
    process.env.AGQL_BE_GMX_PASSWORD,
  ),
  "import.meta.env.AGQL_BE_GMX_USERNAME": JSON.stringify(
    process.env.AGQL_BE_GMX_USERNAME,
  ),
  "import.meta.env.VITE_AGQL_FE_APP_GRAPHQL_API": JSON.stringify(
    process.env.VITE_AGQL_FE_APP_GRAPHQL_API,
  ),
  "import.meta.env.VITE_AGQL_FE_AWS_COGNITO_CLIENT_ID": JSON.stringify(
    process.env.VITE_AGQL_FE_AWS_COGNITO_CLIENT_ID,
  ),
  "import.meta.env.VITE_AGQL_FE_APP_GRAPHQL_API_PROD": JSON.stringify(
    process.env.VITE_AGQL_FE_APP_GRAPHQL_API_PROD,
  ),
};
