import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Configuration MSW pour le navigateur
export const worker = setupWorker(...handlers);
