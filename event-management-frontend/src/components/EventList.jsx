import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await API.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event.event_id !== eventId)); // Remove the deleted event from the list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Current Events</h2>
      <button style={styles.addButton}>
        <Link to="/events/new" style={{ ...styles.link, color: 'white' }}>Add New Event</Link>
      </button>

      <ul style={styles.list}>
        {events.map((event) => (
          <li key={event.event_id} style={styles.listItem}>
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Available Slots: {event.available_slots}</p>
            <Link to={`/events/${event.event_id}`} style={styles.link}>View Details</Link>
            <button 
              onClick={() => handleDeleteEvent(event.event_id)} 
              style={styles.deleteButton}
            >
              Delete Event
            </button>
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
  link: {
    textDecoration: 'none',
    color: '#007bff',
  },
  addButton: {
    marginBottom: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  deleteButton: {
    marginLeft: '10px',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EventList;
