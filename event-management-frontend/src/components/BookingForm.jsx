// src/components/BookingForm.jsx
import React, { useState } from 'react';
import API from '../services/api';

function BookingForm({ eventId }) {
  const [bookingDate, setBookingDate] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { event_id: eventId, booking_date: bookingDate });
      alert('Booking successful!');
      window.location.reload(); // Reload to update available slots
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
};

export default BookingForm;
