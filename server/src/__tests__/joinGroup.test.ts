import { joinGroup } from "../controllers/JoinController";
import prisma from "../config/db.config";
import { Request, Response } from "express";

// 1. Mock the Prisma Client
jest.mock("../config/db.config", () => ({
  __esModule: true,
  default: {
    chatGroup: {
      findUnique: jest.fn(),
    },
    groupUsers: {
      create: jest.fn(),
    },
  },
}));

describe("JoinController - joinGroup", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        // Setup Route Mocks
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRes = {
            status: statusMock,
            json: jsonMock,
        };
        mockReq = {
            body: {
                group_id: "123",
                passcode: "secret123",
                name: "John Doe"
            }
        };
    });

    it("should return 404 if group does not exist", async () => {
        // Mock DB returning NULL (Group not found)
        (prisma.chatGroup.findUnique as jest.Mock).mockResolvedValue(null);

        await joinGroup(mockReq as Request, mockRes as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Group not found" });
    });

    it("should return 401 if passcode is incorrect", async () => {
        // Mock DB returning a group with DIFFERENT passcode
        (prisma.chatGroup.findUnique as jest.Mock).mockResolvedValue({
            id: "123",
            passcode: "real_password"
        });

        await joinGroup(mockReq as Request, mockRes as Response);

        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Incorrect Passcode" });
    });

    it("should return 200 and add user if successful", async () => {
        // Mock DB Success
        (prisma.chatGroup.findUnique as jest.Mock).mockResolvedValue({
            id: "123",
            passcode: "secret123" // Matches req.body
        });
        (prisma.groupUsers.create as jest.Mock).mockResolvedValue({
            id: 1,
            name: "John Doe",
            group_id: "123"
        });

        await joinGroup(mockReq as Request, mockRes as Response);

        expect(prisma.groupUsers.create).toHaveBeenCalled(); // Ensure DB write happened
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
             message: "Joined successfully" 
        }));
    });
});
