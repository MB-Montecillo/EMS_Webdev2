const express = require('express');
const router = express.Router();
const { Event } = require('../models'); // Import the Event model

// CREATE: Add a new event
router.post('/', async (req, res) => {
  try {
    const {
      organizer_id,
      event_name,
      description,
      duration,
      available_slots,
      start_date,
      end_date,
      location_id,
    } = req.body;

    // Validation checks
    if (!organizer_id || !event_name || !duration || !available_slots || !start_date || !end_date || !location_id) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const newEvent = await Event.create({
      organizer_id,
      event_name,
      description,
      duration,
      available_slots,
      start_date,
      end_date,
      location_id,
    });

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Update an event by ID
router.put('/:id', async (req, res) => {
  try {
    const {
      event_name,
      description,
      duration,
      available_slots,
      start_date,
      end_date,
      location_id,
    } = req.body;

    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Ensure location_id is handled properly (if provided in the request)
    const updatedLocationId = location_id !== undefined ? location_id : event.location_id;

    // Update the event with the new data
    await event.update({
      event_name,
      description,
      duration,
      available_slots,
      start_date,
      end_date,
      location_id: updatedLocationId, // Only update if location_id is passed or it remains the same
    });

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE: Delete an event by ID
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete the event
    await event.destroy();
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
