import { Schema, model } from "mongoose";

const extraServicesSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    description: {
        type: String,
        required: [true, "Service description is mandatory"]
    },
    cost: {
        type: Number,
        required: [true, "The cost of the service is mandatory"],
        min: [0, "The cost cannot be negative"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, "Hotel reference is required"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("extraServices", extraServicesSchema);