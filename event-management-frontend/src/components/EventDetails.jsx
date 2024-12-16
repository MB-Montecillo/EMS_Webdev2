import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import BookingForm from './BookingForm';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [location, setLocation] = useState(null); // State to hold the location details
  const [organizer, setOrganizer] = useState(null); // State to hold the organizer details

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);

        // Fetch the location based on the location_id from the event
        const locationResponse = await API.get(`/locations/${data.location_id}`); // Assuming the API endpoint exists
        setLocation(locationResponse.data);
        
        // Fetch the organizer details using organizer_id
        const organizerResponse = await API.get(`/users/${data.organizer_id}`); // Assuming this endpoint returns user details
        setOrganizer(organizerResponse.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }
    fetchEvent();
  }, [id]);

  if (!event || !location || !organizer) return <p>Loading...</p>; // Ensure both event, location, and organizer are loaded

  return (
    <div style={styles.container}>
      <h2>{event.event_name}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
      <p>Location: {location.location_name} - {location.address}</p>
      {/* <p>Available Slots: {event.available_slots}</p> */}
      <p>Duration: {event.duration} hours</p> {/* Displaying event duration */}
      <p>Organizer: {organizer.name}</p> {/* Displaying organizer name */}
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
