import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import jwt from "jsonwebtoken";
import ExtraService from "../serviceExtra/extraServices.model.js";
import User from "../user/user.model.js";
import Hotel from "../hotel/hotel.model.js";

export const reserveRoom = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { roomId, dateEntry, departureDate, cardNumber, CVV, expired, extraServices } = req.body;
  
      const expiredDate = new Date(expired); 
      if (isNaN(expiredDate)) {
        return res.status(400).json({ message: 'Invalid expiration date' });
      }
  
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: 'Room not found' });
  
      if (room.status === 'OCUPADA') {
        const existingReservations = await Reservation.find({
          room: roomId,
          state: 'activa',
          $or: [
            { dateEntry: { $lt: departureDate }, departureDate: { $gt: dateEntry } },
            { dateEntry: { $gte: dateEntry }, departureDate: { $lte: departureDate } }
          ]
        });
  
        if (existingReservations.length > 0) {
          return res.status(400).json({ message: 'The room is already reserved for the selected dates' });
        }
      }
  
      if (extraServices && extraServices.length > 0) {
        const validExtraServices = await ExtraService.find({
          _id: { $in: extraServices },
          hotel: room.hotel
        });
  
        if (validExtraServices.length !== extraServices.length) {
          return res.status(400).json({ message: 'Some extra services do not belong to the room’s hotel.' });
        }
      }
  
      const newReservation = new Reservation({
        user: uid,   
        room: roomId,
        dateEntry,
        departureDate,
        cardNumber,
        CVV,
        expired: expiredDate, 
        extraServices  
      });
  
      await newReservation.save();
  
      room.status = 'OCUPADA';  
      await room.save();
  
      return res.status(201).json({
        message: 'Reservation completed successfully',
        reservation: newReservation
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error making reservation', error: err.message });
    }
  };

  export const cancelReservation = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
      }
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { reservationId } = req.params;
  
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      if (reservation.user.toString() !== uid) {
        return res.status(403).json({ message: "You are not authorized to cancel this reservation" });
      }
  
      if (reservation.state !== "activa") {
        return res.status(400).json({ message: "Only active reservations can be canceled" });
      }
  
      reservation.state = "cancelada";
      await reservation.save();
  
      const hoy = new Date();

      const reservacionesQueSolapan = await Reservation.find({
        room: reservation.room,
        _id: { $ne: reservationId },
        state: "activa",
        dateEntry: { $lt: reservation.departureDate },
        departureDate: { $gt: hoy } 
      });
      
      if (reservacionesQueSolapan.length === 0) {
        await Room.findByIdAndUpdate(reservation.room, { status: "DISPONIBLE" });
      }
      
  
      return res.status(200).json({ message: "Reservation canceled successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error canceling reservation",
        error: err.message
      });
    }
  };

  export const MyReservations = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Token not provided" });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const reservations = await Reservation.find({ user: uid, state: "activa" })
        .populate("extraServices", "name _id")
        .populate("room", "numeroCuarto hotel");
  
      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ message: "Error retrieving reservations", error: err.message });
    }
  };
  

export const ReservationAdmin = async (req, res) => {
  try {
    const { identifier } = req.params; 

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const reservations = await Reservation.find({ user: user._id })
      .populate("extraServices", "name _id")
      .populate("room", "numeroCuarto hotel");

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving reservations", error: err.message });
  }
};


export const UserReservationsAdminHotel = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token not provided" });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
    const { identifier } = req.params;

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const hotelesAdmin = await Hotel.find({ admin: uid }).select("_id");

    const hotelIds = hotelesAdmin.map(h => h._id.toString());

    const reservations = await Reservation.find({ user: user._id })
      .populate({
        path: "room",
        match: { hotel: { $in: hotelIds } },
        select: "numeroCuarto hotel"
      })
      .populate("extraServices", "name _id");

    const filteredReservations = reservations.filter(r => r.room !== null);

    res.json({ reservations: filteredReservations });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving reservations", error: err.message });
  }
};

