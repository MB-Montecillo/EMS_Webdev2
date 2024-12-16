import React, { useState, useEffect } from 'react';
import API from '../services/api';

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('myBookings'); // Tab state (myBookings, bookedEvents)

  // Get the logged-in user's ID from localStorage
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await API.get('/bookings');
        console.log('Fetched Bookings:', data); // Debugging line
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }

    async function fetchEvents() {
      try {
        const { data } = await API.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    async function fetchUsers() {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchBookings();
    fetchEvents();
    fetchUsers();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await API.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking.booking_id !== bookingId));
      console.log('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const getEventNameById = (eventId) => {
    const event = events.find((event) => event.event_id === eventId);
    return event ? event.event_name : 'Event not found';
  };

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.user_id === userId);
    return user ? user.name : 'User not found';
  };

  return (
    <div style={styles.container}>
      <h2>Bookings</h2>
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('myBookings')} style={styles.tabButton}>My Bookings</button>
        <button onClick={() => setActiveTab('bookedEvents')} style={styles.tabButton}>Booked Events</button>
      </div>
      {activeTab === 'myBookings' && (
        <ul style={styles.list}>
          {/* Correcting the filter condition here */}
          {bookings.filter(booking => String(booking.user_id) === String(userId)).map((booking) => (
            <li key={booking.booking_id} style={styles.listItem}>
              <h3>Event: {getEventNameById(booking.event_id)}</h3>
              <p>Booking Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
              <p>Booked By: {getUserNameById(booking.user_id)}</p>
              <button onClick={() => handleDeleteBooking(booking.booking_id)} style={styles.button}>
                Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'bookedEvents' && (
        <ul style={styles.list}>
          {/* Correcting the filter condition here */}
          {bookings.filter(booking => booking.user_id !== userId).map((booking) => (
            <li key={booking.booking_id} style={styles.listItem}>
              <h3>Event: {getEventNameById(booking.event_id)}</h3>
              <p>Booking Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
              <p>Booked By: {getUserNameById(booking.user_id)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  tabs: {
    display: 'flex',
    marginBottom: '1rem',
  },
  tabButton: {
    padding: '1rem',
    margin: '0 0.5rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
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
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default BookingsList;
