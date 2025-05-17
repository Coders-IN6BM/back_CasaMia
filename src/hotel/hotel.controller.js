import jwt from 'jsonwebtoken';
import Hotel from '../hotel/hotel.model.js';
import Room from '../room/room.model.js';
import Reservation from '../reservation/reservation.model.js';
import Invoice from '../invoice/invoice.model.js';

export const searchHotel = async (req, res) => {
    try {
      const { name, address, qualification, category } = req.body;
  
      let searchCriteria = {};
  
      if (name) {
        searchCriteria.name = { $regex: name, $options: 'i' }; 
      }
      if (address) {
        searchCriteria.address = { $regex: address, $options: 'i' };
      }
      if (qualification) {
        searchCriteria.qualification = qualification; 
      }
      if (category) {
        searchCriteria.category = category; 
      }
  
      const hotels = await Hotel.find(searchCriteria);
  
      if (hotels.length === 0) {
        return res.status(404).json({ message: 'No hotels found with the given criteria' });
      }
  
      res.json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error searching for hotels' });
    }
  };


export const registerHotel = async (req, res) => {
  try {
    const { name, address, qualification, category, amenities, admin } = req.body;

    if (!name || !address || !qualification || !category || !admin) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newHotel = new Hotel({
      name,
      address,
      qualification,
      category,
      amenities,
      admin
    });

    await newHotel.save();

    res.status(201).json({ message: 'Hotel registered successfully', hotel: newHotel });
  } catch (error) {
    console.error('Error registering the hotel:', error);
    res.status(500).json({ message: 'Error registering the hotel', error: error.message });
  }
};

  export const updateHotel = async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
  
      const hotel = await Hotel.findById(id);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  
      Object.assign(hotel, updateFields);
  
      await hotel.save();
  
      res.json({ message: 'Hotel updated successfully', hotel });
    } catch (error) {
      console.error('Error updating the hotel:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  export const searchHotelsAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid } = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETORPRIVATEKEY);
  
      const hoteles = await Hotel.find({ admin: uid, status: true });
  
      if (!hoteles.length) {
        return res.status(404).json({ message: 'No hotels found for this admin' });
      }
  
      res.json({ hoteles });
  
    } catch (error) {
      console.error('Error searching admin hotels:', error);
      res.status(500).json({ message: 'Error fetching hotels', error: error.message });
    }
  };

  export const deleteHotel = async (req, res) => {
    try {
      const { id } = req.params;
  
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      const habitaciones = await Room.find({ hotel: id });
  
      for (const habitacion of habitaciones) {
        await Reservation.updateMany(
          { room: habitacion._id },
          { state: 'cancelada' }
        );
  
        await Room.findByIdAndDelete(habitacion._id);
      }
  
      await Hotel.findByIdAndDelete(id);
  
      res.json({ message: 'Hotel deleted along with its rooms and cancelled reservations' });
  
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ message: 'Error deleting the hotel', error: error.message });
    }
  };

  export const obtenerEstadisticasHotel = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid: adminId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const hoteles = await Hotel.find({ admin: adminId });
      const estadisticas = [];
  
      for (const hotel of hoteles) {
        const habitaciones = await Room.find({ hotel: hotel._id });
        const habitacionesIds = habitaciones.map(h => h._id);
  
        const reservas = await Reservation.find({ room: { $in: habitacionesIds } }).populate('extraServices');
  
        const ingresos = await Invoice.aggregate([
          { $match: { reservation: { $in: reservas.map(r => r._id) } } },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { "_id": 1 } }
        ]);
  
        const ingresosMensuales = Array(12).fill(0);
        ingresos.forEach(i => {
          ingresosMensuales[i._id - 1] = i.total;
        });
  
        const servicioContador = {};
        reservas.forEach(reserva => {
          reserva.extraServices.forEach(servicio => {
            const nombre = servicio.name;
            servicioContador[nombre] = (servicioContador[nombre] || 0) + 1;
          });
        });
  
        const serviciosMasUsados = Object.entries(servicioContador)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
  
        estadisticas.push({
          hotelId: hotel._id,
          hotelNombre: hotel.name,
          totalHabitaciones: habitaciones.length,
          habitacionesOcupadas: reservas.filter(r => r.status === "confirmada").length,
          totalReservas: reservas.length,
          ingresosMensuales,
          serviciosMasUsados
        });
      }
  
      res.json({ estadisticas });
  
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  export const obtenerEstadisticasPorHotelId = async (req, res) => {
    try {
      const { id } = req.params;
  
      const hotel = await Hotel.findById(id).populate('admin', 'name surname email');
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  
      const habitaciones = await Room.find({ hotel: hotel._id });
      const habitacionesIds = habitaciones.map(h => h._id);
  
      const reservas = await Reservation.find({ room: { $in: habitacionesIds } }).populate('extraServices');
  
      const ingresos = await Invoice.aggregate([
        { $match: { reservation: { $in: reservas.map(r => r._id) } } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$total" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      const ingresosMensuales = Array(12).fill(0);
      ingresos.forEach(i => {
        ingresosMensuales[i._id - 1] = i.total;
      });
  
      const servicioContador = {};
      reservas.forEach(reserva => {
        reserva.extraServices.forEach(servicio => {
          const nombre = servicio.name;
          servicioContador[nombre] = (servicioContador[nombre] || 0) + 1;
        });
      });
  
      const serviciosMasUsados = Object.entries(servicioContador)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  
      const estadisticas = {
        hotelId: hotel._id,
        hotelNombre: hotel.name,
        encargadoNombre: `${hotel.admin.name} ${hotel.admin.surname}`,
        encargadoEmail: hotel.admin.email,
        totalHabitaciones: habitaciones.length,
        habitacionesOcupadas: reservas.filter(r => r.status === "confirmada").length,
        totalReservas: reservas.length,
        ingresosMensuales,
        serviciosMasUsados
      };
  
      res.json({ estadisticas });
  
    } catch (error) {
      console.error("Error fetching statistics by hotel ID:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };