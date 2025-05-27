import { Router } from "express";
import { searchHotel, deleteHotel, searchHotelsAdmin, updateHotel, registerHotel, obtenerEstadisticasHotel, obtenerEstadisticasPorHotelId } from "./hotel.controller.js";
import { searchHotelValidator, registerHotelValidator, updateHotelValidator, searchHotelManagerValidator, delteHotelValidator, estadisticasHotelValidator, estadisticasHotelAdminValidator } from "../middlewares/hotel-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Endpoints para la gestión de hoteles
 */

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/searchHotel:
 *   get:
 *     summary: Buscar hoteles
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del hotel
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Dirección del hotel
 *       - in: query
 *         name: qualification
 *         schema:
 *           type: string
 *         description: Calificación del hotel
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría del hotel
 *     responses:
 *       200:
 *         description: Lista de hoteles encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   qualification:
 *                     type: string
 *                   category:
 *                     type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get("/searchHotel", searchHotelValidator, searchHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/searchHotelsAdmin:
 *   get:
 *     summary: Buscar hoteles administrados por un usuario
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: Lista de hoteles administrados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   qualification:
 *                     type: string
 *                   category:
 *                     type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get("/searchHotelsAdmin", searchHotelManagerValidator, searchHotelsAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/registerHotel:
 *   post:
 *     summary: Registrar un hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del hotel
 *               address:
 *                 type: string
 *                 description: Dirección del hotel
 *               qualification:
 *                 type: string
 *                 description: Calificación del hotel
 *               category:
 *                 type: string
 *                 description: Categoría del hotel
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de amenidades
 *               admin:
 *                 type: string
 *                 description: ID del administrador del hotel
 *     responses:
 *       201:
 *         description: Hotel registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/registerHotel", registerHotelValidator, registerHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/updateHotel/{id}:
 *   put:
 *     summary: Actualizar un hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del hotel
 *               address:
 *                 type: string
 *                 description: Dirección del hotel
 *               qualification:
 *                 type: string
 *                 description: Calificación del hotel
 *               category:
 *                 type: string
 *                 description: Categoría del hotel
 *     responses:
 *       200:
 *         description: Hotel actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put("/updateHotel/:id", updateHotelValidator, updateHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/deleteHotel/{id}:
 *   delete:
 *     summary: Eliminar un hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a eliminar
 *     responses:
 *       200:
 *         description: Hotel eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete("/deleteHotel/:id", delteHotelValidator, deleteHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/statisticsManager:
 *   get:
 *     summary: Obtener estadísticas de hoteles administrados
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalHotels:
 *                   type: number
 *                 averageQualification:
 *                   type: number
 *       400:
 *         description: Error en la solicitud
 */
router.get('/statisticsManager', estadisticasHotelValidator, obtenerEstadisticasHotel);

/**
 * @swagger
 * /casaMiaManagement/v1/hotel/statisticsHotel/{id}:
 *   get:
 *     summary: Obtener estadísticas de un hotel por ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Estadísticas del hotel obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRooms:
 *                   type: number
 *                 occupiedRooms:
 *                   type: number
 *                 availableRooms:
 *                   type: number
 *       400:
 *         description: Error en la solicitud
 */
router.get('/statisticsHotel/:id', estadisticasHotelAdminValidator, obtenerEstadisticasPorHotelId);

export default router;