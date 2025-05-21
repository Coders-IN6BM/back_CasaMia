import Hotel from '../hotel/hotel.model.js';
import Event from './event.model.js';

export const createEvent = async (req, res) => {
  try {
    const { hotelId, nombre, descripcion, fecha, servicios } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const newEvent = new Event({ nombre, descripcion, fecha, servicios, hotel: hotelId });
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { hotelId, eventId } = req.params;
    const updates = req.body;

    const event = await Event.findOne({ _id: eventId, hotel: hotelId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found in this hotel' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });
    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { hotelId, eventId } = req.params;

    const event = await Event.findOne({ _id: eventId, hotel: hotelId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found in this hotel' });
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

export const getEventsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const events = await Event.find({ hotel: hotelId }).populate('servicios');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};
