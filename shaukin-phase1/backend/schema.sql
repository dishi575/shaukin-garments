-- Shaukin Garments — PostgreSQL Schema
-- Run this once on your Railway PostgreSQL instance

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'b2b_client', 'retail_customer');

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    whatsapp    VARCHAR(20),
    password_hash TEXT NOT NULL,
    role        user_role NOT NULL DEFAULT 'retail_customer',
    company     VARCHAR(200),           -- for B2B clients
    gst_number  VARCHAR(20),            -- for B2B clients
    address     TEXT,
    city        VARCHAR(100),
    state       VARCHAR(100),
    pincode     VARCHAR(10),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,          -- e.g. "Hospital", "School"
    slug        VARCHAR(100) UNIQUE NOT NULL,   -- e.g. "hospital", "school"
    description TEXT,
    icon        VARCHAR(50),                    -- Tabler icon name
    image_url   TEXT,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
CREATE TYPE product_type AS ENUM ('uniform', 'linen', 'accessory', 'saree', 'other');

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT,
    product_type    product_type DEFAULT 'uniform',
    fabric          VARCHAR(100),               -- e.g. "Cotton", "Polyester blend"
    available_sizes TEXT[],                     -- e.g. ['S','M','L','XL','XXL']
    available_colors TEXT[],                    -- e.g. ['White','Sky blue']
    price_retail    NUMERIC(10,2) NOT NULL,     -- per piece, individual
    price_bulk      NUMERIC(10,2),              -- per piece, bulk rate
    moq             INT DEFAULT 10,             -- minimum order quantity
    stock           INT DEFAULT 0,
    images          TEXT[],                     -- Cloudinary URLs
    is_bulk_available   BOOLEAN DEFAULT TRUE,
    is_retail_available BOOLEAN DEFAULT TRUE,
    is_active       BOOLEAN DEFAULT TRUE,
    meta_tags       TEXT[],                     -- for ML / search
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BULK QUOTE REQUESTS ──────────────────────────────────────────────────────
CREATE TYPE quote_status AS ENUM ('pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'expired');

CREATE TABLE bulk_quotes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    -- guest quotes (no account)
    guest_name      VARCHAR(120),
    guest_email     VARCHAR(255),
    guest_phone     VARCHAR(20),
    guest_company   VARCHAR(200),
    -- quote details
    status          quote_status DEFAULT 'pending',
    items           JSONB NOT NULL,             -- [{product_id, name, qty, sizes:{S:5,M:10}}]
    delivery_address TEXT,
    delivery_city   VARCHAR(100),
    delivery_state  VARCHAR(100),
    delivery_pincode VARCHAR(10),
    notes           TEXT,
    -- admin response
    quoted_amount   NUMERIC(12,2),
    admin_notes     TEXT,
    valid_until     DATE,
    -- tracking
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TYPE order_type   AS ENUM ('retail', 'bulk');
CREATE TYPE order_status AS ENUM ('placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    order_type      order_type DEFAULT 'retail',
    quote_id        UUID REFERENCES bulk_quotes(id) ON DELETE SET NULL,
    status          order_status DEFAULT 'placed',
    payment_status  payment_status DEFAULT 'pending',
    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    items           JSONB NOT NULL,             -- [{product_id, name, qty, size, color, price}]
    subtotal        NUMERIC(12,2) NOT NULL,
    discount        NUMERIC(12,2) DEFAULT 0,
    gst_amount      NUMERIC(12,2) DEFAULT 0,
    shipping        NUMERIC(10,2) DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL,
    delivery_address TEXT,
    delivery_city   VARCHAR(100),
    delivery_state  VARCHAR(100),
    delivery_pincode VARCHAR(10),
    tracking_number VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ML INTERACTIONS ──────────────────────────────────────────────────────────
CREATE TYPE interaction_type AS ENUM ('view', 'search', 'add_to_cart', 'quote_request', 'order', 'download_catalogue');

CREATE TABLE ml_interactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      VARCHAR(100),               -- for guest tracking
    product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    interaction     interaction_type NOT NULL,
    weight          FLOAT DEFAULT 1.0,          -- view=1, cart=3, order=5, quote=4
    metadata        JSONB,                      -- extra context
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SEED: CATEGORIES ─────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Hospital',        'hospital',     'Doctor coats, nurse uniforms, OT linens, scrubs',       'stethoscope',  1),
('School',          'school',       'Shirts, trousers, skirts, ties, blazers',                'school',       2),
('Petrol Pump',     'petrol-pump',  'Staff uniforms for petrol pump attendants',              'gas-station',  3),
('Industrial',      'industrial',   'Worker coveralls, safety vests, aprons',                 'tool',         4),
('Corporate Staff', 'corporate',    'Formal shirts, trousers, blazers for office staff',      'briefcase',    5),
('Linens',          'linens',       'Bedsheets, towels, OT drapes, pillow covers',            'bed',          6),
('Sarees',          'sarees',       'Cotton and synthetic sarees for staff and nursing',      'shirt',        7);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_active      ON products(is_active);
CREATE INDEX idx_orders_user          ON orders(user_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_bulk_quotes_user     ON bulk_quotes(user_id);
CREATE INDEX idx_bulk_quotes_status   ON bulk_quotes(status);
CREATE INDEX idx_ml_interactions_user ON ml_interactions(user_id);
CREATE INDEX idx_ml_interactions_prod ON ml_interactions(product_id);
CREATE INDEX idx_ml_interactions_sess ON ml_interactions(session_id);
