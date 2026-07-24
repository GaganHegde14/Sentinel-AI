import * as eventModel from '../models/eventModel.js';

export const getEvents = async (req, res) => {
  try {
    const { search } = req.query;
    const events = await eventModel.getAllEvents(search);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await eventModel.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const id = await eventModel.createEvent(req.body);
    res.status(201).json({ message: 'Event created successfully', id });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const success = await eventModel.updateEvent(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const success = await eventModel.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};
