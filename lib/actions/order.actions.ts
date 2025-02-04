'use server'

import mongoose from "mongoose";

import Order from "../database/models/order.model";
import { handleError } from "../utils";
import { MongoDbConnect } from "../database";




const populateOrder = async (orders: any[]) => {
    return await Promise.all(
        orders.map(order =>
            Order.findById(order._id)
                .populate({ path: 'buyer', select: '_id firstName lastName email' })

        )
    );
};


type OrderDetails = {
    buyerId: string;
    eventId: string;
    razorPayId: any;
    money: any;
    createdAt: Date;

}

export const CreateOrder = async (detail: OrderDetails) => {


    try {
        await MongoDbConnect()


        const order = await Order.create({
            createdAt: new Date(detail.createdAt),
            razorpayId: detail.razorPayId,
            totalAmount: detail.money.toString(), // Convert to string if needed
            event: new mongoose.Types.ObjectId(detail.eventId), // Ensure ObjectId
            buyer: new mongoose.Types.ObjectId(detail.buyerId) // Ensure ObjectId
        });

    } catch (error) {
        handleError(error)
    }


}

export const getOrderByEvent = async (eventId: string) => {
    try {
        await MongoDbConnect()

        const query = await Order.find({ event: eventId })
        const order = await populateOrder(query)



        if (!order) {
            throw new Error('Unable to Get Order')
        }
        return {
            data: JSON.parse(JSON.stringify(order))
        }
    } catch (error) {
        handleError(error)
    }



}