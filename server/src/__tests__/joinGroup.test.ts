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
            status: statusMock,  // We're saying: "The 'status' property should contain statusMock"
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
        // It calls prisma.chatGroup.findUnique()
        // Our mock returns null
        // The function sees null and thinks "group doesn't exist"
        // It calls res.status(404).json({ message: "Group not found" })

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Group not found" });
    });

    it("should return 401 if passcode is incorrect", async () => {
        // Mock DB returning a group with DIFFERENT passcode
        (prisma.chatGroup.findUnique as jest.Mock).mockResolvedValue({
            id: "123",
            passcode: "real_password"
        });
        // What happens here: The mock function prisma.chatGroup.findUnique is told:
        // "When someone calls you, return this object: { id: "123", passcode: "real_password" }"

        await joinGroup(mockReq as Request, mockRes as Response);
        // It calls prisma.chatGroup.findUnique()
        // Our mock returns { id: "123", passcode: "real_password" }
        // The function sees { id: "123", passcode: "real_password" } and thinks "passcode doesn't match"
        // It calls res.status(401).json({ message: "Incorrect Passcode" })

        // Call Stack:
        // └── joinGroup(mockReq, mockRes)
        //     ├── mockReq.body = { group_id: "123", passcode: "secret123", name: "John Doe" }
        //     └── mockRes = { status: statusMock, json: jsonMock }

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

    afterAll(async () => {
        // Clean up to prevent Jest warnings
        jest.clearAllMocks();
    });
});
