import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db.config";

interface LoginPayloadType {
  name: string;
  email: string;
  oauth_id: string;
  provider: string;
  image: string;
}

export const login = async (req: Request, res: Response) => {
    try {
      const body: LoginPayloadType = req.body;
      let findUser = await prisma.user.findUnique({
        where: {
            email: body.email
        }
      });

      if (!findUser) {
        findUser = await prisma.user.create({
          data: body,
        });
      }

      let JWTPayload = {
        name: body.name,
        email: body.email,
        id: findUser.id,
      };

      const token = jwt.sign(JWTPayload, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });

      return res.json({
        message: "Logged in successfully!",
        user: {
          ...findUser,
          token: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again!" });
    }
};
