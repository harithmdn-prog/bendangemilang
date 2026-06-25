async function proceedPayment() {

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const phone = document.getElementById('phone').value

  if (!selectedHomestay) {
    alert('Please select homestay')
    return
  }

  if (!checkIn || !checkOut) {
    alert('Please select dates')
    return
  }

  if (!name || !email || !phone) {
    alert('Please fill in all details')
    return
  }

  try {
  const response = await fetch ('https://bendangemilang.onrender.com/api/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      homestayId: selectedHomestay,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      totalPrice
    })
  })

  console.log('Response status:', response.status)

  const data = await response.json()

  console.log(data);
  
  if (data.url) {
    window.location.href = data.url
  } else {
    alert('No payment URL returned')
  } 


  } catch (error) {
    console.error('FULL ERROR:', error)
    alert('Payment failed')
  }
}
