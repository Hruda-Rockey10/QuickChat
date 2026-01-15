import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../types";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = user as AuthUser;
        next();
    } catch (error) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
    }
};

export default authMiddleware;
