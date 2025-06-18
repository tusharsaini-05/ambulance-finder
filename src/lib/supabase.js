import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export const db = {
  // Users
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Drivers
  async getAvailableDrivers(location) {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users (
          id,
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('is_available', true)
      .eq('is_verified', true)
    
    if (error) throw error
    return data
  },

  async updateDriverLocation(driverId, location) {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        current_location: location,
        last_location_update: new Date().toISOString()
      })
      .eq('id', driverId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Bookings
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        users (
          id,
          full_name,
          phone
        ),
        drivers (
          id,
          vehicle_number,
          vehicle_type,
          users (
            id,
            full_name,
            phone
          )
        )
      `)
      .single()
    
    if (error) throw error
    return data
  },

  async getBooking(bookingId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (
          id,
          full_name,
          phone,
          avatar_url
        ),
        drivers (
          id,
          vehicle_number,
          vehicle_type,
          current_location,
          users (
            id,
            full_name,
            phone,
            avatar_url
          )
        )
      `)
      .eq('id', bookingId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateBookingStatus(bookingId, status, updates = {}) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserBookings(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        drivers (
          id,
          vehicle_number,
          vehicle_type,
          users (
            id,
            full_name,
            phone
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getDriverBookings(driverId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (
          id,
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to booking updates
  subscribeToBooking(bookingId, callback) {
    return supabase
      .channel(`booking:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to driver location updates
  subscribeToDriverLocation(driverId, callback) {
    return supabase
      .channel(`driver:${driverId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${driverId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to new bookings for drivers
  subscribeToNewBookings(callback) {
    return supabase
      .channel('new-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        callback
      )
      .subscribe()
  }
}