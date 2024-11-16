// src/components/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import BookingForm from './BookingForm';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>{event.event_name}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Available Slots: {event.available_slots}</p>
      <BookingForm eventId={event.event_id} />
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
};

export default EventDetails;
