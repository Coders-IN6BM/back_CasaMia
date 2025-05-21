import { Router } from "express";
import { deleteUser, deleteUserAdmin, editProfile, editUserAdmin, updateProfilePicture, updatePassword, getUsers } from "./user.controller.js";
import { deleteUserValidator, deleteUserAdminValidator, updateUserValidator, updateUserAdminValidator, updateProfilePictureValidator, updatePasswordValidator, getUserAdminValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /casaMiaManagement/v1/user/delete/me:
 *   delete:
 *     summary: Eliminar mi cuenta
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.delete("/delete/me", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /casaMiaManagement/v1/user/delete/admin:
 *   delete:
 *     summary: Eliminar un usuario como administrador
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.delete("/delete/admin", deleteUserAdminValidator, deleteUserAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/user/editProfile:
 *   put:
 *     summary: Editar mi perfil
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/editProfile", updateUserValidator, editProfile);

/**
 * @swagger
 * /casaMiaManagement/v1/user/editUsers:
 *   put:
 *     summary: Editar un usuario como administrador
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               role:
 *                 type: string
 *                 description: Rol del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/editUsers", updateUserAdminValidator, editUserAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/user/updateProfilePicture:
 *   patch:
 *     summary: Actualizar foto de perfil
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture);

/**
 * @swagger
 * /casaMiaManagement/v1/user/updatePassword:
 *   put:
 *     summary: Actualizar contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Contraseña actual
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/updatePassword", updatePasswordValidator, updatePassword);

/**
 * @swagger
 * /casaMiaManagement/v1/user/getUsers:
 *   post:
 *     summary: Obtener usuarios
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: string
 *                 description: Filtro opcional para buscar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */
router.post("/getUsers", getUserAdminValidator, getUsers);

export default router;