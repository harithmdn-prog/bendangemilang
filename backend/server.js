const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer();

const Booking = require('./models/booking')
const authRoutes = require('./routes/authRoutes')


const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(cors({
  origin: 'https://bendangemilang.onrender.com',

}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.send('API is running')
})

app.use(express.static(
    path.join(__dirname, '..', 'frontends')))



const paymentRoutes = require('./routes/paymentRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const { createPayment, paymentCallback } = require('./controllers/paymentController')


app.use('/api', paymentRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/auth', authRoutes)

app.post('/api/login', (req, res) => {

    const { username, password } = req.body

    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log('BODY', req.body)

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {

        res.json({ message: 'Login successful' })
        return
    }

    res.status(401).json({ message: 'Login failed' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
