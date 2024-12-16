import React, { useState, useEffect } from 'react';
import API from '../services/api'; 

function EventForm() {
  const [locations, setLocations] = useState([]);
  const [existingEvents, setExistingEvents] = useState([]); 
  const userId = localStorage.getItem('userId');
  
  const [formData, setFormData] = useState({
    organizer_id: userId,
    duration: '',
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    location_id: '', 
    available_slots: ''
  });

  const [selectedLocationCapacity, setSelectedLocationCapacity] = useState(0); 

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data } = await API.get('/locations');
        console.log('Fetch Locations Data:', data);
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: value,
      };

      if (name === 'start_date' && updatedData.start_date && updatedData.end_date) {
        const startDate = new Date(updatedData.start_date);
        const endDate = new Date(updatedData.end_date);
        if (startDate > endDate) {
          updatedData.end_date = updatedData.start_date; 
        }
      }

      return updatedData;
    });

    if (name === 'location_id') {
      const selectedLocation = locations.find(loc => loc.location_id.toString() === value);
      console.log('Selected Location:', selectedLocation);
      setSelectedLocationCapacity(selectedLocation ? selectedLocation.capacity : 0); 

      fetchExistingEvents(value);
    }
  };

  const fetchExistingEvents = async (locationId) => {
    try {
      const { data } = await API.get(`/events?location_id=${locationId}`); 
      setExistingEvents(data); 
      console.log('Existing Events:', data);
    } catch (error) {
      console.error('Error fetching existing events:', error);
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

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate > endDate) {
      alert('End date cannot be before the start date.');
      return; 
    }

    const hasConflict = existingEvents.some(event => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = new Date(event.end_date);
      return (
        event.location_id === formData.location_id &&
        startDate < eventEndDate && 
        endDate > eventStartDate 
      );
    });

    if (hasConflict) {
      alert('The venue has already been booked for the selected dates.');
      return; 
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    const eventData = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    console.log('Event Data being sent:', eventData);

    try {
      const { data } = await API.post('/events', eventData);
      console.log('Event created successfully:', data);
      window.location.href = '/events';
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Create New Event</h2>
      <div className="form-row">
        <label>
          Event Name:
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
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
            value={formData.description}
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
            value={formData.start_date}
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
            value={formData.end_date}
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
            value={formData.location_id}
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
            value={formData.available_slots}
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
            value={formData.duration}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <button type="submit" className="add-new-event-button">
        Add New Event
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

export default EventForm;
