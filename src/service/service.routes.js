import { Router } from "express";
import { createService, getServices, getServiceById, getServiceByName, editService, deleteService } from "./service.controller.js";
import { createServiceValidator, editServiceValidator, deleteteServiceValidator } from "../middlewares/service-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Endpoints para la gestión de servicios
 */

/**
 * @swagger
 * /casaMiaManagement/v1/services/createService:
 *   post:
 *     summary: Crear un servicio
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio
 *               description:
 *                 type: string
 *                 description: Descripción del servicio
 *               price:
 *                 type: number
 *                 description: Precio del servicio
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/createService', createServiceValidator, createService);

/**
 * @swagger
 * /casaMiaManagement/v1/services:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get('/', getServices);

/**
 * @swagger
 * /casaMiaManagement/v1/services/getserviceId/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/getserviceId/:id', getServiceById);

/**
 * @swagger
 * /casaMiaManagement/v1/services/getserviceName/{name}:
 *   get:
 *     summary: Obtener un servicio por nombre
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del servicio
 *     responses:
 *       200:
 *         description: Servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/getserviceName/:name', getServiceByName);

/**
 * @swagger
 * /casaMiaManagement/v1/services/editservice/{id}:
 *   put:
 *     summary: Editar un servicio
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio
 *               description:
 *                 type: string
 *                 description: Descripción del servicio
 *               price:
 *                 type: number
 *                 description: Precio del servicio
 *     responses:
 *       200:
 *         description: Servicio editado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/editservice/:id', editServiceValidator, editService);

/**
 * @swagger
 * /casaMiaManagement/v1/services/deleteservice/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/deleteservice/:id', deleteteServiceValidator, deleteService);

export default router;