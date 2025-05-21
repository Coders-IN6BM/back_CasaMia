import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"


export const reservationValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE", "USER_ROLE"),
    body("roomId").notEmpty().withMessage("El roomId no es válido"),
    body("dateEntry").notEmpty().withMessage("El dateEntry es requerido"),
    body("departureDate").notEmpty().withMessage("La departureDate es requerido"),
    body("cardNumber").notEmpty().withMessage("El cardNumber es requerido"),
    body("CVV").notEmpty().withMessage("El CVV es requerido"),
    body("expired").notEmpty().withMessage("El expired es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const cancelReservationValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE", "USER_ROLE"),
    param("reservationId").notEmpty().withMessage("El reservationId no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const UserReservationValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE", "USER_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const AdminReservationValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    param("identifier").notEmpty().withMessage("El identifier no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const ManagerReservationValidator = [
    validateJWT, 
    hasRoles("HOTEL_ADMIN_ROLE", "ADMIN_ROLE"),
    param("identifier").notEmpty().withMessage("El identifier no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

