import { Request, Response } from "express";
import prisma from "../config/db.config";

export const joinGroup = async (req: Request, res: Response) => {
    try {
        const { group_id, passcode, name } = req.body;
        const group = await prisma.chatGroup.findUnique({
            where: { id: group_id }
        });

        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.passcode !== passcode) {
            return res.status(401).json({ message: "Incorrect Passcode" });
        }

        // Add user to group
        const user = await prisma.groupUsers.create({
            data: {
                group_id: group_id,
                name: name
            }
        });

        return res.json({ message: "Joined successfully", data: user });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
