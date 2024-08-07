import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticateToken } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";

const router = Router()

router.post('/',
    body('password').notEmpty().withMessage('The password is required'),
    handleInputErrors,
    AdminController.login
)

router.get('/verify-token', authenticateToken, AdminController.verifyExpToken)

export default router