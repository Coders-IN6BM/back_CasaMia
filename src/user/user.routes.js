import { Router } from "express";
import { deleteUser, deleteUserAdmin, editProfile, editUserAdmin, updateProfilePicture, updatePassword, getUsers } from "./user.controller.js";
import { deleteUserValidator, deleteUserAdminValidator, updateUserValidator, updateUserAdminValidator, updateProfilePictureValidator, updatePasswordValidator, getUserAdminValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.delete("/delete/admin", deleteUserAdminValidator, deleteUserAdmin);

router.put("/editProfile", updateUserValidator, editProfile);

router.put("/editUsers", updateUserAdminValidator, editUserAdmin);

router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture);

router.put("/updatePassword", updatePasswordValidator, updatePassword);

router.post("/getUsers", getUserAdminValidator, getUsers);

export default router;