import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    description: {
        type: String,
        required: [true, "Service description is mandatory"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Service", serviceSchema); 