import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

export const invoiceValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE", "USER_ROLE"),
    param("reservationId").notEmpty().withMessage("El reservationId no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const invoiceAdminsValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("reservationId").notEmpty().withMessage("El reservationId no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const invoiceListHotelValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("hotelId").notEmpty().withMessage("El hotelId no es válido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const invoiceListUserValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];