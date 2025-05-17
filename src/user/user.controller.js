import { hash, verify } from "argon2";
import User from "./user.model.js";
import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import Reservation from "../reservation/reservation.model.js";
import Room from "../room/room.model.js";


const __dirname = dirname(fileURLToPath(import.meta.url));  


export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const { username } = req.body;
        let query = { status: true };

        if (username) {
            query.username = username;
        }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        if (username && users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        });
    }
};



export const updatePassword = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
            });
        }
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Debes proporcionar la contraseña actual y la nueva contraseña",
            });
        }
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }
        const isCurrentPasswordValid = await verify(user.password, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta",
            });
        }
        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior",
            });
        }
        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada exitosamente",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña",
            error: err.message,
        });
    }
};


export const updateProfilePicture = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "Token no proporcionado",
            });
        }
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const newProfilePicture = req.file ? req.file.filename : null;

        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                msg: "No se proporcionó una nueva foto de perfil",
            });
        }
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }
        if (user.profilePicture) {
            const oldProfilePicturePath = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture);
            try {
                await fs.unlink(oldProfilePicturePath);
            } catch (error) {
                console.warn("No se pudo eliminar la imagen anterior, tal vez ya no existe.");
            }
        }
        user.profilePicture = newProfilePicture;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Foto de perfil actualizada",
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la foto de perfil",
            error: err.message,
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "Token no proporcionado" });
        }
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { password, photo, role, ...updates } = req.body; 

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No se proporcionaron campos para actualizar" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        return res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error al actualizar el usuario", error: error.message });
    }
};

export const editUserAdmin = async (req, res) => {
    try {
        const { uid, username, ...updates } = req.body;
        if (!uid && !username) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar un ID o un nombre de usuario para buscar al usuario."
            });
        }
        let user;
        if (uid) {
            user = await User.findById(uid);
        } else {
            user = await User.findOne({ username });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No se puede modificar a un usuario con rol ADMIN_ROLE"
            });
        }
        if (updates.newUsername) {
            const existingUser = await User.findOne({ username: updates.newUsername });

            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "El nuevo nombre de usuario ya está en uso"
                });
            }
            updates.username = updates.newUsername;
            delete updates.newUsername;
        }if (updates.password) {
            updates.password = await argon2.hash(updates.password);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });
        return res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el usuario",
            error: err.message
        });
    }
};

export const deleteUserAdmin = async (req, res) => {
    try {
        const { uid, username } = req.body;
        if (!uid && !username) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un ID o un nombre de usuario'
            });
        }
        let user;
        if (uid) {
            user = await User.findById(uid);
        } else if (username) {
            user = await User.findOne({ username });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        if (user.role === 'ADMIN_ROLE' ) {
            return res.status(403).json({
                success: false,
                message: 'No se puede eliminar a un usuario administrador'
            });
        }
        const reservas = await Reservation.find({ user: user._id });
        for (const reserva of reservas) {
            if (reserva.room) {
                await Room.findByIdAndUpdate(reserva.room, { status: 'DISPONIBLE' });
            }
            await Reservation.findByIdAndDelete(reserva._id);
        }
        await User.findByIdAndDelete(user._id);

        return res.status(200).json({
            success: true,
            message: 'Usuario y sus reservaciones eliminadas correctamente'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario y sus datos relacionados',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token'
            });
        }

        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const reservas = await Reservation.find({ user: userId });

        for (const reserva of reservas) {
            if (reserva.room) {
                await Room.findByIdAndUpdate(reserva.room, { status: 'DISPONIBLE' });
            }
            await Reservation.findByIdAndDelete(reserva._id);
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: 'Usuario, sus reservaciones y habitaciones liberadas correctamente'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario y sus datos relacionados',
            error: err.message
        });
    }
};



