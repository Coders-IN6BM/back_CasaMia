import { Schema, model} from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    surname:{
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Surname cannot exceed 25 characters"]
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },

    profilePicture:{
        type: String
    },
        
    phone:{
        type: String,
        minLength: 8,
        required: true
    },

    role:{
        type: String,
        required: true,
        enum: ['USER_ROLE', 'ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'],
        default:'USER_ROLE'

    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})

userSchema.methods.toJSON = function(){
    const {password, _id, ...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)