import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent, getEventsByHotel } from './event.controller.js';
import { createEventValidator, editDeleteEventValidator, DeleteEventValidator } from '../middlewares/event-validators.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints para la gestión de eventos
 */

/**
 * @swagger
 * /casaMiaManagement/v1/event/create:
 *   post:
 *     summary: Crear un evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del evento
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha del evento
 *               hotelId:
 *                 type: string
 *                 description: ID del hotel donde se realizará el evento
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/create', createEventValidator, createEvent);

/**
 * @swagger
 * /casaMiaManagement/v1/event/edit/{hotelId}/{eventId}:
 *   put:
 *     summary: Editar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel donde se encuentra el evento
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del evento
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha del evento
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/edit/:hotelId/:eventId', editDeleteEventValidator, updateEvent);

/**
 * @swagger
 * /casaMiaManagement/v1/event/delete/{hotelId}/{eventId}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel donde se encuentra el evento
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/delete/:hotelId/:eventId', DeleteEventValidator, deleteEvent);

/**
 * @swagger
 * /casaMiaManagement/v1/event/hotel/{hotelId}:
 *   get:
 *     summary: Obtener eventos por hotel
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   hotelId:
 *                     type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get('/hotel/:hotelId', getEventsByHotel);

export default router;