import { body, param } from "express-validator";
import { emailExist, usernameExist, userExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js"
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js"
import {validateJWT} from "./validate-jwt.js"
import { hasRoles } from "../middlewares/validate-roles.js"


export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExist),
    body("username").custom(usernameExist),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("Username es en formáto erróneo"),
    body("password").isLength({ min: 4 }).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos,
    handleErrors
]

export const deleteUserValidator = [
    validateJWT, 
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const deleteUserAdminValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const updateUserValidator = [
    validateJWT, 
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const updateUserAdminValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const updateProfilePictureValidator = [
    validateJWT, 
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const updatePasswordValidator = [
    validateJWT, 
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body("currentPassword").notEmpty().withMessage("La vieja contraseña es requerida"),
    body("newPassword").notEmpty().withMessage("La nueva contraseña es requerida"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const getUserAdminValidator = [
    validateJWT, 
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];
