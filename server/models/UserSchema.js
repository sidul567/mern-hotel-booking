import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},{timestamps: true})

export default mongoose.model("User", UserSchema);