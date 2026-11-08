import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";
import { updateUserAvatar } from "../controllers/userController.js";

const router = new Router();

router.patch(
  "/users/me/avatar",
  authenticate,
  upload.single("photo"),
  updateUserAvatar,
);

export default router;
