import CheckoutButton from '@/components/shared/CheckoutButton'
import Collection from '@/components/shared/Collection'
import { getEventById, getPurchasedEventsByUser, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { getClerkUser } from '@/lib/actions/user.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import React from 'react'


async function EventDetails({ params: { id }, searchParams }: SearchParamProps) {



    const { sessionClaims } = await auth()
    let userId = sessionClaims?.sub as string;
    userId = await getClerkUser(userId)

    const event = await getEventById(id)
    const eventObj = JSON.parse(JSON.stringify(event))
    const values = await searchParams



    const PurchasedEvents = await getPurchasedEventsByUser(userId)


    const EventExist = PurchasedEvents?.find((one) => one._id == event._id)
    let alter = 0
    if (EventExist) {
        alter = 1
    }




    const relatedEvents = await getRelatedEventsByCategory({
        categoryId: event.category._id,
        eventId: event._id,
        page: values?.page as string
    })
    return (

        <>
            <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>

                <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
                    <Image src={event.imageUrl} alt='hero image' width={550} height={600} className='h-full max-h-[510px] rounded-sm mt-9 p-5 object-contain   md:object-fill mx-auto ' />

                    <div className='flex w-full flex-col gap-8 pl-7  md:p-10 md:pr-7'>
                        <div className='flex felx-col gap-6'>
                            <h2 className='md:h2-bold font-bold text-[30px]'>{event.title}</h2>

                            <div className='flex flex-col gap-3 pr-5 sm:flex-row sm:items-center'>
                                <div className='flex gap-3'>
                                    <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>{event.isFree ? 'FREE' : `${event.price}`}</p>
                                    <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-gray-500 '>{event.category.name}</p>
                                </div>

                                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>by <span className='text-primary-500'>{event.organizer.firstName} {event.organizer.lastName}</span></p>
                            </div>

                        </div>

                        <CheckoutButton event={eventObj} EventExist={alter} />

                        <div className='flex flex-col gap-4'>
                            <div className='flex gap-2 md:gap-3'>
                                <Image src='/assets/icons/calendar.svg' alt='calendar' width={32} height={32} />
                                <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center gap-1'>
                                    <p>{formatDateTime(event.startDateTime).dateOnly} - {formatDateTime(event.startDateTime).timeOnly} to</p>

                                    <p>{formatDateTime(event.endDateTime).dateOnly} - {formatDateTime(event.endDateTime).timeOnly}</p>

                                </div>
                            </div>
                            <div className='p-regular-20 flex items-center  gap-3'>
                                <Image src='/assets/icons/location.svg' alt='location ' width={32} height={32} />

                                <p className='p-medium-16 lg:p-regular-20'>{event.location}</p>

                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='p-bold-20 text-gray-600 '>What You Will Learn:</p>
                            <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
                            <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>{event.url}</p>
                        </div>
                    </div>
                </div>

            </section>

            <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
                <h2 className='h2-bold'>Related Events</h2>
                <Collection data={relatedEvents?.data} emptyTitle='No Events Found' emptyStateSubtext='Come back later' collectionType='All_Events' limit={3} page={1} totalPages={relatedEvents?.totalPages} />
            </section>

        </>
    )
}

export default EventDetails
