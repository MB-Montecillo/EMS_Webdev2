import React, { useState, useEffect } from 'react';
import API from '../services/api';

function BookingForm({ eventId }) {
  const [bookingDate, setBookingDate] = useState('');
  const [slotsReserved, setSlotsReserved] = useState(1); 
  const [availableSlots, setAvailableSlots] = useState(0); 
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await API.get(`/events/${eventId}`);
        setAvailableSlots(response.data.available_slots); 
        setStartDate(response.data.start_date); 
        setEndDate(response.data.end_date); 
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

  fetchEventDetails();
    
  }, [eventId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (slotsReserved > availableSlots) {
      alert('Not enough available slots!');
      return;
    }

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
      await API.post('/bookings', {
        event_id: eventId,
        user_id: userId, 
        booking_date: bookingDate,
        slots_reserved: slotsReserved,
      });
      alert('Booking successful!');
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
