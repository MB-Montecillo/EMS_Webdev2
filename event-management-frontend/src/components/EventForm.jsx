import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Make sure this service is set up correctly

function EventForm() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    location_id: '',  // Store selected location ID
    available_slots: ''
  });

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data } = await API.get('/locations');
        setLocations(data);  // Set the locations fetched from the database
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure data is in the correct format
    const formattedStartDate = new Date(formData.start_date).toISOString();
    const formattedEndDate = new Date(formData.end_date).toISOString();

    const eventData = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    // Log the data to check
    console.log('Event Data being sent:', eventData);

    try {
      const { data } = await API.post('/events', eventData);
      console.log('Event created successfully:', data);
      // Redirect or clear the form if necessary
      // You can reset the form or show a success message
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Create New Event</h2>
      
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

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </label>

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
              {location.location_name} - {location.address}
            </option>
          ))}
        </select>
      </label>

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
