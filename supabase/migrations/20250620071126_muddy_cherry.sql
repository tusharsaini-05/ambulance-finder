/*
  # Create pickup locations table

  1. New Tables
    - `pickup_locations`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `latitude` (double precision, not null)
      - `longitude` (double precision, not null)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `pickup_locations` table
    - Add policy for authenticated users to read all pickup locations
    - Add policy for authenticated users to insert new pickup locations
*/

CREATE TABLE IF NOT EXISTS pickup_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pickup locations"
  ON pickup_locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pickup locations"
  ON pickup_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pickup_locations_created_at ON pickup_locations(created_at DESC);