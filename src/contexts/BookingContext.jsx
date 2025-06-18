import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db, subscriptions } from '../lib/supabase'

const BookingContext = createContext({})

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

// Booking reducer
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload }
    
    case 'UPDATE_BOOKING':
      return {
        ...state,
        currentBooking: state.currentBooking?.id === action.payload.id 
          ? { ...state.currentBooking, ...action.payload }
          : state.currentBooking,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id 
            ? { ...booking, ...action.payload }
            : booking
        )
      }
    
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload }
    
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        currentBooking: action.payload
      }
    
    case 'UPDATE_DRIVER_LOCATION':
      return {
        ...state,
        currentBooking: state.currentBooking?.driver_id === action.payload.driverId
          ? {
              ...state.currentBooking,
              drivers: {
                ...state.currentBooking.drivers,
                current_location: action.payload.location
              }
            }
          : state.currentBooking
      }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

const initialState = {
  currentBooking: null,
  bookings: [],
  loading: false,
  error: null
}

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  const { user, userProfile, isDriver } = useAuth()

  // Load user bookings on mount
  useEffect(() => {
    if (user && userProfile) {
      loadBookings()
    }
  }, [user, userProfile])

  // Subscribe to real-time updates for current booking
  useEffect(() => {
    if (state.currentBooking) {
      const subscription = subscriptions.subscribeToBooking(
        state.currentBooking.id,
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'UPDATE_BOOKING', payload: payload.new })
          }
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [state.currentBooking?.id])

  // Subscribe to driver location updates
  useEffect(() => {
    if (state.currentBooking?.driver_id && !isDriver) {
      const subscription = subscriptions.subscribeToDriverLocation(
        state.currentBooking.driver_id,
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new.current_location) {
            dispatch({
              type: 'UPDATE_DRIVER_LOCATION',
              payload: {
                driverId: payload.new.id,
                location: payload.new.current_location
              }
            })
          }
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [state.currentBooking?.driver_id, isDriver])

  const loadBookings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      let bookings
      if (isDriver) {
        bookings = await db.getDriverBookings(user.id)
      } else {
        bookings = await db.getUserBookings(user.id)
      }
      
      dispatch({ type: 'SET_BOOKINGS', payload: bookings })
      
      // Set current booking if there's an active one
      const activeBooking = bookings.find(booking => 
        ['pending', 'accepted', 'en_route', 'arrived'].includes(booking.status)
      )
      
      if (activeBooking) {
        dispatch({ type: 'SET_CURRENT_BOOKING', payload: activeBooking })
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const booking = await db.createBooking({
        ...bookingData,
        user_id: user.id,
        status: 'pending'
      })

      dispatch({ type: 'ADD_BOOKING', payload: booking })
      return booking

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateBookingStatus = async (bookingId, status, updates = {}) => {
    try {
      const updatedBooking = await db.updateBookingStatus(bookingId, status, updates)
      dispatch({ type: 'UPDATE_BOOKING', payload: updatedBooking })
      return updatedBooking
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const acceptBooking = async (bookingId) => {
    return updateBookingStatus(bookingId, 'accepted', {
      driver_id: user.id,
      accepted_at: new Date().toISOString()
    })
  }

  const startTrip = async (bookingId) => {
    return updateBookingStatus(bookingId, 'en_route', {
      started_at: new Date().toISOString()
    })
  }

  const arriveAtPickup = async (bookingId) => {
    return updateBookingStatus(bookingId, 'arrived', {
      arrived_at: new Date().toISOString()
    })
  }

  const completeTrip = async (bookingId) => {
    return updateBookingStatus(bookingId, 'completed', {
      completed_at: new Date().toISOString()
    })
  }

  const cancelBooking = async (bookingId, reason = '') => {
    return updateBookingStatus(bookingId, 'cancelled', {
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason
    })
  }

  const getBookingById = async (bookingId) => {
    try {
      const booking = await db.getBooking(bookingId)
      return booking
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    loadBookings,
    createBooking,
    updateBookingStatus,
    acceptBooking,
    startTrip,
    arriveAtPickup,
    completeTrip,
    cancelBooking,
    getBookingById,
    clearError
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}