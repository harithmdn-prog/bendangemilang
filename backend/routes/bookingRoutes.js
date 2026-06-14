const express = require('express');
const router = express.Router();
const { getBookings } = require('../controllers/bookingController');

const Bookings = require('../models/booking')

// Define a GET route for fetching all bookings
router.get('/', getBookings);
router.post('/', async (req, res) => {

    try {
        const booking = new Bookings(req.body)
        await booking.save()
        res.status(201).json(booking)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const deleted = await Bookings.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ message: 'Booking not found' })
        }
        res.json({ message: 'Booking deleted' })


    } catch (error) {
        res.status(500).json({ message: 'Delete failed' })
    }
})

module.exports = router;
