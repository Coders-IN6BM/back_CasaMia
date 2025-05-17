import Service from "../src/service/service.model.js";

export const createDefaultServices = async () => {
    try {
        const defaultServices = [
            {
                name: "Professional Photography",
                description: "Event photography coverage by wedding photographers"
            },
            {
                name: "Breakfast Included",
                description: "Enjoy complimentary breakfast every morning during your stay."
            },
            {
                name: "Airport Shuttle",
                description: "Transportation service from and to the airport available upon request."
            }
        ];

        for (const serviceData of defaultServices) {
            const exists = await Service.findOne({ name: serviceData.name });
            if (!exists) {
                await Service.create(serviceData);
                console.log(`Service "${serviceData.name}" created.`);
            } else {
                console.log(`Service "${serviceData.name}" already exists.`);
            }
        }

    } catch (err) {
        console.error("Error creating default services:", err.message);
    }
};
