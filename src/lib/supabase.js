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

  // Pickup Locations
  async getPickupLocations() {
    const { data, error } = await supabase
      .from('pickup_locations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createPickupLocation(locationData) {
    const { data, error } = await supabase
      .from('pickup_locations')
      .insert([locationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Hospital Locations
  async getHospitalLocations() {
    const { data, error } = await supabase
      .from('hospital_locations')
      .select('*')
      .order('name', { ascending: true })
    
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
        ),
        pickup_locations (
          id,
          name,
          latitude,
          longitude
        ),
        hospital_locations (
          id,
          name,
          address,
          latitude,
          longitude
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
        ),
        pickup_locations (
          id,
          name,
          latitude,
          longitude
        ),
        hospital_locations (
          id,
          name,
          address,
          latitude,
          longitude
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
        ),
        pickup_locations (
          id,
          name,
          latitude,
          longitude
        ),
        hospital_locations (
          id,
          name,
          address,
          latitude,
          longitude
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
        ),
        pickup_locations (
          id,
          name,
          latitude,
          longitude
        ),
        hospital_locations (
          id,
          name,
          address,
          latitude,
          longitude
        )
      `)
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Google Maps helper functions
export const mapsHelper = {
  async calculateRoute(origin, destination) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    const directionsService = new window.google.maps.DirectionsService()
    
    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === 'OK') {
            const route = result.routes[0]
            const leg = route.legs[0]
            
            resolve({
              distance: leg.distance.text,
              duration: leg.duration.text,
              polyline: route.overview_polyline,
              steps: leg.steps
            })
          } else {
            reject(new Error(`Directions request failed: ${status}`))
          }
        }
      )
    })
  },

  async geocodeAddress(address) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    const geocoder = new window.google.maps.Geocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  },

  async reverseGeocode(lat, lng) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    const geocoder = new window.google.maps.Geocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address)
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`))
        }
      })
    })
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