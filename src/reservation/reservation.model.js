import { Schema, model } from "mongoose";

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    dateEntry: {
        type: Date,
        required: [true, "The date of entry is mandatory"]
    },
    departureDate: {
        type: Date,
        required: [true, "The departure date is mandatory"]
    },
    state: {
        type: String,
        enum: ['activa', 'finalizada', 'cancelada'],
        default: 'activa',
    },
    extraServices: [{
        type: Schema.Types.ObjectId,
        ref: 'extraServices',
    }],
    cardNumber: {
        type: String,
        required: [true, "Card Number is required"],
        minLength: [16, "The card cannot be less than 16 characters."]
    },
    CVV: {
        type: String,
        required: [true, "Card Number is required"],
        minLength: [3, "The card cannot be less than 16 characters."]
    },
    expired: {
        type: Date,
        required: [true, "Expiration date is required"]
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Reservation", reservationSchema);