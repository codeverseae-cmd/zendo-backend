import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validation";
import { adminLoginSchema } from "../validation/auth.validation";

const router = Router();

router.post("/login", validateRequest(adminLoginSchema), asyncHandler(adminLogin));

export { router as authRouter};
