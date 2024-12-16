import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function EditEvent() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    location_id: '',
    available_slots: '',
    duration: '',
    organizer_id: localStorage.getItem('userId'),
  });
  const [selectedLocationCapacity, setSelectedLocationCapacity] = useState(0); 

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data } = await API.get('/locations');
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }

    fetchLocations(); 
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      if (locations.length > 0) { 
        try {
          const { data } = await API.get(`/events/${id}`);
          setFormData({
            event_name: data.event_name,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date,
            location_id: data.location_id,
            available_slots: data.available_slots,
            duration: data.duration,
            organizer_id: data.organizer_id,
          });
          
          const location = locations.find(loc => loc.location_id === data.location_id);
          setSelectedLocationCapacity(location ? location.capacity : 0);
        } catch (error) {
          console.error('Error fetching event for editing:', error);
        }
      }
    }

    fetchEvent(); 
  }, [locations, id]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'location_id') {
      const selectedLocation = locations.find(loc => loc.location_id.toString() === value);
      setSelectedLocationCapacity(selectedLocation ? selectedLocation.capacity : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (parseInt(formData.available_slots) > selectedLocationCapacity) {
      alert(`Available slots exceed the capacity of the selected location (${selectedLocationCapacity}).`);
      return;
    }
  
    const durationInHours = parseInt(formData.duration);
    if (durationInHours < 1) {
      alert('Duration must be at least 1 hour.');
      return;
    }
    if (durationInHours > 12) {
      alert('Duration cannot exceed 12 hours.');
      return;
    }
  
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (endDate < startDate) {
      alert('End date cannot be earlier than the start date.');
      return;
    }
  
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
  
    const eventData = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };
  
    try {
      await API.put(`/events/${id}`, eventData);
      alert('Event updated successfully!');
      navigate(`/events`);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };  

  const handleClose = () => {
    navigate('/events');
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button onClick={handleClose} style={styles.closeButton}>X</button>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Edit Event</h2>
          <div style={styles.formRow}>
            <label style={styles.label}>Event Name:</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name || ''}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date || ''}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>End Date:</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date || ''}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Location:</label>
            <select
              name="location_id"
              value={formData.location_id || ''}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select a Location</option>
              {locations.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name} - {location.address} (Capacity: {location.capacity})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Available Slots:</label>
            <input
              type="number"
              name="available_slots"
              value={formData.available_slots || ''}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Duration (hours):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '800px',
    width: '100%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '1.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
  },
  textarea: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
    minHeight: '100px',
  },
  select: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
  },
  submitButton: {
    padding: '0.8rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default EditEvent;
