import { Request, Response } from "express";

export const getCookie = (req: Request, res: Response) => {
  const userSession = req.cookies.userId;

  if (!userSession) {
    res.cookie("userId", "ooo", {
      httpOnly: true, // Protects against XSS attacks
      secure: true, // Ensures the cookie is sent over HTTPS only (use in production)
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: "none",
    });
  }
  res.send();
};
