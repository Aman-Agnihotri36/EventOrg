'use client'

import { IEvent } from '@/lib/database/models/event.model'

import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";


import Script from 'next/script'
import { CreateOrder } from '@/lib/actions/order.actions';
import { RazorpayOptions } from '@/types';


declare global {
    interface Window {
        Razorpay: (options: RazorpayOptions) => {
            open: () => void;
            close: () => void;
            on: (event: string, callback: () => void) => void;
        };
    }

}

function CheckOut({ event, userId, userName, EventExist }: { event: IEvent, userId: string, userName: string, EventExist: number }) {


    const router = useRouter();

    const AMOUNT = Number(event.price) || 0;


    const handleFreeEvent = () => {
        const detail = {
            buyerId: userId,
            eventId: event._id,
            razorPayId: 'Free',
            money: 'Free',
            createdAt: new Date()
        }

        CreateOrder(detail)

        router.push('/profile')
    }

    const handlePayment = async () => {


        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: AMOUNT })
            })
            const data = await response.json()


            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: AMOUNT * 100,
                currency: 'INR',
                name: event.title,
                description: 'Test Transaction',
                order_id: data.orderId,
                handler: function () {



                    const detail = {
                        buyerId: userId,
                        eventId: event._id,
                        razorPayId: data.order.id,
                        money: data.order.amount,
                        createdAt: new Date(data.order.created_at * 1000)
                    }

                    CreateOrder(detail)

                    toast.success("Ticket Purchesed Successfully")




                    router.push('/profile')
                },

                prefill: {
                    name: userName,
                    email: 'johndoe@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3399cc'
                },


            }

            const rzp1 = window.Razorpay(options)
            rzp1.open();
        }
        catch (error) {
            console.log('PAYMENT FAILED', error)
        }
    }

    let hidden = undefined

    if (userId == event.organizer?._id) {
        hidden = true
    }



    return (

        <div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {
                EventExist == 1 ? (
                    <Button disabled>
                        Already Buyed
                    </Button>
                ) : (
                    <Button className={`${hidden ? 'hidden' : ''}`} onClick={event.isFree ? handleFreeEvent : handlePayment}>
                        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
                    </Button>
                )
            }

        </div>

    )
}

export default CheckOut
