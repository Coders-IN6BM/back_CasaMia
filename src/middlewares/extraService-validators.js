
import { check } from 'express-validator'
import { validarCampos } from './validar-campos.js'
import { validateJWT } from './validate-jwt.js'
import { hasRoles } from './validate-roles.js'

export const createExtraServiceValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('cost', 'El precio es obligatorio y debe ser un número').isNumeric(),
    validarCampos
]

export const updateExtraServiceValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('cost', 'El precio debe ser un número').optional().isNumeric(),
    validarCampos
]

export const deleteExtraServiceValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    validarCampos
]
