import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import BookingForm from './BookingForm';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [location, setLocation] = useState(null); 
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);

        const locationResponse = await API.get(`/locations/${data.location_id}`); 
        setLocation(locationResponse.data);
        
        const organizerResponse = await API.get(`/users/${data.organizer_id}`); 
        setOrganizer(organizerResponse.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }
    fetchEvent();
  }, [id]);

  if (!event || !location || !organizer) return <p>Loading...</p>; 

  return (
    <div style={styles.container}>
      <h2>{event.event_name}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
      <p>Location: {location.location_name} - {location.address}</p>
      <p>Duration: {event.duration} hours</p> 
      <p>Organizer: {organizer.name}</p> 
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
