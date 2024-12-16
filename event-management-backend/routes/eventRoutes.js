const express = require('express');
const router = express.Router();
const { Event } = require('../models');

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

router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

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

    const updatedLocationId = location_id !== undefined ? location_id : event.location_id;

    await event.update({
      event_name,
      description,
      duration,
      available_slots,
      start_date,
      end_date,
      location_id: updatedLocationId, 
    });

    return res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
