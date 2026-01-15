import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/AuthMiddleware";
import * as ChatGroupController from "../controllers/ChatGroupController";

import * as ChatsController from "../controllers/ChatsController";
import * as JoinController from "../controllers/JoinController";

const router = Router();



// Auth
router.post("/auth/login", AuthController.login);

// Chat Group Routes
router.get("/chat-group", authMiddleware, ChatGroupController.index);
router.get("/chat-group/:id",authMiddleware, ChatGroupController.show); // Protected in old code? grep showed NO authMiddleware for show.
router.post("/chat-group", authMiddleware, ChatGroupController.store);
router.put("/chat-group/:id", authMiddleware, ChatGroupController.update);
router.delete("/chat-group/:id", authMiddleware, ChatGroupController.destroy);

// Chats Messages - PROTECTED
router.get("/chats/:groupId", authMiddleware, ChatsController.index);

// Join Route - PROTECTED (Must be logged in to join)
router.post("/chat-group/join", authMiddleware, JoinController.joinGroup); 




export default router;
