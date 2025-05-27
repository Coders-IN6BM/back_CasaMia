'use strict'

import Service from "./service.model.js";

export const createService = async (req, res) =>{
    try{
        const data = req.body;

        const service = new Service(data);
        await service.save();

        res.status(201).json({
            sucess: true,
            msg: "Service created successfully",
            service
        });

    }catch (error){
        res.status(500).json({
            success: false,
            msg: "Error creating service",
            error: error.message
        });
    }   
};

export const getServices = async (req, res) =>{
    try{
        const services = await Service.find({status: true});
        res.status(200).json(services);
    }catch (error){
        res.status(500).json({error: "Error to find it"});
    }
};

export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service || !service.status) {
            return res.status(404).json({ error: "Cannot find to service" });
        }

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: "Error to find service" });
    }
};

export const getServiceByName = async (req, res) => {
    try {
        const { name } = req.params;
        const service = await Service.findOne({ name: name });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service fetched successfully",
            service
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching service",
            error: error.message
        });
    }
};

export const editService = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ...rest } = req.body; 

        const updatedService = await Service.findByIdAndUpdate(
            id, rest, { new: true } 
        );

        if (!updatedService) {
            return res.status(404).json({ error: "Cannot find service" });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ error: "Error to update service" });
    }
};


export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting service" });
    }
};