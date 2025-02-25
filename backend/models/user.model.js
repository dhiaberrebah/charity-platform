import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    adress: {
        type: String,
        required: true,
    },
  
    telephone: {
        type: Number,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    cinphoto: {
        type: String,
        required: true,
    },
   
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;