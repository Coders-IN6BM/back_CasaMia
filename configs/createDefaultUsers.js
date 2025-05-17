import { hash } from "argon2";
import User from "../src/user/user.model.js";

export const createDefaultUsers = async () => {
    try {
        const adminExist = await User.findOne({ role: "ADMIN_ROLE" });
        if (!adminExist) {
            await User.create({
                name: "Emilio",
                surname: "Lux",
                username: "KernelAdmin",
                email: "admin@example.com",
                password: await hash("Admin123#"),
                profilePicture: null,
                phone: "12345678",
                role: "ADMIN_ROLE",
                status: true
            });
            console.log("Default ADMIN user created.");
        } else {
            console.log("ADMIN user already exists.");
        }

        const hotelAdminExist = await User.findOne({ role: "HOTEL_ADMIN_ROLE" });
        if (!hotelAdminExist) {
            await User.create({
                name: "Laura",
                surname: "Hernández",
                username: "HotelQueen",
                email: "hoteladmin@example.com",
                password: await hash("Hotel456#"),
                profilePicture: null,
                phone: "87654321",
                role: "HOTEL_ADMIN_ROLE",
                status: true
            });
            console.log("Default HOTEL ADMIN user created.");
        } else {
            console.log("HOTEL ADMIN user already exists.");
        }

        const userExist = await User.findOne({ role: "USER_ROLE" });
        if (!userExist) {
            await User.create({
                name: "Carlos",
                surname: "Ramírez",
                username: "carlitos123",
                email: "user@example.com",
                password: await hash("User789#"),
                profilePicture: null,
                phone: "11223344",
                role: "USER_ROLE",
                status: true
            });
            console.log("Default USER created.");
        } else {
            console.log("Regular USER already exists.");
        }

    } catch (err) {
        console.error("Error creating default users:", err.message);
    }
};
