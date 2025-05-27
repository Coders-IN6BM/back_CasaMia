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
                message: "User not found",
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
            message: "Error fetching users",
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
                message: "Token not provided",
            });
        }
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "You must provide the current and new password",
            });
        }
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isCurrentPasswordValid = await verify(user.password, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "The current password is incorrect",
            });
        }
        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "The new password cannot be the same as the old one",
            });
        }
        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password successfully updated",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error updating password",
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
                msg: "Token not provided",
            });
        }
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const newProfilePicture = req.file ? req.file.filename : null;

        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                msg: "No new profile picture provided",
            });
        }
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }
        if (user.profilePicture) {
            const oldProfilePicturePath = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture);
            try {
                await fs.unlink(oldProfilePicturePath);
            } catch (error) {
                console.warn("Could not delete previous profile picture, it may not exist.");
            }
        }
        user.profilePicture = newProfilePicture;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Profile picture updated",
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Error updating profile picture",
            error: err.message,
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { password, photo, role, ...updates } = req.body; 

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error updating user", error: error.message });
    }
};

export const editUserAdmin = async (req, res) => {
    try {
        const { uid, username, ...updates } = req.body;
        if (!uid && !username) {
            return res.status(400).json({
                success: false,
                message: "You must provide an ID or username to find the user."
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
                message: "User not found"
            });
        }
        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "You cannot modify a user with ADMIN_ROLE"
            });
        }
        if (updates.newUsername) {
            const existingUser = await User.findOne({ username: updates.newUsername });

            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "The new username is already taken"
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
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User updated successfully",
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
                message: 'You must provide an ID or a username'
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
                message: 'User not found'
            });
        }
        if (user.role === 'ADMIN_ROLE' ) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete an administrator user'
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
            message: 'User and their reservations successfully deleted'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user and related data',
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
                message: 'Token not provided'
            });
        }

        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
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
            message: 'User, their reservations and freed rooms deleted successfully'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user and related data',
            error: err.message
        });
    }
};



