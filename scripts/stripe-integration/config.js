import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;

export const STRIPE_PRIVATE_KEY = process.env.STRIPE_KEY;