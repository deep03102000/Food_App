import mongoose from "mongoose";
import { Document } from "mongoose";
type DeliveryDetails = {
    email: string,
    name: string,
    address: string,
    city: string,
    contact: Number
}

type CartItems = {
    menuId: string,
    name: string,
    image: string,
    price: Number,
    quantity: Number
}

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId,
    restaurant: mongoose.Schema.Types.ObjectId,
    deliveryDetails: DeliveryDetails,
    cartItems: CartItems[],
    totalAmount:number,
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"
}
const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    deliveryDetails: {
        email:{
            type:String,
            required: true
        },
        name:{
            type:String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        city:{
            type:String,
            required: true
        },
        contact:{
            type:Number,
            required: true
        }
    },
    cartItems: [
        {
            menuId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    status: {
        type: String,
        enum: ["pending" , "confirmed" , "preparing" , "outfordelivery" , "delivered"],
        required: true
    }
},{
    timestamps: true,
})

export const Order = mongoose.model("Order", orderSchema)

