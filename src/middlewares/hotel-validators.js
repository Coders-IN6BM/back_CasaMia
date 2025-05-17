import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

export const registerHotelValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("address").notEmpty().withMessage("La direccion es requerido"),
    body("qualification").notEmpty().withMessage("La capacidad es requerido"),
    body("category").notEmpty().withMessage("La categoria es requerido"),
    body("amenities").notEmpty().withMessage("Las comodidades son requeridas"),
    body("admin").notEmpty().withMessage("El encargado es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const updateHotelValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("id").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const searchHotelManagerValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const delteHotelValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("id").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const estadisticasHotelValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const estadisticasHotelAdminValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const searchHotelValidator = [
    validarCampos,
    deleteFileOnError,
    handleErrors
];

