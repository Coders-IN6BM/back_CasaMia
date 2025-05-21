import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import jwt from "jsonwebtoken";
import ExtraService from "../serviceExtra/extraServices.model.js";
import User from "../user/user.model.js";
import Hotel from "../hotel/hotel.model.js";

export const reserveRoom = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { roomId, dateEntry, departureDate, cardNumber, CVV, expired, extraServices } = req.body;
  
      const expiredDate = new Date(expired); 
      if (isNaN(expiredDate)) {
        return res.status(400).json({ message: 'Fecha de expiración inválida' });
      }
  
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
  
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
          return res.status(400).json({ message: 'La habitación ya está reservada para las fechas seleccionadas' });
        }
      }
  
      if (extraServices && extraServices.length > 0) {
        const validExtraServices = await ExtraService.find({
          _id: { $in: extraServices },
          hotel: room.hotel
        });
  
        if (validExtraServices.length !== extraServices.length) {
          return res.status(400).json({ message: 'Algunos servicios extra no pertenecen al hotel de la habitación.' });
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
        message: 'Reservación realizada correctamente',
        reservation: newReservation
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al realizar la reservación', error: err.message });
    }
  };

  export const cancelReservation = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { reservationId } = req.params;
  
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Reservación no encontrada" });
      }
  
      if (reservation.user.toString() !== uid) {
        return res.status(403).json({ message: "No estás autorizado para cancelar esta reservación" });
      }
  
      if (reservation.state !== "activa") {
        return res.status(400).json({ message: "Solo se pueden cancelar reservaciones activas" });
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
      
  
      return res.status(200).json({ message: "Reservación cancelada exitosamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error al cancelar la reservación",
        error: err.message
      });
    }
  };

  export const MyReservations = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Token no proporcionado" });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const reservations = await Reservation.find({ user: uid, state: "activa" })
        .populate("extraServices", "name _id")
        .populate("room", "numeroCuarto hotel");
  
      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ message: "Error al obtener las reservaciones", error: err.message });
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

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const reservations = await Reservation.find({ user: user._id })
      .populate("extraServices", "name _id")
      .populate("room", "numeroCuarto hotel");

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservaciones", error: err.message });
  }
};


export const UserReservationsAdminHotel = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
    const { identifier } = req.params;

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

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
    res.status(500).json({ message: "Error al obtener reservaciones", error: err.message });
  }
};

