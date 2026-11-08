import { celebrate } from "celebrate";
import { Router } from "express";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/authValidation.js";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPassword,
} from "../controllers/authController.js";

const router = new Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/refresh", refreshUserSession);
router.post("/auth/logout", logoutUser);
router.post("/auth/request-reset-email", requestResetEmail);
router.post("/auth/reset-password", resetPassword);

export default router;
