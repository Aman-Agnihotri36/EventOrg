import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_SECRET!,
    });
    console.log(process.env.RAZORPAY_KEY_ID)

    try {
        const body = await req.json()
        const amount = body.amount



        const order = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: 'order_rcptid_11',

        });





        return NextResponse.json({
            message: 'Payment successfull',
            order,
        }, { status: 200 })






    }
    catch (error) {

        return NextResponse.json({ message: 'Error creating Razorpay order', error }, { status: 500 });
    }
}
