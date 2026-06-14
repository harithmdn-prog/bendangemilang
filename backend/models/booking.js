const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

  homestayId: Number,

  name: String,

  email: String,

  phone: String,

  checkIn: Date,

  checkOut: Date,

  totalPrice: Number,

  billCode: String,

  paymentStatus: {
    type: String,
    default: 'pending'
  }

}, {
  timestamps: true
})

module.exports =
  mongoose.model('Booking', bookingSchema)