import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASS || "";
const database = process.env.DB_NAME || "kurumsal";

if (!host || !user || !database) {
  throw new Error("Missing required database environment variables");
}

export const pool = mysql.createPool({
  host,
  user,
  password,
  database,
});
