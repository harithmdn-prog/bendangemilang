const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer()

const { paymentCallback } = require('../controllers/paymentController')

const { createPayment } =
  require('../controllers/paymentController')

router.post('/create-payment', createPayment)

router.post(
  '/callback',
  upload.none(), // parses multipart/form-data fields
  paymentCallback
);

console.log('Payment routes loaded')

module.exports = router