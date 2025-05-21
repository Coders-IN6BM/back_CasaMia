import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints para la autenticación de usuarios
 */

/**
 * @swagger
 * /casaMiaManagement/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario (opcional)
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/register", uploadProfilePicture.single("profilePicture"), registerValidator, register);

/**
 * @swagger
 * /casaMiaManagement/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Error en la solicitud
 */
router.post("/login", loginValidator, login);

export default router;