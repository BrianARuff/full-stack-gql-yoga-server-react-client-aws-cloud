import { devViteConfig } from "./vite.dev.config";
import { prodViteConfig } from "./vite.prod.config";

export default process.env.AGQL_BE_NODE_ENV === "production"
  ? prodViteConfig
  : devViteConfig;
