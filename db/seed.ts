import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_INSTITUTIONS,
  DEFAULT_CATEGORIES,
  DEFAULT_UNIFORMS,
  DEFAULT_NOTICES,
  DEFAULT_GALLERY,
  DEFAULT_CONTACT_SUBMISSIONS,
  DEFAULT_SETTINGS
} from '../src/data/defaultData';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false // Required for Neon
  }
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to NeonDB. Initializing schema...');
    
    // 1. Read and execute schema.sql
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Schema tables verified/created successfully.');

    // 2. Clear existing records to allow re-seeding safely
    console.log('Clearing old data...');
    await client.query('TRUNCATE TABLE uniforms, notices, gallery, contacts, website_settings, hero_slides, institutions, categories CASCADE;');

    // 3. Seed categories
    console.log(`Seeding ${DEFAULT_CATEGORIES.length} categories...`);
    for (const cat of DEFAULT_CATEGORIES) {
      await client.query(
        'INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3)',
        [cat.id, cat.name, cat.slug]
      );
    }

    // 4. Seed institutions
    console.log(`Seeding ${DEFAULT_INSTITUTIONS.length} institutions...`);
    for (const inst of DEFAULT_INSTITUTIONS) {
      await client.query(
        `INSERT INTO institutions (
          id, name, slug, logo, banner, address, city, state, pincode, 
          website, email, phone, description, mission, vision, 
          is_verified, is_suspended, is_trusted, is_featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          inst.id, inst.name, inst.slug, inst.logo, inst.banner, inst.address, inst.city, inst.state, inst.pincode,
          inst.website, inst.email, inst.phone, inst.description, inst.mission, inst.vision,
          inst.isVerified, inst.isSuspended, inst.isTrusted || false, inst.isFeatured || false
        ]
      );
    }

    // 5. Seed hero slides
    console.log(`Seeding ${DEFAULT_HERO_SLIDES.length} hero slides...`);
    for (const slide of DEFAULT_HERO_SLIDES) {
      await client.query(
        `INSERT INTO hero_slides (
          id, title, subtitle, description, image, button_text, button_link, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          slide.id, slide.title, slide.subtitle, slide.description, slide.image,
          slide.buttonText, slide.buttonLink, slide.displayOrder, slide.isActive
        ]
      );
    }

    // 6. Seed uniforms
    console.log(`Seeding ${DEFAULT_UNIFORMS.length} uniforms...`);
    for (const uni of DEFAULT_UNIFORMS) {
      await client.query(
        `INSERT INTO uniforms (
          id, institution_id, name, sku, category_id, gender, description, 
          fabric_type, price, discount_price, available_sizes, stock_quantity, is_archived, images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          uni.id, uni.institutionId, uni.name, uni.sku, uni.categoryId, uni.gender, uni.description,
          uni.fabricType, uni.price, uni.discountPrice || null, uni.availableSizes, uni.stockQuantity,
          uni.isArchived, JSON.stringify(uni.images)
        ]
      );
    }

    // 7. Seed notices
    console.log(`Seeding ${DEFAULT_NOTICES.length} notices...`);
    for (const notice of DEFAULT_NOTICES) {
      await client.query(
        `INSERT INTO notices (
          id, institution_id, title, description, attachment, publish_date
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          notice.id, notice.institutionId, notice.title, notice.description, notice.attachment || null, notice.publishDate
        ]
      );
    }

    // 8. Seed gallery
    console.log(`Seeding ${DEFAULT_GALLERY.length} gallery items...`);
    for (const gal of DEFAULT_GALLERY) {
      await client.query(
        'INSERT INTO gallery (id, institution_id, image, title, category) VALUES ($1, $2, $3, $4, $5)',
        [gal.id, gal.institutionId, gal.image, gal.title, gal.category]
      );
    }

    // 9. Seed contacts
    console.log(`Seeding ${DEFAULT_CONTACT_SUBMISSIONS.length} contact submissions...`);
    for (const contact of DEFAULT_CONTACT_SUBMISSIONS) {
      await client.query(
        `INSERT INTO contacts (
          id, name, email, institution_name, message, date, is_read
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          contact.id, contact.name, contact.email, contact.institutionName || null, contact.message, contact.date, contact.isRead
        ]
      );
    }

    // 10. Seed website settings
    console.log('Seeding global website settings...');
    await client.query(
      `INSERT INTO website_settings (
        id, logo_image, logo_text, logo_sub_text, favicon, contact_email, 
        contact_phone, contact_address, whatsapp_number, social_links, seo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        'global', DEFAULT_SETTINGS.logoImage || null, DEFAULT_SETTINGS.logoText, DEFAULT_SETTINGS.logoSubText,
        DEFAULT_SETTINGS.favicon, DEFAULT_SETTINGS.contactEmail, DEFAULT_SETTINGS.contactPhone,
        DEFAULT_SETTINGS.contactAddress, DEFAULT_SETTINGS.whatsappNumber,
        JSON.stringify(DEFAULT_SETTINGS.socialLinks), JSON.stringify(DEFAULT_SETTINGS.seo)
      ]
    );

    console.log('Database seeding finished successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
