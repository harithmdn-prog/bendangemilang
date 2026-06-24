    const API_URL = 'https://bendangemilang.vercel.app//api/booking';

    if (localStorage.getItem('adminLoggedIn') !== 'true') {

        alert('Please log in as admin to access this page')
        window.location.href = 'adminlogin.html'
    } 

    function getHomestayName(id) {

        if (Number(id) === 1) {
            return 'Main House'
        }
        if (Number(id) === 2) {
            return 'Cabin 1'
        }
        if (Number(id) === 3) {
            return 'Cabin 2'
        }
        return 'Unknown Homestay'
    }

    function logout() {

        localStorage.removeItem('adminLoggedIn')
        window.location.href = 'adminlogin.html'
    }

    async function loadBookings() {

        try {

            const response = await fetch(`${API_URL}`)
            const bookings = await response.json()

            const table = document.getElementById('bookingTable')

            table.innerHTML = ''
            
            bookings.forEach(booking => {

                const row = document.createElement('tr')

                row.className = 'border-t'

                row.innerHTML = `

                    <td class="py-2 px-4">${booking.name}</td>
                    <td class="py-2 px-4">${booking.email}</td>
                    <td class="py-2 px-4">${booking.phone}</td>
                    <td class="py-2 px-4">${getHomestayName(booking.homestayId)}</td>
                    <td class="py-2 px-4">${booking.checkIn}</td>
                    <td class="py-2 px-4">${booking.checkOut}</td>
                    <td class="py-2 px-4">${booking.totalPrice}</td>
                    <td class="py-2 px-4 capitalize">${booking.paymentStatus}</td>

                    <td class="py-2 px-4">
                        <button onclick="deleteBooking('${booking._id}')" class="bg-red-500 text-white px-4 py-1 rounded-xl">Delete</button>
                    </td>
                `
                table.appendChild(row)
            })
        
        } catch (error) {
            console.error('Error loading bookings:', error)}
    }

    async function createBooking() {

        try {

            const bookingData = {

                name:
                document.getElementById('name').value,

                email:
                document.getElementById('email').value,

                phone:
                document.getElementById('phone').value,

                homestayId:
                Number(
                    document.getElementById('homestayId').value),

                checkIn:
                document.getElementById('checkIn').value,

                checkOut:
                document.getElementById('checkOut').value,

                totalPrice:
                Number(
                    document.getElementById('totalPrice').value),
                
                paymentStatus:
                document.getElementById('paymentStatus').value
            }

            const response = await fetch(API_URL, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(bookingData)
        })

            if (!response.ok) {
                throw new Error('Failed to create booking') 
            }

            alert('Booking created successfully')

            clearForm()
            loadBookings()

        } catch (error) {
            console.error('Error creating booking:', error)
        }
    }    

    
    async function deleteBooking(id) {

    const confirmDelete =
      confirm('Delete this booking?')

    if (!confirmDelete) {
        return
    }

    try {

        const response =
          await fetch(`${API_URL}/${id}`, {
              method: 'DELETE'
          })

        if (!response.ok) {
            throw new Error('Delete failed')
        }

        alert('Booking deleted')

        loadBookings()

    } catch (error) {

        console.error(
          'Error deleting booking:',
          error
        )
    }
    }

         function clearForm() {

                document.getElementById('name').value = ''
                document.getElementById('email').value = ''
                document.getElementById('phone').value = ''
                document.getElementById('homestayId').value = ''
                document.getElementById('checkIn').value = ''
                document.getElementById('checkOut').value = ''
                document.getElementById('paymentStatus').value = ''
                document.getElementById('totalPrice').value = 0
         }
         
        loadBookings()