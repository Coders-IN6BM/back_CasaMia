import Hotel from '../hotel/hotel.model.js';
import ExtraService from './extraServices.model.js';
import { validationResult } from 'express-validator';      

export const createExtraService = async (req, res) => {
    const { hotelId } = req.params
    const { name, cost, description } = req.body

    try {
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) return res.status(404).json({ msg: 'Hotel not found' })

        const extraService = new ExtraService({ name, cost, description, hotel: hotelId })
        await extraService.save();

        res.status(201).json({ msg: 'Extra service created successfully', extraService })
    } catch (error) {
        res.status(500).json({ msg: 'Error creating extra service' })
    }
}

export const updateExtraService = async (req, res) => {
    const { hotelId, extraServiceId } = req.params
    const { name, cost, description } = req.body

    try {
        const extraService = await ExtraService.findOneAndUpdate(
            { _id: extraServiceId, hotel: hotelId },
            { name, cost, description },
            { new: true }
        )

        if (!extraService) return res.status(404).json({ msg: 'Extra service not found' })

        res.status(200).json({ msg: 'Extra service updated', extraService })
    } catch (error) {
        res.status(500).json({ msg: 'Error updating extra service' })
    }
}

export const deleteExtraService = async (req, res) => {
    const { hotelId, extraServiceId } = req.params

    try {
        const extraService = await ExtraService.findOneAndDelete({ _id: extraServiceId, hotel: hotelId })

        if (!extraService) return res.status(404).json({ msg: 'Extra service not found' })

        res.status(200).json({ msg: 'Extra service deleted successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting extra service' })
    }
}

export const getExtraServicesByHotel = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const extraServices = await ExtraService.find({ hotel: hotelId });
        res.status(200).json(extraServices)
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving extra services' })
    }
}
