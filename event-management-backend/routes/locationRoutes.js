const express = require('express');
const router = express.Router();
const { Location } = require('../models'); // Import the Location model
const db = require('../config/db');

// CREATE: Add a new location
router.post('/', async (req, res) => {
  const { location_name, address, capacity } = req.body;

  const sql = 'INSERT INTO locations (location_name, address, capacity) VALUES (?, ?, ?)';
  const values = [location_name, address, capacity];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting location:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Location created successfully', locationId: result.insertId });
  });
});

// READ: Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get a single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    return res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Update a location by ID
router.put('/:id', async (req, res) => {
  try {
    const { location_name, address, capacity } = req.body;

    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Update the location
    await location.update({
      location_name: location_name || location.location_name,
      address: address || location.address,
      capacity: capacity || location.capacity,
    });

    return res.status(200).json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE: Delete a location by ID
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Delete the location
    await location.destroy();
    return res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;