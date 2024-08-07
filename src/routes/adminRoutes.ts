import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticateToken } from "../middleware/auth";

const router = Router()

router.post('/', AdminController.login)
router.get('/verify-token', authenticateToken, AdminController.verifyExpToken)

export default router