import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginUserService } from "../services/userServices.js";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await loginUserService(email, password);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      userId: user.id,
      expiresIn: 3600,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: "Invalid email or password" });
  }
};
