import { Router } from "express";
import { AdminController } from "../controllers/AdminController";

const router = Router()

router.post('/', AdminController.login)

export default router