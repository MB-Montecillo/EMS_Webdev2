import React, { useState, useEffect } from 'react';
import API from '../services/api';
import EventForm from './EventForm';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const userId = localStorage.getItem('userId');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const eventsPerPage = 10;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data } = await API.get(`/users/${userId}`);
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const { data } = await API.get('/locations');
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchUserRole();
    fetchLocations();
  }, [userId]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get(`/events?page=${currentPage}&perPage=${eventsPerPage}`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentPage]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event.event_id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredEvents = events.filter(event => {
    const location = locations.find(loc => loc.location_id === event.location_id);
    const locationName = location ? location.location_name.toLowerCase() : '';

    return (
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationName.includes(searchQuery.toLowerCase()) ||
      new Date(event.start_date).toLocaleDateString().includes(searchQuery) ||
      new Date(event.end_date).toLocaleDateString().includes(searchQuery)
    );
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={styles.container}>
      <h2>Events</h2>

      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {userRole === 'organizer' && (
        <button
          style={styles.addButton}
          onClick={() => setIsModalOpen(true)} 
        >
          Add New Event
        </button>
      )}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              style={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <EventForm onClose={() => setIsModalOpen(false)} /> 
          </div>
        </div>
      )}

      <ul style={styles.list}>
        {filteredEvents
          .slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
          .map((event) => {
            const location = locations.find(loc => loc.location_id === event.location_id);
            const isFullyBooked = event.available_slots <= 0;

            return (
              <li key={event.event_id} style={styles.listItem}>
                <h3>{event.event_name}</h3>
                <p>{event.description}</p>
                <p>
                  Date: {new Date(event.start_date).toLocaleDateString()} -{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
                <p>Location: {location ? location.location_name : "Location not specified"}</p>
                <p>Available Slots: {isFullyBooked ? 'Fully Booked' : event.available_slots}</p>
                {!isFullyBooked && (
                  <Link to={`/events/${event.event_id}`} style={styles.link}>
                    View Details
                  </Link>
                )}
                {Number(event.organizer_id) === Number(userId) && (
                  <button
                    onClick={() => handleDeleteEvent(event.event_id)}
                    style={styles.deleteButton}
                  >
                    Delete Event
                  </button>
                )}
                {Number(event.organizer_id) === Number(userId) && (
                  <Link to={`/events/edit/${event.event_id}`}>
                    <button style={styles.editButton}>
                      Edit Event
                    </button>
                  </Link>
                )}
              </li>
            );
          })}
      </ul>

      <div style={styles.pagination}>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            style={styles.paginationButton}
            disabled={currentPage === number}
          >
            {number}
          </button>
        ))}
      </div>
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
  editButton: {
    marginLeft: '10px',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  searchInput: {
    display: 'block',
    marginBottom: '1rem',
    padding: '0.5rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 5px',
  },
};

export default EventList;
