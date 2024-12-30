import express from 'express';
import { courtService } from '../services/courts.js';
import db from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await courtService.getCourts();
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await courtService.createCourt(req.body);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

// Get court availability for a specific date
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Get all bookings for this court on the given date
    const { data: bookings, error } = await db
      .from('bookings')
      .select('start_time, end_time')
      .eq('court_id', id)
      .eq('booking_date', date)
      .neq('status', 'cancelled');

    if (error) throw error;

    // Generate time slots (8 AM to 10 PM)
    const availableSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      const start = hour.toString().padStart(2, '0');
      const end = (hour + 1).toString().padStart(2, '0');
      
      // Check if slot is available
      const isBooked = bookings.some(booking => {
        const bookingHour = parseInt(booking.start_time.split(':')[0]);
        return bookingHour === hour;
      });

      if (!isBooked) {
        availableSlots.push({
          start: `${start}:00`,
          end: `${end}:00`
        });
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Error getting court availability:', error);
    res.status(500).json({ error: 'Failed to get court availability' });
  }
});

export default router; 