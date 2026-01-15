import { Request, Response } from "express";
import prisma from "../config/db.config";

export const index = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const groups = await prisma.chatGroup.findMany({
            select: {
                id: true,
                title: true,
                user_id: true,
                created_at: true,
            },
            orderBy: {
                created_at: "desc"
            }
        });
        return res.json({
            message: "Chat groups fetched successfully", 
            data: groups
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID is required" });

        const group = await prisma.chatGroup.findUnique({
            where: {
                id: id as string
            },
            select: {
                id: true,
                title: true,
                user_id: true,
                created_at: true,
                // Passcode excluded!
            }
        });
        
        if (!group) return res.status(404).json({ message: "Chat group not found" });

        return res.json({
            message: "Chat group fetched successfully", 
            data: group
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const store = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        if (!body.title || !body.passcode) {
                return res.status(400).json({ message: "Title and Passcode are required" });
        }

        const group = await prisma.chatGroup.create({
            data: {
                title: body.title,
                passcode: body.passcode,
                user_id: user.id
            }
        });

        return res.status(201).json({
            message: "Chat group created successfully",
            data: group
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const { id } = req.params;
        
        const group = await prisma.chatGroup.update({
            where: { id: id as string },
            data: {
                title: body.title,
                passcode: body.passcode,
            }
        });

        return res.json({
            message: "Chat group updated successfully", 
            data: group
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.chatGroup.delete({
            where: { id: id as string }
        });
        return res.json({ message: "Chat group deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
