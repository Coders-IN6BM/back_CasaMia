import { Router } from "express";
import {generateInvoicePDF, generateInvoiceAdmin, ListInvoicesByHotelId, InvoicesByUserId, InvoicesForHotelAdmin, UserInvoicesForHotelAdmin} from "./invoice.controller.js";
import { invoiceValidator, invoiceAdminsValidator, invoiceListHotelValidator, invoiceListUserValidator } from "../middlewares/invoice-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Endpoints para la gestión de facturas
 */

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/generate/{reservationId}:
 *   get:
 *     summary: Generar una factura en formato PDF para una reservación
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Factura generada exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la solicitud
 */
router.get('/generate/:reservationId', invoiceValidator, generateInvoicePDF);

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/generateAdmin/{reservationId}:
 *   get:
 *     summary: Generar una factura como administrador para una reservación
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Factura generada exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la solicitud
 */
router.get('/generateAdmin/:reservationId', invoiceAdminsValidator, generateInvoiceAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/hotel/{hotelId}:
 *   get:
 *     summary: Listar facturas por ID de hotel
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   invoiceId:
 *                     type: string
 *                   reservationId:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Error en la solicitud
 */
router.get('/hotel/:hotelId', invoiceListHotelValidator, ListInvoicesByHotelId);

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/user/{userId}:
 *   get:
 *     summary: Listar facturas por ID de usuario
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   invoiceId:
 *                     type: string
 *                   reservationId:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Error en la solicitud
 */
router.get('/user/:userId', invoiceListUserValidator, InvoicesByUserId);

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/hotelAdmin/{hotelId}:
 *   get:
 *     summary: Listar facturas de un hotel como administrador
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   invoiceId:
 *                     type: string
 *                   reservationId:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Error en la solicitud
 */
router.get('/hotelAdmin/:hotelId', invoiceListHotelValidator, InvoicesForHotelAdmin);

/**
 * @swagger
 * /casaMiaManagement/v1/invoice/userHotelAdmin/{userUid}:
 *   get:
 *     summary: Listar facturas de un usuario en hoteles administrados
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: userUid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   invoiceId:
 *                     type: string
 *                   reservationId:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Error en la solicitud
 */
router.get('/userHotelAdmin/:userUid', invoiceListUserValidator, UserInvoicesForHotelAdmin);

export default router;