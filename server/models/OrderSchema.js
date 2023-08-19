import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    hotelInfo: {
        hotelId: {
            type: mongoose.Schema.ObjectId,
            ref: "Hotel", 
            required: true,
        },
        roomInfo: [{
            roomName: {
                type: String,
                required: true,
            },
            roomNumber: {
                type: [Number],
                required: true,
            },
            roomPrice: {
                type: Number,
                required: true,
            }
        }],
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        }
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    dates: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        }
    }
}, {
    timestamps: true,
})

export default mongoose.model("Order", OrderSchema);