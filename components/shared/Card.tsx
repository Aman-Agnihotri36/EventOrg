import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { getClerkUser } from '@/lib/actions/user.actions'

type CardProps = {
    event: IEvent,
    hasOrderLink?: boolean,
    hidePrice?: boolean
}

async function Card({ event, hasOrderLink, hidePrice }: CardProps) {

    const { sessionClaims } = await auth()
    let userId = sessionClaims?.sub as string;
    userId = await getClerkUser(userId)

    const isEventCreator = userId === event?.organizer?._id.toString()
    return (
        <div className='group relative flex max-h-[300px] w-full max-w-[330px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[350px]'>

            <Link href={`/events/${event._id}`} style={{ backgroundImage: `url(${event.imageUrl})` }} className="flex-center bg-gray-50 bg-contain bg-center text-gray-500 w-[100%] h-52" />

            {isEventCreator && !hidePrice && (
                <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
                    <Link href={`/events/${event._id}/update`}>
                        <Image src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
                    </Link>

                    <DeleteConfirmation eventId={event._id} />
                </div>
            )}

            <div className='pl-6 pt-3'>
                {!hidePrice && <div className='flex gap-2 '>
                    <span className='  text-[14px] w-min rounded-full bg-green-100 px-4 py-1 text-green-60'>
                        {event.isFree ? 'FREE' : `$${event.price}`}
                    </span>

                    <p className='text-[14px] w-min rounded-full bg-gray-500/10 px-4 py-1 text-grey-500 line-clamp-1 '>
                        {event?.category?.name}
                    </p>
                </div>}

                <p className='p-medium-16 pt-2 p-medium-18 text-green-500'>
                    {formatDateTime(event.startDateTime).dateTime}
                </p>

                <Link href={`/events/${event._id}`}>
                    <p className='p-medium-16 md:p-medium-20 pt-1 line-clamp-2 flex-1 text-black'>{event.title}</p>
                </Link>



                <div className='flex-between w-full'>
                    <p className='p-medium-14 md:p-medium-16 pt-1 text-grey-600 '>
                        {event.organizer?.firstName} {event.organizer?.lastName}
                    </p>

                    {hasOrderLink && (
                        <Link href={`/orders?eventId=${event._id}`} className='flex gap-2'>
                            <p className='text-primary-500'>Order Details</p>
                            <Image src='/assets/icons/arrow.svg' alt='search' width={10} height={10} />
                        </Link>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Card
