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

    const formattedStartDate = new Date(formData.start_date).toISOString();
    const formattedEndDate = new Date(formData.end_date).toISOString();

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

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Edit Event</h2>
      <div className="form-row">
        <label>
          Event Name:
          <input
            type="text"
            name="event_name"
            value={formData.event_name || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={formData.start_date || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={formData.end_date || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Location:
          <select
            name="location_id"
            value={formData.location_id || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Location</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.location_name} - {location.address} (Capacity: {location.capacity})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Available Slots:
          <input
            type="number"
            name="available_slots"
            value={formData.available_slots || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Duration (hours):
          <input
            type="number"
            name="duration"
            value={formData.duration || ''}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <button type="submit" className="add-new-event-button">
        Update Event
      </button>
    </form>
  );
}

const styles = {
  form: {
    padding: '2rem',
    maxWidth: '600px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default EditEvent;
