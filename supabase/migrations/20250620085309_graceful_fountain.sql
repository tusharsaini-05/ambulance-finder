/*
  # Fix bookings table schema and add ambulance system

  1. Schema Updates
    - Make old location columns nullable
    - Add ambulance assignment system
    - Update constraints

  2. New Tables
    - `ambulances` table for vehicle management
    - Updated booking flow

  3. Security
    - Maintain existing RLS policies
    - Add policies for new tables
*/

-- First, make the old location columns nullable to avoid conflicts
ALTER TABLE bookings 
  ALTER COLUMN pickup_location DROP NOT NULL,
  ALTER COLUMN dropoff_location DROP NOT NULL;

-- Create ambulances table
CREATE TABLE IF NOT EXISTS ambulances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id),
  vehicle_number text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'ambulance',
  current_lat double precision,
  current_lng double precision,
  is_available boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on ambulances
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;

-- RLS policies for ambulances
CREATE POLICY "Authenticated users can read ambulances"
  ON ambulances
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can update their own ambulance"
  ON ambulances
  FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid());

-- Add ambulance_id to bookings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'ambulance_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN ambulance_id uuid REFERENCES ambulances(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ambulances_driver_id ON ambulances(driver_id);
CREATE INDEX IF NOT EXISTS idx_ambulances_available ON ambulances(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_ambulances_location ON ambulances(current_lat, current_lng) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_bookings_ambulance_id ON bookings(ambulance_id);

-- Insert sample ambulances (linked to existing drivers if any)
INSERT INTO ambulances (vehicle_number, vehicle_type, current_lat, current_lng, is_available, is_verified) VALUES
  ('AMB-001', 'ambulance', 40.7589, -73.9851, true, true),
  ('AMB-002', 'ambulance', 40.7505, -73.9934, true, true),
  ('AMB-003', 'emergency_van', 40.7831, -73.9712, true, true),
  ('AMB-004', 'ambulance', 40.7282, -73.9942, false, true),
  ('AMB-005', 'medical_transport', 40.7614, -74.0055, true, true)
ON CONFLICT DO NOTHING;