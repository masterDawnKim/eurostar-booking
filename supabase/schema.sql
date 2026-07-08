-- Eurostar Booking System DB Schema

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  eurostar_reference VARCHAR(10) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'provisional',

  -- Journey info
  origin_uic VARCHAR(20) NOT NULL,
  origin_name VARCHAR(100),
  destination_uic VARCHAR(20) NOT NULL,
  destination_name VARCHAR(100),
  outbound_date DATE NOT NULL,
  inbound_date DATE,
  outbound_service VARCHAR(20),
  inbound_service VARCHAR(20),

  -- Financial
  currency VARCHAR(3) NOT NULL DEFAULT 'GBP',
  total_amount DECIMAL(10, 2),
  paid_amount DECIMAL(10, 2) DEFAULT 0,

  -- Customer
  customer_first_name VARCHAR(100),
  customer_last_name VARCHAR(100),
  customer_email VARCHAR(255),

  -- Metadata
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Passengers table
CREATE TABLE passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  eurostar_passenger_id VARCHAR(20) NOT NULL,
  type VARCHAR(5) NOT NULL, -- AD, SR, YH, CH
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone_country_code VARCHAR(5),
  phone_number VARCHAR(20),
  loyalty_number VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  eurostar_payment_id VARCHAR(20),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  reference VARCHAR(100),
  method VARCHAR(10),
  status VARCHAR(20) DEFAULT 'pending',
  transaction_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking items (products/tickets)
CREATE TABLE booking_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_ref VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL, -- outbound, inbound
  service_name VARCHAR(20),
  service_type VARCHAR(10),
  origin_uic VARCHAR(20),
  destination_uic VARCHAR(20),
  departure_time TIME,
  arrival_time TIME,
  departure_date DATE,
  product_name VARCHAR(100),
  tariff_code VARCHAR(30),
  passenger_id VARCHAR(20),
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cancellations/refunds log
CREATE TABLE cancellations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_refs TEXT[],
  refund_amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status VARCHAR(20) DEFAULT 'provisional', -- provisional, confirmed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Exchange/rebook history
CREATE TABLE exchanges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  original_service VARCHAR(20),
  new_service VARCHAR(20),
  original_date DATE,
  new_date DATE,
  price_difference DECIMAL(10, 2),
  currency VARCHAR(3),
  status VARCHAR(20) DEFAULT 'provisional',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_bookings_reference ON bookings(eurostar_reference);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_passengers_booking ON passengers(booking_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
