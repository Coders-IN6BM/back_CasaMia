import User from "../user/user.model.js";

export const emailExist = async (email = "") => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error(`The email ${email} is already registered`);
    }
};

export const usernameExist = async (username = "") => {
    const exists = await User.findOne({ username });
    if (exists) {
        throw new Error(`The username ${username} is already registered`);
    }
};

export const userExists = async (uid = "") => {
    const exists = await User.findById(uid);
    if (!exists) {
        throw new Error("The provided user ID does not exist");
    }
};
