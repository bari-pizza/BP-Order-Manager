-- Bari Pizza Database Migration
-- Simplified and tested

-- Create enum types
CREATE TYPE drawer_type AS ENUM ('driver', 'register', 'third_party', 'unassigned');
CREATE TYPE order_type AS ENUM ('delivery', 'pickup');
CREATE TYPE payment_type AS ENUM ('cash', 'card', 'third_party');
CREATE TYPE transfer_type AS ENUM ('bank', 'payment', 'other');

-- Profile table
CREATE TABLE "Profile" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    phone text,
    is_admin boolean DEFAULT false NOT NULL,
    is_manager boolean DEFAULT false NOT NULL,
    avatar_src text,
    is_cashier boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    locale text DEFAULT 'en' NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Drawer table
CREATE TABLE "Drawer" (
    drawer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    drawer_type drawer_type NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Driver table
CREATE TABLE "Driver" (
    driver_id uuid PRIMARY KEY REFERENCES "Profile"(id),
    drawer_id uuid NOT NULL REFERENCES "Drawer"(drawer_id),
    is_deleted boolean DEFAULT false NOT NULL
);

-- OrderOrigin table
CREATE TABLE "OrderOrigin" (
    origin_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    icon text,
    logo_src text,
    color text,
    can_deliver boolean DEFAULT false NOT NULL,
    can_tip boolean DEFAULT false NOT NULL,
    has_order_number boolean DEFAULT false NOT NULL,
    default_is_prepaid boolean DEFAULT false NOT NULL,
    is_prepaid_toggleable boolean DEFAULT false NOT NULL,
    is_third_party boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Order table
CREATE TABLE "Order" (
    order_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number integer,
    order_type order_type NOT NULL,
    origin_id uuid NOT NULL REFERENCES "OrderOrigin"(origin_id),
    drawer_id uuid REFERENCES "Drawer"(drawer_id),
    business_date date NOT NULL,
    customer_name text,
    phone text,
    address text,
    total_in_cents integer NOT NULL,
    delivery_fee_in_cents integer DEFAULT 0 NOT NULL,
    special_instructions text,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Payment table
CREATE TABLE "Payment" (
    payment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES "Order"(order_id) ON DELETE CASCADE,
    payment_type payment_type NOT NULL,
    amount_in_cents integer NOT NULL,
    tip_in_cents integer DEFAULT 0 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- BusinessDayDriver table
CREATE TABLE "BusinessDayDriver" (
    business_date date NOT NULL,
    drawer_id uuid NOT NULL REFERENCES "Drawer"(drawer_id),
    PRIMARY KEY (business_date, drawer_id)
);

-- BusinessDayDrawer table
CREATE TABLE "BusinessDayDrawer" (
    drawer_id uuid NOT NULL REFERENCES "Drawer"(drawer_id),
    business_date date NOT NULL,
    bank_in_cents integer DEFAULT 0 NOT NULL,
    hours smallint DEFAULT 0 NOT NULL,
    hours_in_cents integer DEFAULT 0 NOT NULL,
    other_in_cents integer DEFAULT 0 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    special_note text DEFAULT '' NOT NULL,
    PRIMARY KEY (drawer_id, business_date)
);

-- BusinessDaySummary table
CREATE TABLE "BusinessDaySummary" (
    business_date date PRIMARY KEY,
    is_locked boolean DEFAULT false NOT NULL
);

-- CashTransfer table
CREATE TABLE "CashTransfer" (
    cash_transfer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    business_date date NOT NULL,
    source uuid REFERENCES "Drawer"(drawer_id),
    destination uuid REFERENCES "Drawer"(drawer_id),
    amount_in_cents integer DEFAULT 0 NOT NULL,
    title text DEFAULT '' NOT NULL,
    special_note text DEFAULT '' NOT NULL,
    transfer_type transfer_type NOT NULL
);

-- AppSetting table
CREATE TABLE "AppSetting" (
    id serial PRIMARY KEY,
    setting_name text NOT NULL UNIQUE,
    setting_value text NOT NULL,
    setting_type text NOT NULL
);

-- Resource table
CREATE TABLE "Resource" (
    resource_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    src text NOT NULL,
    bucket_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- GlobalChangeTracker table
CREATE TABLE "GlobalChangeTracker" (
    id serial PRIMARY KEY,
    last_updated timestamptz DEFAULT now() NOT NULL
);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
