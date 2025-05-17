import { Schema, model } from "mongoose";

const habitacionSchema = Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['simple', 'doble', 'suite', 'familiar', 'lujo'],
        default: 'simple'
    },
    capacidad: {
        type: Number,
        required: true,
        min: [1, "Minimum capacity of 1 person"]
    },
    precio: {
        type: Number,
        required: true,
        min: [0, "The price cannot be negative"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    numeroCuarto: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['OCUPADA', 'DISPONIBLE'],
        default: 'DISPONIBLE',
    },
}, {
    versionKey: false,
    timestamps: true
});

export default model('Room', habitacionSchema);