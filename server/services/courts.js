import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const courtService = {
  async getCourts() {
    try {
      const { data, error } = await db
        .from('courts')
        .select(`
          *,
          court_availability (
            day_of_week,
            start_time,
            end_time,
            valid_from,
            valid_until,
            is_recurring
          )
        `);

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error in getCourts:', error);
      return { error: 'Failed to fetch courts' };
    }
  },

  async createCourt(courtData) {
    try {
      // Create court
      const { data: court, error: courtError } = await db
        .from('courts')
        .insert([{
          id: randomUUID(),
          name: courtData.name,
          type: courtData.type,
          court_size: courtData.court_size || 'standard',
          hourly_rate: courtData.hourly_rate || 0,
          image: courtData.image || '',
          iscovered: courtData.iscovered || false,
          location: courtData.location || null
        }])
        .select()
        .single();

      if (courtError) throw courtError;

      // Handle availability schedules
      if (courtData.schedules && courtData.schedules.length > 0) {
        const availabilityRecords = courtData.schedules.map(schedule => ({
          court_id: court.id,
          day_of_week: schedule.dayOfWeek,
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          valid_from: schedule.validFrom || new Date(),
          valid_until: schedule.validUntil || null,
          is_recurring: schedule.isRecurring ?? true
        }));

        const { error: availabilityError } = await db
          .from('court_availability')
          .insert(availabilityRecords);

        if (availabilityError) throw availabilityError;
      }

      return { data: court };
    } catch (error) {
      console.error('Error in createCourt:', error);
      return { error: 'Failed to create court' };
    }
  },

  async getAvailableSlots(courtId, date) {
    try {
      const { data, error } = await db
        .from('court_availability')
        .select('*')
        .eq('court_id', courtId)
        .and(`(
          (is_recurring = true AND (valid_until IS NULL OR valid_until >= :date)) OR
          (is_recurring = false AND valid_from <= :date AND (valid_until IS NULL OR valid_until >= :date))
        )`, { date });

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error in getAvailableSlots:', error);
      return { error: 'Failed to fetch available slots' };
    }
  },

  async bookCourt(matchId, { court_id, start_time, end_time }) {
    try {
      // Get today's date to combine with the time
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure we have proper timestamp format
      const startTime = start_time.includes('T') 
        ? start_time 
        : `${today}T${start_time}`;
      
      const endTime = end_time.includes('T') 
        ? end_time 
        : `${today}T${end_time}`;

      const { data, error } = await db
        .from('tournament_matches')
        .update({
          court_id,
          scheduled_start: startTime,
          scheduled_end: endTime
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error in bookCourt:', error);
      return { error: error.message || 'Failed to book court' };
    }
  }
}; 