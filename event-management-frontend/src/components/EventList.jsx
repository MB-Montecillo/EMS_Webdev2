// src/components/EventList.jsx
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

  return (
    <div style={styles.container}>
      <h2>CUrrent Events</h2>
      <ul style={styles.list}>
        {events.map((event) => (
          <li key={event.event_id} style={styles.listItem}>
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Available Slots: {event.available_slots}</p>
            <Link to={`/events/${event.event_id}`} style={styles.link}>View Details</Link>
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
};

export default EventList;
