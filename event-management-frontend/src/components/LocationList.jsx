import React, { useState, useEffect } from 'react';
import API from '../services/api';

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ location_name: '', address: '', capacity: '' });

  // Fetch locations from the backend
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

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create a new location
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/locations', formData);
      setLocations([...locations, { ...formData, location_id: data.locationId }]);
      setFormData({ location_name: '', address: '', capacity: '' });
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  // Delete a location
  const handleDeleteLocation = async (locationId) => {
    try {
      await API.delete(`/locations/${locationId}`);
      setLocations(locations.filter(location => location.location_id !== locationId));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Locations</h2>

      {/* Add New Location Form */}
      <form onSubmit={handleCreateLocation} style={styles.form}>
        <input
          type="text"
          name="location_name"
          value={formData.location_name}
          onChange={handleInputChange}
          placeholder="Location Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          required
          style={styles.input}
        />
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          placeholder="Capacity"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add Location</button>
      </form>

      {/* Location List */}
      <ul style={styles.list}>
        {locations.map(location => (
          <li key={location.location_id} style={styles.listItem}>
            <h3>{location.location_name}</h3>
            <p>Address: {location.address}</p>
            <p>Capacity: {location.capacity}</p>
            <button
              onClick={() => handleDeleteLocation(location.location_id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: '2rem' },
  form: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  input: { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' },
  addButton: { padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' },
  list: { listStyleType: 'none', padding: 0 },
  listItem: { border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' },
  deleteButton: { marginLeft: '10px', padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' },
};

export default LocationList;
