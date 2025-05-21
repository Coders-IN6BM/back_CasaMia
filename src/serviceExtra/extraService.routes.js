import { Router } from "express"
import { createExtraService, updateExtraService, deleteExtraService, getExtraServicesByHotel } from "./extraServices.controller.js"
import { createExtraServiceValidator, updateExtraServiceValidator, deleteExtraServiceValidator} from "../middlewares/extraService-validators.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Extra Services
 *   description: Endpoints para la gestión de servicios extra
 */

/**
 * @swagger
 * /casaMiaManagement/v1/extraServices/addExtraService/{hotelId}:
 *   post:
 *     summary: Agregar un servicio extra a un hotel
 *     tags: [Extra Services]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio extra
 *               price:
 *                 type: number
 *                 description: Precio del servicio extra
 *     responses:
 *       201:
 *         description: Servicio extra agregado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/addExtraService/:hotelId', createExtraServiceValidator, createExtraService);

/**
 * @swagger
 * /casaMiaManagement/v1/extraServices/updateExtraService/{hotelId}/{extraServiceId}:
 *   put:
 *     summary: Actualizar un servicio extra
 *     tags: [Extra Services]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *       - in: path
 *         name: extraServiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio extra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio extra
 *               price:
 *                 type: number
 *                 description: Precio del servicio extra
 *     responses:
 *       200:
 *         description: Servicio extra actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/updateExtraService/:hotelId/:extraServiceId', updateExtraServiceValidator, updateExtraService);

/**
 * @swagger
 * /casaMiaManagement/v1/extraServices/DeleteExtraService/{hotelId}/{extraServiceId}:
 *   delete:
 *     summary: Eliminar un servicio extra
 *     tags: [Extra Services]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *       - in: path
 *         name: extraServiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio extra
 *     responses:
 *       200:
 *         description: Servicio extra eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/DeleteExtraService/:hotelId/:extraServiceId', deleteExtraServiceValidator, deleteExtraService);

/**
 * @swagger
 * /casaMiaManagement/v1/extraServices/list/{hotelId}:
 *   get:
 *     summary: Obtener servicios extra de un hotel
 *     tags: [Extra Services]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Lista de servicios extra obtenida exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.get('/list/:hotelId', getExtraServicesByHotel);

export default router;