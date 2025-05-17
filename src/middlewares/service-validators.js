import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"

export const createServiceValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body("name").notEmpty().withMessage("Service name is required"),
    body("description").notEmpty().withMessage("Description is required")
];

export const editServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body ("name").notEmpty()

]

export const deleteteServiceValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
]