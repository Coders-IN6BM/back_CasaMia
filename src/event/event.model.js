import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const eventoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "Event name is required"]
    },
    descripcion: {
        type: String,
        required: [true, "Description is required"]
    },
    fecha: {
        type: Date,
        required: [true, "Event date is required"]
    },
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],

    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVO', 'CANCELADO'],
        default: 'ACTIVO'
    }
}, {
    versionKey: false,
    timestamps: true
});

export default models.Event || model("Event", eventoSchema);
