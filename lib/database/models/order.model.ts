import { models } from "mongoose"
import { model } from "mongoose"
import { Schema } from "mongoose"

export interface IOrder extends Document {
    createdAt: Date
    razorpayId: string
    totalAmount: string
    event: {
        _id: string
        title: string
    }
    buyer: {
        _id: string
        firstName: string
        lastName: string
    }
}

export type IOrderItem = {
    _id: string;
    totalAmount: string;
    createdAt: Date;
    eventTitle: string;
    eventId: string;
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
    };
};


const OrderSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    razorpayId: {
        type: String,
        required: true,
        unique: true,
    },
    totalAmount: {
        type: String,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

const Order = models?.Order || model('Order', OrderSchema);
export default Order