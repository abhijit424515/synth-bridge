import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Retrieving the API keys from the
export const MLE_DOMAIN = process.env.MLE_DOMAIN;
export const HTTP_PORT = process.env.HTTP_PORT;
export const SOCKET_PORT = process.env.SOCKET_PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const GEN_SALT_ROUNDS = parseInt(process.env.GEN_SALT_ROUNDS);
export const ZOHO_MAIL = process.env.ZOHO_MAIL;
export const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
export const OTP_EXPIRY = process.env.OTP_EXPIRY;
export const REDIS = process.env.REDIS;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
