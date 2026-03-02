-- EcoTrek Database Schema

-- 1. Create Users Table
-- This table automatically links to Supabase Auth via the id field
CREATE TABLE IF NOT EXISTS public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text default 'driver' check (role in ('driver', 'admin')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create/Update Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  make text not null,
  model text not null,
  year integer,
  vehicle_number text,
  fuel_type text check (fuel_type in ('Petrol', 'Diesel', 'Hybrid', 'EV')) not null,
  avg_l_100km numeric
);

-- Migration: Rename avg_mpg to avg_l_100km if it exists
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicles' AND column_name='avg_mpg') THEN
    ALTER TABLE public.vehicles RENAME COLUMN avg_mpg TO avg_l_100km;
  END IF;
END $$;

-- 3. Create/Update Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  distance_km numeric not null,
  co2_kg numeric not null,
  fuel_type text, -- Optional, if logged without a specific vehicle
  log_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migration: Rename distance_miles to distance_km if it exists
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trips' AND column_name='distance_miles') THEN
    ALTER TABLE public.trips RENAME COLUMN distance_miles TO distance_km;
  END IF;
END $$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Users: Can read their own data. Admins can read all.
-- Users: Anyone can insert (for profile sync), and users can view their own data.
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
CREATE POLICY "Anyone can insert users" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- Vehicles: Permissive insert for now, users manage their own for other actions.
DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
CREATE POLICY "Users can view own vehicles" 
ON public.vehicles FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert vehicles" ON public.vehicles;
CREATE POLICY "Anyone can insert vehicles" 
ON public.vehicles FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
CREATE POLICY "Users can update own vehicles" 
ON public.vehicles FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;
CREATE POLICY "Users can delete own vehicles" 
ON public.vehicles FOR DELETE 
USING (auth.uid() = user_id);

-- Trips: Permissive insert for now, users manage their own for other actions.
DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips" 
ON public.trips FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert trips" ON public.trips;
CREATE POLICY "Anyone can insert trips" 
ON public.trips FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips" 
ON public.trips FOR DELETE 
USING (auth.uid() = user_id);

-- Note: Admin policies can be added later as needed. For now, we will handle global reads via a service role key or dedicated admin RPC if required.

-- 6. Trigger to automatically create a profile in public.users when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'driver');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
