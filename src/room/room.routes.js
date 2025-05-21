import { Router } from "express";
import { AllRoomsByHotel, registerRoom, deleteAdminRoom, updateRoomAdmin, createRoomManager, deleteRoomManager, updateRoomManager } from "./room.controller.js";
import { searchRoomValidator,registerValidator, RoomAdminValidator,updateRoomValidator } from "../middlewares/room-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Endpoints para la gestión de habitaciones
 */

/**
 * @swagger
 * /casaMiaManagement/v1/room/available/{idHotel}:
 *   get:
 *     summary: Obtener habitaciones disponibles por hotel
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: idHotel
 *         required: false
 *         schema:
 *           type: string
 *         description: ID del hotel (opcional)
 *     responses:
 *       200:
 *         description: Lista de habitaciones disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tipo:
 *                     type: string
 *                   capacidad:
 *                     type: number
 *                   precio:
 *                     type: number
 *                   numeroCuarto:
 *                     type: number
 *       400:
 *         description: Error en la solicitud
 */
router.get("/available/:idHotel?", searchRoomValidator, AllRoomsByHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/room/registerAdmin:
 *   post:
 *     summary: Registrar una habitación como administrador
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación (simple, doble, suite, familiar, lujo)
 *               capacidad:
 *                 type: number
 *                 description: Capacidad de la habitación
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación
 *               hotelId:
 *                 type: string
 *                 description: ID del hotel
 *               numeroCuarto:
 *                 type: number
 *                 description: Número de la habitación
 *     responses:
 *       201:
 *         description: Habitación registrada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/registerAdmin', RoomAdminValidator, registerRoom);

/**
 * @swagger
 * /casaMiaManagement/v1/room/admin/{roomId}:
 *   delete:
 *     summary: Eliminar una habitación como administrador
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Habitación eliminada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/admin/:roomId', RoomAdminValidator, deleteAdminRoom);

/**
 * @swagger
 * /casaMiaManagement/v1/room/adminUpdate/{roomId}:
 *   put:
 *     summary: Actualizar una habitación como administrador
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación
 *               capacidad:
 *                 type: number
 *                 description: Capacidad de la habitación
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación
 *               numeroCuarto:
 *                 type: number
 *                 description: Número de la habitación
 *     responses:
 *       200:
 *         description: Habitación actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/adminUpdate/:roomId', RoomAdminValidator, updateRoomAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/room/registerManager:
 *   post:
 *     summary: Registrar una habitación como gerente
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación
 *               capacidad:
 *                 type: number
 *                 description: Capacidad de la habitación
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación
 *               hotelId:
 *                 type: string
 *                 description: ID del hotel
 *               numeroCuarto:
 *                 type: number
 *                 description: Número de la habitación
 *     responses:
 *       201:
 *         description: Habitación registrada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/registerManager', registerValidator, createRoomManager);

/**
 * @swagger
 * /casaMiaManagement/v1/room/manager/{roomId}:
 *   delete:
 *     summary: Eliminar una habitación como gerente
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Habitación eliminada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/manager/:roomId', updateRoomValidator, deleteRoomManager);

/**
 * @swagger
 * /casaMiaManagement/v1/room/managerUpdate/{roomId}:
 *   put:
 *     summary: Actualizar una habitación como gerente
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación
 *               capacidad:
 *                 type: number
 *                 description: Capacidad de la habitación
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación
 *               numeroCuarto:
 *                 type: number
 *                 description: Número de la habitación
 *     responses:
 *       200:
 *         description: Habitación actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/managerUpdate/:roomId', updateRoomValidator, updateRoomManager);

export default router;