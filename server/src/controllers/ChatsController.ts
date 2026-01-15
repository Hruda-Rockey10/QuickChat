import { Request, Response } from "express";
import prisma from "../config/db.config";

export const index = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        if (!groupId) return res.status(400).json({ message: "Group ID is required" });

        const chats = await prisma.chats.findMany({
            where: {
                group_id: groupId as string
            },
            orderBy: {
                created_at: "asc" 
            }
        });

        return res.json({ data: chats });
        
    } catch (error) {
            return res.status(500).json({ message: "Something went wrong" });
    }
};
