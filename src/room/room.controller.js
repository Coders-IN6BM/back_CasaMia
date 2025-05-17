import Hotel from '../hotel/hotel.model.js';
import Room from './room.model.js';
import Reservation from '../reservation/reservation.model.js';
import jwt from 'jsonwebtoken';

export const AllRoomsByHotel = async (req, res) => {
  try {
    const { idHotel, hotelName } = req.body;
    let hotel;

    if (idHotel) {
      hotel = await Hotel.findOne({ _id: idHotel, status: true });
    } else if (hotelName) {
      hotel = await Hotel.findOne({ name: { $regex: hotelName, $options: 'i' }, status: true });
    } else {
      return res.status(400).json({ message: 'Hotel ID or name is required' });
    }

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const rooms = await Room.find({ hotel: hotel._id });

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found for this hotel.' });
    }

    return res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving hotel rooms', error: error.message });
  }
};

export const registerRoom = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const data = req.body;

    const hotelExists = await Hotel.findById(hotelId);
    if (!hotelExists) {
      return res.status(404).json({
        message: `No hotel found with ID: ${hotelId}`
      });
    }
    const roomExists = await Room.findOne({ numeroCuarto: data.numeroCuarto, hotel: hotelId });
    if (roomExists) {
      return res.status(400).json({
        message: `A room with number ${data.numeroCuarto} already exists in this hotel`
      });
    }
    data.hotel = hotelId;
    const room = await Room.create(data);

    return res.status(201).json({
      message: "Room successfully registered",
      room
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering the room",
      error: err.message
    });
  }
};

export const deleteAdminRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: `No room found with ID: ${roomId}`
      });
    }

    const reservations = await Reservation.find({ room: roomId, state: 'activa' });

    let affectedReservations = 0;

    for (const reservation of reservations) {
      const { dateEntry, departureDate } = reservation;

      const conflictingReservations = await Reservation.find({
        room: { $ne: roomId },
        state: 'activa',
        $or: [
          {
            dateEntry: { $lt: departureDate },
            departureDate: { $gt: dateEntry }
          }
        ]
      }).distinct('room');

      const replacementRoom = await Room.findOne({
        _id: { $nin: [...conflictingReservations, roomId] }, 
        tipo: room.tipo,
        hotel: room.hotel,
        status: 'DISPONIBLE'
      });

      if (replacementRoom) {
        reservation.room = replacementRoom._id;
        await reservation.save();
      } else {
        reservation.state = 'cancelada';
        await reservation.save();
      }

      affectedReservations++;
    }

    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      message: `Room deleted successfully. Affected reservations: ${affectedReservations}`
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting the room",
      error: err.message
    });
  }
};

export const updateRoomAdmin = async (req, res) => {
  try {
    const { roomId } = req.params;
    const updates = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: `No room found with ID: ${roomId}`
      });
    }
    if (
      updates.numeroCuarto &&
      String(updates.numeroCuarto) !== String(room.numeroCuarto)
    ) {
      const roomExists = await Room.findOne({
        hotel: room.hotel,
        numeroCuarto: updates.numeroCuarto,
        _id: { $ne: roomId }
      });

      if (roomExists) {
        return res.status(400).json({
          message: `A room with number ${updates.numeroCuarto} already exists in this hotel`
        });
      }
    }

    Object.keys(updates).forEach(key => {
      room[key] = updates[key];
    });

    await room.save();

    return res.status(200).json({
      message: "Room successfully updated",
      updatedRoom: room
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating the room",
      error: err.message
    });
  }
};

export const createRoomManager = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token not provided" });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
    const { hotelId } = req.body;
    const data = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    if (hotel.admin.toString() !== uid) {
      return res.status(403).json({ message: "Not authorized to create rooms in this hotel" });
    }

    const roomExists = await Room.findOne({ hotel: hotelId, numeroCuarto: data.numeroCuarto });
    if (roomExists) {
      return res.status(400).json({ message: "A room with that number already exists in this hotel" });
    }

    const newRoom = await Room.create({ ...data, hotel: hotelId });
    return res.status(201).json({ message: "Room successfully registered", room: newRoom });
  } catch (err) {
    return res.status(500).json({ message: "Error registering room", error: err.message });
  }
};

export const deleteRoomManager = async (req, res) => {
  try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Token not provided" });

      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { roomId } = req.params;

      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: "Room not found" });

      const hotel = await Hotel.findById(room.hotel);
      if (!hotel || hotel.admin.toString() !== uid) {
          return res.status(403).json({ message: "Not authorized to delete this room" });
      }

      const reservations = await Reservation.find({ room: roomId, state: 'activa' });

      for (const reservation of reservations) {
          const conflictingReservations = await Reservation.find({
              room: { $ne: roomId },
              state: 'activa',
              dateEntry: { $lt: reservation.departureDate },
              departureDate: { $gt: reservation.dateEntry }
          });
          const busyRoomIds = conflictingReservations.map(r => r.room.toString());
          const replacementRoom = await Room.findOne({
              _id: { $nin: busyRoomIds.concat([roomId]) },
              tipo: room.tipo,
              hotel: room.hotel,
              status: 'DISPONIBLE'
          });

          if (replacementRoom) {
              reservation.room = replacementRoom._id;
              await reservation.save();
          } else {
              reservation.state = 'cancelada';
              await reservation.save();
          }
      }

      await Room.findByIdAndDelete(roomId);
      return res.status(200).json({
          message: `Room successfully removed. Reservations affected.: ${reservations.length}`
      });
  } catch (err) {
      return res.status(500).json({
          message: "Error deleting the room",
          error: err.message
      });
  }
};

export const updateRoomManager = async (req, res) => {
  try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Token not provided" });

      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { roomId } = req.params;
      const updates = req.body;

      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: "Room not found" });

      const hotel = await Hotel.findById(room.hotel);
      if (!hotel || hotel.admin.toString() !== uid) {
          return res.status(403).json({ message: "Not authorized to modify this room" });
      }
      if (updates.numeroCuarto && updates.numeroCuarto !== room.numeroCuarto) {
          const existingRoom = await Room.findOne({
              _id: { $ne: roomId },
              hotel: room.hotel,
              numeroCuarto: updates.numeroCuarto
          });
          if (existingRoom) {
              return res.status(400).json({ message: "There is already a room with that number in the hotel." });
          }
      }

      const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, { new: true });
      return res.status(200).json({ message: "Successfully updated room", room: updatedRoom });
  } catch (err) {
      return res.status(500).json({
          message: "Error updating room",
          error: err.message
      });
  }
};
