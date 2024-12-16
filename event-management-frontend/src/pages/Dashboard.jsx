import React, { useEffect, useState } from 'react';
import API from '../services/api';
import useStore from '../store/useStore';

function Dashboard() {
  const { events, bookings, setEvents, setBookings } = useStore();
  const [overview, setOverview] = useState({
    totalEvents: 0,
    upcomingEvents: [],
    totalBookings: 0,
    upcomingBookings: [],
    eventSpotlight: null,
  });

  const [userRole, setUserRole] = useState(null); 
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsData, bookingsData] = await Promise.all([
          API.get('/events'),
          API.get('/bookings'),
        ]);
        setEvents(eventsData.data);
        setBookings(bookingsData.data);

        const userRoleResponse = await API.get(`/users/${userId}`);
        setUserRole(userRoleResponse.data.role);

        const totalEvents = eventsData.data.length; 
        const upcomingEvents = eventsData.data.filter(event => new Date(event.start_date) >= new Date()).slice(0, 5);
        const totalBookings = bookingsData.data.length; 
        const upcomingBookings = bookingsData.data.filter(booking => new Date(booking.booking_date) >= new Date()).slice(0, 5); 
        const eventSpotlight = eventsData.data.reduce((prev, current) => (prev.available_slots < current.available_slots ? prev : current), eventsData.data[0]);

        setOverview({
          totalEvents,
          upcomingEvents,
          totalBookings,
          upcomingBookings,
          eventSpotlight,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchData();
  }, [userId, setEvents, setBookings]);

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <div style={styles.widgets}>
        {userRole === 'organizer' && (
          <div style={styles.widget}>
            <h3>Total Events Created</h3>
            <p>{overview.totalEvents}</p>
          </div>
        )}
        
        <div style={styles.widget}>
          <h3>Upcoming Events</h3>
          <ul>
            {overview.upcomingEvents.map(event => (
              <li key={event.event_id}>{event.event_name} on {new Date(event.start_date).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>

        {userRole === 'organizer' && (
          <div style={styles.widget}>
            <h3>Total Bookings</h3>
            <p>{overview.totalBookings}</p>
          </div>
        )}

        <div style={styles.widget}>
          <h3>Upcoming Bookings</h3>
          <ul>
            {overview.upcomingBookings.map(booking => {
              const event = events.find(event => event.event_id === booking.event_id); 
              return (
                <li key={booking.booking_id}>
                  {event ? event.event_name : 'Event Not Found'} on {new Date(booking.booking_date).toLocaleDateString()}
                </li>
              );
            })}
          </ul>
        </div>
        
        <div style={styles.widget}>
          <h3>Event Spotlight</h3>
          {overview.eventSpotlight && (
            <div>
              <h4>{overview.eventSpotlight.event_name}</h4>
              <p>Available Slots: {overview.eventSpotlight.available_slots}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  widgets: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  widget: {
    flex: '1 1 300px',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
};

export default Dashboard;
