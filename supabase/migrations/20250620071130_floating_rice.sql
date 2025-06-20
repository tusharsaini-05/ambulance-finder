/*
  # Create hospital locations table

  1. New Tables
    - `hospital_locations`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `address` (text)
      - `latitude` (double precision, not null)
      - `longitude` (double precision, not null)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `hospital_locations` table
    - Add policy for authenticated users to read all hospital locations

  3. Sample Data
    - Insert some sample hospital locations
*/

CREATE TABLE IF NOT EXISTS hospital_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospital_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hospital locations"
  ON hospital_locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hospital_locations_name ON hospital_locations(name);

-- Insert sample hospital data (you can modify these based on your location)
INSERT INTO hospital_locations (name, address, latitude, longitude) VALUES
  ('City General Hospital', '123 Main Street, Downtown', 40.7589, -73.9851),
  ('St. Mary Medical Center', '456 Oak Avenue, Midtown', 40.7505, -73.9934),
  ('Emergency Care Hospital', '789 Pine Road, Uptown', 40.7831, -73.9712),
  ('Metropolitan Health Center', '321 Elm Street, East Side', 40.7282, -73.9942),
  ('Riverside Medical Complex', '654 River Drive, West End', 40.7614, -74.0055),
  ('Central Emergency Hospital', '987 Central Park West', 40.7829, -73.9654)
ON CONFLICT DO NOTHING;