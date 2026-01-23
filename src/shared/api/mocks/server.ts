import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Configuration MSW pour Node.js (tests)
export const server = setupServer(...handlers);
