import React, { useState, useEffect } from 'react';
import API from '../services/api';

function BookingForm({ eventId }) {
  const [bookingDate, setBookingDate] = useState('');
  const [slotsReserved, setSlotsReserved] = useState(1); // Default to 1 slot
  const [availableSlots, setAvailableSlots] = useState(0); // To store available slots of the event
  const [startDate, setStartDate] = useState(''); // Event start date
  const [endDate, setEndDate] = useState(''); // Event end date
  const [userId, setUserId] = useState(null); // To store the logged-in user ID

  // Fetch event details to get available slots, start date, and end date
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await API.get(`/events/${eventId}`);
        setAvailableSlots(response.data.available_slots); // Assuming the event object has 'available_slots'
        setStartDate(response.data.start_date); // Set the event's start date
        setEndDate(response.data.end_date); // Set the event's end date
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    const fetchUserId = async () => {
      try {
        // Assuming token is stored in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You need to be logged in!');
          return;
        }

        // Include token in the headers for authorization
        const userResponse = await API.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(userResponse.data.id); // Set the user ID
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Error fetching user information. Please login again.');
      }
    };

    fetchEventDetails();
    fetchUserId();
  }, [eventId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validation for available slots
    if (slotsReserved > availableSlots) {
      alert('Not enough available slots!');
      return;
    }

    // Validate booking date to be within the event's start and end date
    const bookingDateObj = new Date(bookingDate);
    const eventStartDate = new Date(startDate);
    const eventEndDate = new Date(endDate);

    if (bookingDateObj < eventStartDate || bookingDateObj > eventEndDate) {
      alert('Booking date must be within the event\'s start and end date!');
      return;
    }

    if (!userId) {
      alert('You must be logged in to make a booking!');
      return;
    }

    try {
      // Send user_id and event_id along with other booking details
      await API.post('/bookings', {
        event_id: eventId,
        user_id: userId, // Include user_id to associate the booking with the logged-in user
        booking_date: bookingDate,
        slots_reserved: slotsReserved,
      });
      alert('Booking successful!');
      // Dynamically update available slots without reloading the page
      setAvailableSlots(availableSlots - slotsReserved);
    } catch (error) {
      alert(error.response?.data || 'Booking failed');
    }
  };

  return (
    <form onSubmit={handleBooking} style={styles.form}>
      <h3>Book Event</h3>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        required
        style={styles.input}
      />
      <div style={styles.slotContainer}>
        <label htmlFor="slotsReserved" style={styles.label}>
          Slots Reserved
        </label>
        <input
          type="number"
          id="slotsReserved"
          value={slotsReserved}
          onChange={(e) => setSlotsReserved(Math.max(1, e.target.value))}
          min="1"
          max={availableSlots}
          required
          style={styles.input}
        />
        <p>Available Slots: {availableSlots}</p>
      </div>
      <button type="submit" style={styles.button}>Book Now</button>
    </form>
  );
}

const styles = {
  form: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  slotContainer: {
    marginBottom: '1rem',
  },
  label: {
    marginBottom: '0.5rem',
    fontSize: '1rem',
  },
};

export default BookingForm;
