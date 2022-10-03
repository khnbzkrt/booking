import { Hotel } from "../models/Hotel.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body)

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel)
    } catch (error) {
        next(error)
    }
}

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedHotel)
    } catch (error) {
        next(error)
    }
}

export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json(true)
    } catch (error) {
        next(error)
    }
}

export const getHotelById = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel)
    } catch (error) {
        next(error)
    }
}

export const getAllHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query
    try {
        const hotels = await Hotel.find({ ...others, cheapestPrice: { $gt: min | 1, $lt: max || 999999999 } }).limit(req.query.limit);
        res.status(200).json(hotels)
    } catch (error) {
        next(error)
    }
}

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)
    } catch (error) {
        next(error)
    }
}

export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "Apartment" });
        const resortCount = await Hotel.countDocuments({ type: "Resort" });
        const villaCount = await Hotel.countDocuments({ type: "Villa" });
        const cabinCount = await Hotel.countDocuments({ type: "Cabin" });
        res.status(200).json([
            { type: "Hotels", count: hotelCount },
            { type: "Apartments", count: apartmentCount },
            { type: "Resorts", count: resortCount },
            { type: "Villas", count: villaCount },
            { type: "Cabins", count: cabinCount }
        ])
    } catch (error) {
        next(error)
    }
}