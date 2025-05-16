import { body, param} from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

export const createEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body("hotelId").notEmpty().withMessage("El hotel es requerido"),
    body("nombre").notEmpty().withMessage("El nombre es requerido"),
    body("descripcion").notEmpty().withMessage("La descripcion es requerida"),
    body("fecha").notEmpty().withMessage("La fecha es requerida"),
    body("servicios").isArray().withMessage("Los servicios son requeridos"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const editDeleteEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("hotelId").notEmpty().withMessage("El hotel es requerido"),
    param("eventId").notEmpty().withMessage("El evento es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const DeleteEventValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("hotelId").notEmpty().withMessage("El hotel es requerido"),
    param("eventId").notEmpty().withMessage("El evento es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]

export const getEventsByHotelValidator = [
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("hotelId").notEmpty().withMessage("El hotel es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]
