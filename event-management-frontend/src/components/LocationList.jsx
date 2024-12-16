import React, { useState, useEffect } from 'react';
import API from '../services/api';

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({ location_name: '', address: '', capacity: '' });
  const [editMode, setEditMode] = useState(false); // Track if we are in edit mode
  const [editLocationId, setEditLocationId] = useState(null); // Track which location is being edited

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

  // Create or update a location based on the mode (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      // Update location
      try {
        await API.put(`/locations/${editLocationId}`, formData);
        setLocations(locations.map(location =>
          location.location_id === editLocationId
            ? { ...location, ...formData }
            : location
        ));
        setFormData({ location_name: '', address: '', capacity: '' });
        setEditMode(false);
        setEditLocationId(null);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    } else {
      // Create new location
      try {
        const { data } = await API.post('/locations', formData);
        setLocations([...locations, { ...formData, location_id: data.locationId }]);
        setFormData({ location_name: '', address: '', capacity: '' });
      } catch (error) {
        console.error('Error creating location:', error);
      }
    }
  };

  // Edit an existing location
  const handleEditLocation = (location) => {
    setFormData({
      location_name: location.location_name,
      address: location.address,
      capacity: location.capacity
    });
    setEditMode(true);
    setEditLocationId(location.location_id);
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

      {/* Add/Edit Location Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
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
        <button type="submit" style={styles.addButton}>
          {editMode ? 'Update Location' : 'Add Location'}
        </button>
      </form>

      {/* Location List */}
      <ul style={styles.list}>
        {locations.map(location => (
          <li key={location.location_id} style={styles.listItem}>
            <h3>{location.location_name}</h3>
            <p>Address: {location.address}</p>
            <p>Capacity: {location.capacity}</p>
            <button
              onClick={() => handleEditLocation(location)}
              style={styles.editButton}
            >
              Edit
            </button>
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
  editButton: { marginLeft: '10px', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' },
};

export default LocationList;
