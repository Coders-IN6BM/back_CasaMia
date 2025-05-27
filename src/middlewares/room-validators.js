import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"


export const registerValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body("hotelId").notEmpty().withMessage("El hotelId no es válido"),
    body("tipo").notEmpty().withMessage("El tipo es requerido"),
    body("capacidad").notEmpty().withMessage("La capacidad es requerido"),
    body("precio").notEmpty().withMessage("El precio es requerido"),
    body("numeroCuarto").notEmpty().withMessage("El numeroCuarto es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const RoomAdminValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];


export const updateRoomValidator = [
    validateJWT, 
    hasRoles("HOTEL_ADMIN_ROLE", "ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const searchRoomValidator = [
    validarCampos,
    deleteFileOnError,
    handleErrors
];
