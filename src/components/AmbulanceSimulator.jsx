"use client"

import { useEffect, useState } from "react"
import socketService from "../lib/socket"
import { Car, Play, Pause, RotateCcw } from "lucide-react"

const AmbulanceSimulator = ({ ambulanceId = "AMB-001", bookingId = null }) => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
    lng: -74.006 + (Math.random() - 0.5) * 0.1,
  })
  const [targetLocation, setTargetLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
  })

  useEffect(() => {
    // Connect ambulance to socket
    socketService.connect()
    socketService.connectAsAmbulance(ambulanceId, "driver-001")

    return () => {
      setIsSimulating(false)
    }
  }, [ambulanceId])

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setCurrentLocation((prev) => {
        // Calculate direction to target
        const deltaLat = targetLocation.lat - prev.lat
        const deltaLng = targetLocation.lng - prev.lng

        // Move towards target (small steps)
        const moveSpeed = 0.001
        const newLat = prev.lat + deltaLat * moveSpeed
        const newLng = prev.lng + deltaLng * moveSpeed

        const newLocation = { lat: newLat, lng: newLng }

        // Send location update via socket
        socketService.updateAmbulanceLocation(ambulanceId, newLocation, bookingId)

        return newLocation
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isSimulating, targetLocation, ambulanceId, bookingId])

  const startSimulation = () => {
    setIsSimulating(true)
  }

  const stopSimulation = () => {
    setIsSimulating(false)
  }

  const resetLocation = () => {
    setCurrentLocation({
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.006 + (Math.random() - 0.5) * 0.1,
    })
  }

  const setRandomTarget = () => {
    setTargetLocation({
      lat: 40.7128 + (Math.random() - 0.5) * 0.05,
      lng: -74.006 + (Math.random() - 0.5) * 0.05,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Car className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Ambulance Simulator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Ambulance ID: {ambulanceId}</p>
          {bookingId && <p className="text-sm text-gray-600">Booking ID: {bookingId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Current Location:</p>
            <p className="text-gray-600">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Target Location:</p>
            <p className="text-gray-600">
              {targetLocation.lat.toFixed(6)}, {targetLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {!isSimulating ? (
            <button onClick={startSimulation} className="btn btn-primary btn-sm flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>Start</span>
            </button>
          ) : (
            <button onClick={stopSimulation} className="btn btn-secondary btn-sm flex items-center space-x-1">
              <Pause className="h-4 w-4" />
              <span>Stop</span>
            </button>
          )}

          <button onClick={resetLocation} className="btn btn-secondary btn-sm flex items-center space-x-1">
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>

          <button onClick={setRandomTarget} className="btn btn-secondary btn-sm">
            Random Target
          </button>
        </div>

        <div
          className={`px-3 py-2 rounded-md text-sm ${
            isSimulating ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          Status: {isSimulating ? "Simulating movement" : "Stopped"}
        </div>
      </div>
    </div>
  )
}

export default AmbulanceSimulator
