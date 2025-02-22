'use client'

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { Button } from '../ui/button';
import Link from 'next/link';
import CheckOut from './CheckOut';
import { useEffect, useState } from 'react';
import { getClerkUser, getUser } from '@/lib/actions/user.actions';





function CheckoutButton({ event, EventExist }: { event: IEvent, EventExist: number }) {

    const { user } = useUser()
    const [currentUser, setcurrentUser] = useState<string>('')
    const [userName, setuserName] = useState<string>('')

    // Get user ID
    const userId = user?.id as string;



    useEffect(() => {
        const fetchUser = async () => {
            const User = await getClerkUser(userId);
            setcurrentUser(User);
            const user = await getUser(User)
            setuserName(user._firstName)
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const hasEventFinished = new Date(event.endDateTime) < new Date()
    return (
        <div className="flex items-center gap-3">
            {hasEventFinished ? (
                <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
            ) : (
                <>
                    <SignedOut>
                        <Button asChild className="button rounded-full" size="lg">
                            <Link href="/sign-in">
                                Get Tickets
                            </Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <CheckOut event={event} userId={currentUser} userName={userName} EventExist={EventExist} />
                    </SignedIn>
                </>
            )}
        </div>
    )
}

export default CheckoutButton
