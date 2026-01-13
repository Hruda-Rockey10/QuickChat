import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";  

const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1];

    //Verify the token
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        req.user = user as AuthUser;
    })

    next();
}

export default authMiddleware