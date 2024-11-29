import React, { useState, useEffect } from 'react';
import API from '../services/api';
import BookingForm from './BookingForm';

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedEventId, setSelectedEventId] = useState(null); // State for selected event ID (if needed)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await API.get('/bookings');
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }
    fetchBookings();
  }, []);

  const toggleModal = () => setShowModal(!showModal); // Toggle modal visibility

  return (
    <div style={styles.container}>
      <h2>Your Bookings</h2>

      <ul style={styles.list}>
        {bookings.map((booking) => (
          <li key={booking.booking_id} style={styles.listItem}>
            <h3>Event ID: {booking.event_id}</h3>
            <p>Booking Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
            <p>Booked By: {booking.user_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    border: '1px solid #ccc',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

export default BookingsList;
