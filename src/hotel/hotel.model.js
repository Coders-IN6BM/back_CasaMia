import { Schema, model } from "mongoose";

const hotelSchema = new Schema({
    name: {
        type: String,
        required: [true, "The hotel name is required"]
    },
    address: {
        type: String,
        required: [true, "Address is mandatory"]
    },
    qualification: {
        type: String,
        required: true,
        enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'],
        default: '3 estrellas',
        required: [true, "Qualification is required"]
    },
    category: {
        type: String,
        required: true,
        enum: ['Económico', 'Estandar', 'Boutique', 'Lujoso'],
        default: 'Estandar',
        required: [true, "Category is required"]
    },
    amenities: {
        type: [String], 
        default: []
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('Hotel', hotelSchema);