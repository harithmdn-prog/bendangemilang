const Booking = require('../models/booking')
const axios = require('axios')

const createPayment = async (req, res) => {

    try {


        const { homestayId,name, email, phone, checkIn, checkOut, totalPrice } = req.body

        const data = new URLSearchParams({
        
            userSecretKey: process.env.TOYYIBPAY_SECRET_KEY,
            categoryCode: process.env.TOYYIBPAY_CATEGORY_CODE,
            billName: 'homestay payment',
            billDescription: `${checkIn} - ${checkOut}`,
            billPriceSetting: 1,
            billPayorInfo: 1,
            billAmount: totalPrice * 100, // RM10.00 (amount in cents)
            billReturnUrl: 'http://localhost:5000/success.html',
            billCallbackUrl: 'https://swung-olympics-undercoat.ngrok-free.dev/api/callback',
            billExternalReferenceNo: 'ORDER-1001',
            billTo: name,
            billEmail: email,
            billPhone: phone
  });

  const response = await axios.post('https://dev.toyyibpay.com/index.php/api/createBill', data,
    {
     headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
        
     const billCode = response.data[0].BillCode

     const booking = new Booking({
            homestayId,
            name,
            email,
            phone,
            checkIn,
            checkOut,
            totalPrice,
            billCode,
            paymentStatus: 'pending'
        })

        await booking.save()

        console.log('Booking saved')

        res.json({
            success: true,
            billCode,
            url: `https://dev.toyyibpay.com/${billCode}` // Placeholder URL, replace with actual payment URL
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })
    }
}

const paymentCallback = async (req, res) => {
  console.log('🔥 CALLBACK HIT');
  console.log('BODY:', req.body);

  const billcode =
    req.body.billcode ||
    req.body.billCode ||
    req.body.BillCode;

  const status_id =
    req.body.status_id ||
    req.body.StatusID;

  console.log('Billcode:', billcode);
  console.log('Status ID:', status_id);

  if (status_id === '1') {
    const booking = await Booking.findOneAndUpdate(
      { billCode: billcode },
      { paymentStatus: 'completed' },
      { new: true }
    );

    console.log('Updated booking:', booking);
  }

  res.send('OK');
};



module.exports = {
    createPayment,
    paymentCallback
}
