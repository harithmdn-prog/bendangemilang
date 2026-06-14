const calendar = document.getElementById('calendar')
const monthYear = document.getElementById('monthYear')

let currentDate = new Date()

let selectedHomestay = null
let selectedPrice = 0

let checkIn = null
let checkOut = null

function getLatestBookedDate() {
  const allDates = Object.values(bookedDates).flat()

  if (allDates.length === 0) {
    return null
  }

  return allDates.reduce((latest, current) => {

    if (!latest) {
      return current
    } 

    return parseDateAsUTC(current) > parseDateAsUTC(latest) ? current : latest
  }, null)
 
}

function setCalendarToLatestBookedMonth() {
  const latestBookedDate = getLatestBookedDate()

  if (!latestBookedDate) {
    currentDate = new Date()
    return
  }

  const [year, month, day] = latestBookedDate.split('-').map(Number)
  currentDate = new Date(year, month - 1, day)
}

function renderCalendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  calendar.innerHTML = ''

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  monthYear.innerText = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })

  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div')
    calendar.appendChild(empty)
  }

  for (let day = 1; day <= lastDate; day++) {
    const fullDate =
      `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const button = document.createElement('button')

    button.innerText = day
    button.dataset.date = fullDate
    button.className =
      'day h-14 rounded-xl border border-gray-200 hover:bg-blue-100 transition'

    const dateObj = parseDateAsUTC(fullDate)

    if (dateObj < today) {
      button.disabled = true
      button.classList.add('opacity-50', 'cursor-not-allowed')
    } else if (dateObj.getTime() === today.getTime()) {
      button.classList.add('bg-gray-300', 'text-gray-800', 'font-semibold', 'ring-2', 'ring-gray-500')
    }

    if (
      selectedHomestay &&
      bookedDates[selectedHomestay] &&
      bookedDates[selectedHomestay].includes(fullDate)
    ) {

      button.classList.add('booked', 'bg-red-500', 'text-white', 'cursor-not-allowed')
      button.disabled = true

    }

    button.addEventListener('click', () => selectDate(fullDate))

    calendar.appendChild(button)
  }

  updateSelectedUI()
}

function parseDateAsUTC(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function selectDate(date) {
  if (checkOut === date) {
    checkOut = null
    updateSelectedUI()
    calculateTotal()
    updateSummary()
    return
  }

  if (checkIn === date && !checkOut) {
    checkIn = null
    updateSelectedUI()
    calculateTotal()
    updateSummary()
    return
  }

  if (!checkIn) {
    checkIn = date
  } else if (!checkOut) {
    const first = parseDateAsUTC(checkIn)
    const second = parseDateAsUTC(date)

    if (second < first) {
      checkOut = checkIn
      checkIn = date
    } else {
      checkOut = date
    }
  } else {
    checkIn = date
    checkOut = null
  }

  updateSelectedUI()
  calculateTotal()
  updateSummary()
}

function updateSelectedUI() {
  document.querySelectorAll('.day').forEach(day => {
    day.classList.remove('selected', 'range')
    day.style.backgroundColor = ''
    day.style.color = ''
  })

  if (!checkIn) {
    return
  }

  const start = parseDateAsUTC(checkIn)
  const end = checkOut ? parseDateAsUTC(checkOut) : null

  const markedDays = []

  document.querySelectorAll('.day').forEach(day => {
    const date = day.dataset.date
    const current = parseDateAsUTC(date)

    if (date === checkIn || date === checkOut) {
      day.classList.add('selected')
      day.style.backgroundColor = '#2563eb'
      day.style.color = '#ffffff'
      markedDays.push(`selected:${date}`)
      return
    }

    if (end && current > start && current < end) {
      day.classList.add('range')
      day.style.backgroundColor = '#2563eb'
      day.style.color = '#ffffff'
      markedDays.push(`range:${date}`)
    }
  })

  console.log('calendar selection', { checkIn, checkOut, markedDays })
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1)
  renderCalendar()
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1)
  renderCalendar()
}

setCalendarToLatestBookedMonth()
renderCalendar()
