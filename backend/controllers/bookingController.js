const Booking = require('../models/booking');

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = {
    getBookings
};
