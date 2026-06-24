let totalPrice = 0

function selectHomestay(id, price) {

  selectedHomestay = id
  selectedPrice = Number(price)

  
  // RESET ALL BUTTONS
  document.querySelectorAll('.homestay-btn')
    .forEach(button => {

      button.classList.remove(
        'bg-green-600',
        'text-white'
      )

      button.classList.add(
        'bg-gray-200',
        'text-black'
      )

      button.querySelector('.tick')
        .classList.add('hidden')
    })

  // SELECT CURRENT BUTTON
  const selectedButton =
    document.getElementById(`homestay-${id}`)

  selectedButton.classList.remove(
    'bg-gray-200',
    'text-black'
  )

  selectedButton.classList.add(
    'bg-green-600',
    'text-white'
  )

  // SHOW TICK
  selectedButton.querySelector('.tick')
    .classList.remove('hidden')


  renderCalendar()

  calculateTotal()
}

function calculateTotal() {

  console.log("checkIn:", checkIn)
  console.log("checkOut:", checkOut)
  console.log("selectedPrice:", selectedPrice)

  if (!checkIn || !checkOut || !selectedPrice) {

    document.getElementById('nightText').innerText = 0
    document.getElementById('totalPrice').innerText = 0


    return
  }

  const start = parseDateAsUTC(checkIn); // Use UTC parsing for consistent calculation
  const end = parseDateAsUTC(checkOut);   // Use UTC parsing for consistent calculation

  const diffTime = end - start

  const nights =
    Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  totalPrice = nights * selectedPrice

  
  // IF HOMESTAY NOT SELECTED
  if (!selectedPrice) {

    document.getElementById('nightText').innerText = nights
    document.getElementById('totalPrice').innerText =
      'Select homestay'


    return
  }

  

  if (end <= start) {

    totalPrice = 0
    document.getElementById('totalPrice').innerText = 0
    return
  }


  document.getElementById('nightText').innerText = nights
  document.getElementById('totalPrice').innerText = totalPrice
}

function updateSummary() {

  document.getElementById('checkInText').innerText =
    checkIn || '-'

  document.getElementById('checkOutText').innerText =
    checkOut || '-'
}

function resetBooking() {

  checkIn = null
  checkOut = null
  totalPrice = 0

  updateSelectedUI()

  document.getElementById('nightText').innerText = 0
  document.getElementById('totalPrice').innerText = 0

  updateSummary()
}

async function loadBookings() {

  console.log('Loading bookings')


  try {

    const response = await fetch('https://bendangemilang.vercel.app/api/booking')
    const data = await response.json()

    console.log(data)

    bookedDates = {

      1: [],
      2: [],
      3: [],
    }

    // Process completed bookings to block dates on the calendar
    data.forEach(booking => {
      console.log(booking.billCode,booking.paymentStatus)

      if (booking.paymentStatus === 'completed') {

        const homestayId = booking.homestayId
        // Parse dates and iterate through the range
        let current = new Date(booking.checkIn)
        let end = new Date(booking.checkOut)

        while (current <= end) {
          const y = current.getUTCFullYear()
          const m = String(current.getUTCMonth() + 1).padStart(2, '0')
          const d = String(current.getUTCDate()).padStart(2, '0')
          const formattedDate = `${y}-${m}-${d}`

          const homestayId = booking.homestayId

          if (!bookedDates[homestayId]) {
            bookedDates[homestayId] = []
          }

          if (!bookedDates[homestayId].includes(formattedDate)) {
            bookedDates[homestayId].push(formattedDate)
          }
          // Move to next day
          current.setUTCDate(current.getUTCDate() + 1)
        }
      }
    })

    // Refresh the calendar with the new bookedDates
    if (typeof setCalendarToLatestBookedMonth === 'function') {
      setCalendarToLatestBookedMonth()
    }

    if (typeof renderCalendar === 'function') {
      renderCalendar()
    }

  } catch (error) {

    console.error('Error fetching booking:', error)
  }
}
