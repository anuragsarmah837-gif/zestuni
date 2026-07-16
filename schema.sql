-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo TEXT,
    banner TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    description TEXT,
    mission TEXT,
    vision TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    is_trusted BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image TEXT NOT NULL,
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- Uniforms Table
CREATE TABLE IF NOT EXISTS uniforms (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    gender VARCHAR(20) CHECK (gender IN ('boys', 'girls', 'unisex')),
    description TEXT,
    fabric_type VARCHAR(255),
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    available_sizes TEXT[] NOT NULL,
    stock_quantity INT DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    images JSONB NOT NULL,
    show_on_homepage BOOLEAN DEFAULT TRUE
);

-- Institution Notices Table
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment TEXT,
    publish_date DATE NOT NULL
);

-- Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    title VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('institution', 'campus', 'event', 'uniform'))
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255),
    message TEXT NOT NULL,
    date DATE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE
);

-- Website Settings Table
CREATE TABLE IF NOT EXISTS website_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global',
    logo_image TEXT,
    logo_text VARCHAR(255) NOT NULL,
    logo_sub_text VARCHAR(255),
    favicon VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    whatsapp_number VARCHAR(50),
    social_links JSONB NOT NULL,
    seo JSONB NOT NULL,
    CONSTRAINT single_row CHECK (id = 'global')
);
