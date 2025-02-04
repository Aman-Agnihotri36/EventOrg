'use server'


import { revalidatePath } from 'next/cache'
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from '../../types'

import Category from '../database/models/category.model'
import Event from '../database/models/event.model'
import User from '../database/models/user.model'
import { handleError } from '../utils'

import { MongoDbConnect } from '../database'
import Order from '../database/models/order.model'
import { getClerkUser } from './user.actions'


const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
}


const populateEvent = async (query: any) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName email' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}



export const createEvent = async ({ event, userId }: CreateEventParams) => {
    try {
        await MongoDbConnect()


        const organizer = await User.findOne({ clerkId: userId }).select('_id');


        if (!organizer) {
            throw new Error('Organizer not found')
        }

        const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: organizer._id })

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}
export const getEventById = async (eventId: string) => {
    try {
        await MongoDbConnect()

        const event = await populateEvent(Event.findById(eventId))

        console.log(event)

        if (!event) {
            throw new Error('Event not found')
        }



        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)
    }
}


export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
        await MongoDbConnect()

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
            $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }

        const skipAmount = (Number(page) - 1) * limit
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {
        await MongoDbConnect()

        const deletedEvent = await Event.findByIdAndDelete(eventId)
        if (deletedEvent) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
        await MongoDbConnect()

        userId = await getClerkUser(userId)


        const eventToUpdate = await Event.findById(event._id)

        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        handleError(error)
    }
}

export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await MongoDbConnect()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
        await MongoDbConnect()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

export const getPurchasedEventsByUser = async (userId: string) => {

    try {

        const orders = await Order.find({ buyer: userId })


        const eventIds = orders.map(order => order.event);

        const purchasedEvents = await Event.find({ _id: { $in: eventIds } })
        console.log(purchasedEvents)

        return purchasedEvents
    } catch (error) {
        handleError(error)
    }
}