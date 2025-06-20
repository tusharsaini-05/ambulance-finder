/*
  # Update bookings table for location references

  1. Changes
    - Add foreign key references to pickup_locations and hospital_locations
    - Keep existing location fields for backward compatibility
    - Add route information fields

  2. New Columns
    - `pickup_location_id` (uuid, foreign key to pickup_locations)
    - `hospital_location_id` (uuid, foreign key to hospital_locations)
    - `route_distance` (text, for storing distance like "5.2 km")
    - `route_duration` (text, for storing duration like "12 mins")
    - `route_polyline` (text, for storing encoded polyline from Google Maps)
*/

DO $$
BEGIN
  -- Add pickup_location_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'pickup_location_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN pickup_location_id uuid REFERENCES pickup_locations(id);
  END IF;

  -- Add hospital_location_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'hospital_location_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN hospital_location_id uuid REFERENCES hospital_locations(id);
  END IF;

  -- Add route_distance column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'route_distance'
  ) THEN
    ALTER TABLE bookings ADD COLUMN route_distance text;
  END IF;

  -- Add route_duration column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'route_duration'
  ) THEN
    ALTER TABLE bookings ADD COLUMN route_duration text;
  END IF;

  -- Add route_polyline column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'route_polyline'
  ) THEN
    ALTER TABLE bookings ADD COLUMN route_polyline text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_location_id ON bookings(pickup_location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hospital_location_id ON bookings(hospital_location_id);