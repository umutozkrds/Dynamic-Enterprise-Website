import { pool } from "../config/db.js";


export const loginUserService = async (email: string, password: string) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(query, [email]);

  if ((rows as any[]).length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = (rows as any[])[0];

  const isPasswordValid = password === user.password;

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
};

