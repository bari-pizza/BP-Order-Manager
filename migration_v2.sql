-- Bari Pizza Database Migration
-- Complete schema with proper enums

-- Create custom types
CREATE TYPE public.drawer_type AS ENUM (
    'driver',
    'register',
    'third_party',
    'unassigned'
);

CREATE TYPE public.order_type AS ENUM (
    'delivery',
    'pickup'
);

CREATE TYPE public.payment_type AS ENUM (
    'cash',
    'card',
    'third_party'
);

CREATE TYPE public.transfer_type AS ENUM (
    'bank',
    'payment',
    'other'
);

-- Create tables
CREATE TABLE public."Profile" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    phone text,
    is_admin boolean DEFAULT false NOT NULL,
    is_manager boolean DEFAULT false NOT NULL,
    avatar_src text,
    is_cashier boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    locale text DEFAULT 'en'::text NOT NULL
);

CREATE TABLE public."AppSetting" (
    id bigint NOT NULL,
    setting_name text NOT NULL,
    setting_value text NOT NULL,
    setting_type text NOT NULL
);

CREATE TABLE public."BusinessDayDrawer" (
    drawer_id uuid NOT NULL,
    business_date date NOT NULL,
    bank_in_cents integer DEFAULT 0 NOT NULL,
    hours smallint DEFAULT '0'::smallint NOT NULL,
    hours_in_cents integer DEFAULT 0 NOT NULL,
    other_in_cents integer DEFAULT 0 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    special_note text DEFAULT ''::text NOT NULL
);

CREATE TABLE public."BusinessDayDriver" (
    business_date date NOT NULL,
    drawer_id uuid NOT NULL
);

CREATE TABLE public."BusinessDaySummary" (
    business_date date NOT NULL,
    is_locked boolean DEFAULT false NOT NULL
);

CREATE TABLE public."CashTransfer" (
    cash_transfer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    business_date date NOT NULL,
    source uuid,
    destination uuid,
    amount_in_cents integer DEFAULT 0 NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    special_note text DEFAULT ''::text NOT NULL,
    transfer_type public.transfer_type NOT NULL
);

CREATE TABLE public."Drawer" (
    drawer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    drawer_type public.drawer_type NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);

CREATE TABLE public."Driver" (
    drawer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    driver_id uuid,
    is_deleted boolean DEFAULT false NOT NULL
);

CREATE TABLE public."GlobalChangeTracker" (
    table_name text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."Order" (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    order_number smallint,
    order_type public.order_type DEFAULT 'delivery'::public.order_type NOT NULL,
    drawer_id uuid,
    business_date date NOT NULL,
    total_in_cents integer DEFAULT 0 NOT NULL,
    phone character varying DEFAULT ''::character varying,
    order_name text,
    origin_id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_fee_in_cents smallint DEFAULT '0'::smallint NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    last_updated_by uuid
);

CREATE TABLE public."OrderOrigin" (
    name text NOT NULL,
    can_tip boolean DEFAULT true NOT NULL,
    can_deliver boolean DEFAULT true NOT NULL,
    icon text DEFAULT ''::text,
    is_third_party boolean DEFAULT true NOT NULL,
    default_is_prepaid boolean DEFAULT true NOT NULL,
    is_prepaid_toggleable boolean DEFAULT false NOT NULL,
    has_order_number boolean DEFAULT false NOT NULL,
    origin_id uuid DEFAULT gen_random_uuid() NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);

CREATE TABLE public."Payment" (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    order_id uuid NOT NULL,
    payment_type public.payment_type NOT NULL,
    amount_in_cents integer DEFAULT 0 NOT NULL,
    tip_in_cents integer DEFAULT 0 NOT NULL,
    special_note text DEFAULT ''::text NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    business_date date NOT NULL,
    last_updated_by uuid
);

CREATE TABLE public."Resource" (
    title text NOT NULL,
    src text
);

-- Add constraints
BusinessDayDrawer
BusinessDayDriver
BusinessDaySummary
CashTransfer
Drawer
GlobalChangeTracker
OrderOrigin
Profile
Resource
AppSetting
Driver
Order
Payment
Profile
BusinessDayDrawer
CashTransfer
CashTransfer
Order
Order
Payment
BusinessDayDriver
Driver
Driver
Order
Payment
Profile
