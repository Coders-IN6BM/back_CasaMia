import { Router } from "express";
import { reserveRoom, cancelReservation, MyReservations, ReservationAdmin,UserReservationsAdminHotel } from "./reservation.controller.js";
import { reservationValidator, cancelReservationValidator, UserReservationValidator, ManagerReservationValidator, AdminReservationValidator } from "../middlewares/reservation-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Endpoints para la gestión de reservaciones
 */

/**
 * @swagger
 * /casaMiaManagement/v1/reservation/Reserve:
 *   post:
 *     summary: Reservar una habitación
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: ID de la habitación a reservar
 *               dateEntry:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrada
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de salida
 *               cardNumber:
 *                 type: string
 *                 description: Número de tarjeta de crédito
 *               CVV:
 *                 type: string
 *                 description: Código CVV de la tarjeta
 *               expired:
 *                 type: string
 *                 format: date
 *                 description: Fecha de expiración de la tarjeta
 *               extraServices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de servicios extra (opcional)
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/Reserve', reservationValidator, reserveRoom);

/**
 * @swagger
 * /casaMiaManagement/v1/reservation/Cancel/{reservationId}:
 *   put:
 *     summary: Cancelar una reservación
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación a cancelar
 *     responses:
 *       200:
 *         description: Reservación cancelada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/Cancel/:reservationId', cancelReservationValidator, cancelReservation);

/**
 * @swagger
 * /casaMiaManagement/v1/reservation/my-reservations:
 *   get:
 *     summary: Obtener mis reservaciones
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room:
 *                     type: object
 *                     properties:
 *                       numeroCuarto:
 *                         type: number
 *                       hotel:
 *                         type: string
 *                   dateEntry:
 *                     type: string
 *                     format: date
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                   state:
 *                     type: string
 *                   extraServices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         _id:
 *                           type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get('/my-reservations', UserReservationValidator, MyReservations);

/**
 * @swagger
 * /casaMiaManagement/v1/reservation/user-reservations/{identifier}:
 *   get:
 *     summary: Obtener reservaciones de un usuario por ID o nombre
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID o nombre del usuario
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room:
 *                     type: object
 *                     properties:
 *                       numeroCuarto:
 *                         type: number
 *                       hotel:
 *                         type: string
 *                   dateEntry:
 *                     type: string
 *                     format: date
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                   state:
 *                     type: string
 *                   extraServices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         _id:
 *                           type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get('/user-reservations/:identifier', AdminReservationValidator, ReservationAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/reservation/admin/hotel-reservations/{identifier}:
 *   get:
 *     summary: Obtener reservaciones de un usuario en hoteles administrados
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID o nombre del usuario
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room:
 *                     type: object
 *                     properties:
 *                       numeroCuarto:
 *                         type: number
 *                       hotel:
 *                         type: string
 *                   dateEntry:
 *                     type: string
 *                     format: date
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                   state:
 *                     type: string
 *                   extraServices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         _id:
 *                           type: string
 *       400:
 *         description: Error en la solicitud
 */
router.get('/admin/hotel-reservations/:identifier', ManagerReservationValidator, UserReservationsAdminHotel);

export default router;