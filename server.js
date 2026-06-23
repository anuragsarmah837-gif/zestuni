import express from 'express';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper: Run SQL query
const query = (text, params) => pool.query(text, params);

// GET /api/data - Fetch all initial database data
app.get('/api/data', async (req, res) => {
  try {
    const slidesResult = await query('SELECT * FROM hero_slides ORDER BY display_order ASC');
    const institutionsResult = await query('SELECT * FROM institutions');
    const categoriesResult = await query('SELECT * FROM categories');
    const uniformsResult = await query('SELECT * FROM uniforms');
    const noticesResult = await query('SELECT * FROM notices ORDER BY publish_date DESC');
    const galleryResult = await query('SELECT * FROM gallery');
    const contactsResult = await query('SELECT * FROM contacts ORDER BY date DESC');
    const settingsResult = await query("SELECT * FROM website_settings WHERE id = 'global'");

    // Map database properties (snake_case) to client properties (camelCase)
    const slides = slidesResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      image: row.image,
      buttonText: row.button_text,
      buttonLink: row.button_link,
      displayOrder: row.display_order,
      isActive: row.is_active
    }));

    const institutions = institutionsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo: row.logo,
      banner: row.banner,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      website: row.website,
      email: row.email,
      phone: row.phone,
      description: row.description,
      mission: row.mission,
      vision: row.vision,
      isVerified: row.is_verified,
      isSuspended: row.is_suspended,
      isTrusted: row.is_trusted,
      isFeatured: row.is_featured
    }));

    const categories = categoriesResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug
    }));

    const uniforms = uniformsResult.rows.map(row => ({
      id: row.id,
      institutionId: row.institution_id,
      name: row.name,
      sku: row.sku,
      categoryId: row.category_id,
      gender: row.gender,
      description: row.description,
      fabricType: row.fabric_type,
      price: parseFloat(row.price),
      discountPrice: row.discount_price ? parseFloat(row.discount_price) : undefined,
      availableSizes: row.available_sizes,
      stockQuantity: row.stock_quantity,
      isArchived: row.is_archived,
      images: row.images
    }));

    const notices = noticesResult.rows.map(row => ({
      id: row.id,
      institutionId: row.institution_id,
      title: row.title,
      description: row.description,
      attachment: row.attachment,
      publishDate: row.publish_date.toISOString().split('T')[0]
    }));

    const galleryItems = galleryResult.rows.map(row => ({
      id: row.id,
      institutionId: row.institution_id,
      image: row.image,
      title: row.title,
      category: row.category
    }));

    const contacts = contactsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      institutionName: row.institution_name,
      message: row.message,
      date: row.date.toISOString().split('T')[0],
      isRead: row.is_read
    }));

    const dbSettings = settingsResult.rows[0];
    const settings = dbSettings ? {
      logoImage: dbSettings.logo_image || '',
      logoText: dbSettings.logo_text,
      logoSubText: dbSettings.logo_sub_text,
      favicon: dbSettings.favicon,
      contactEmail: dbSettings.contact_email,
      contactPhone: dbSettings.contact_phone,
      contactAddress: dbSettings.contact_address,
      whatsappNumber: dbSettings.whatsapp_number,
      socialLinks: dbSettings.social_links,
      seo: dbSettings.seo
    } : null;

    res.json({
      slides,
      institutions,
      categories,
      uniforms,
      notices,
      galleryItems,
      contacts,
      settings
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// POST /api/contacts - Submit a new contact message
app.post('/api/contacts', async (req, res) => {
  try {
    const { id, name, email, institutionName, message, date, isRead } = req.body;
    await query(
      `INSERT INTO contacts (id, name, email, institution_name, message, date, is_read) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, name, email, institutionName || null, message, date, isRead || false]
    );
    res.status(251).json({ success: true });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// POST /api/sync - Sync admin modifications back to database
app.post('/api/sync', async (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (type === 'categories') {
      const ids = data.map(item => item.id);
      
      // 1. Insert/Update
      for (const item of data) {
        await client.query(
          `INSERT INTO categories (id, name, slug) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug`,
          [item.id, item.name, item.slug]
        );
      }
      // 2. Delete missing
      if (ids.length > 0) {
        await client.query('DELETE FROM categories WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM categories');
      }

    } else if (type === 'institutions') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO institutions (
            id, name, slug, logo, banner, address, city, state, pincode, 
            website, email, phone, description, mission, vision, 
            is_verified, is_suspended, is_trusted, is_featured
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO UPDATE SET 
            name = EXCLUDED.name, slug = EXCLUDED.slug, logo = EXCLUDED.logo, banner = EXCLUDED.banner,
            address = EXCLUDED.address, city = EXCLUDED.city, state = EXCLUDED.state, pincode = EXCLUDED.pincode,
            website = EXCLUDED.website, email = EXCLUDED.email, phone = EXCLUDED.phone, 
            description = EXCLUDED.description, mission = EXCLUDED.mission, vision = EXCLUDED.vision,
            is_verified = EXCLUDED.is_verified, is_suspended = EXCLUDED.is_suspended,
            is_trusted = EXCLUDED.is_trusted, is_featured = EXCLUDED.is_featured`,
          [
            item.id, item.name, item.slug, item.logo, item.banner, item.address, item.city, item.state, item.pincode,
            item.website, item.email, item.phone, item.description, item.mission, item.vision,
            item.isVerified, item.isSuspended, item.isTrusted || false, item.isFeatured || false
          ]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM institutions WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM institutions');
      }

    } else if (type === 'slides') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO hero_slides (
            id, title, subtitle, description, image, button_text, button_link, display_order, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
            image = EXCLUDED.image, button_text = EXCLUDED.button_text, button_link = EXCLUDED.button_link,
            display_order = EXCLUDED.display_order, is_active = EXCLUDED.is_active`,
          [
            item.id, item.title, item.subtitle, item.description, item.image,
            item.buttonText, item.buttonLink, item.displayOrder, item.isActive
          ]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM hero_slides WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM hero_slides');
      }

    } else if (type === 'uniforms') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO uniforms (
            id, institution_id, name, sku, category_id, gender, description, 
            fabric_type, price, discount_price, available_sizes, stock_quantity, is_archived, images
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET 
            institution_id = EXCLUDED.institution_id, name = EXCLUDED.name, sku = EXCLUDED.sku,
            category_id = EXCLUDED.category_id, gender = EXCLUDED.gender, description = EXCLUDED.description,
            fabric_type = EXCLUDED.fabric_type, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price,
            available_sizes = EXCLUDED.available_sizes, stock_quantity = EXCLUDED.stock_quantity,
            is_archived = EXCLUDED.is_archived, images = EXCLUDED.images`,
          [
            item.id, item.institutionId, item.name, item.sku, item.categoryId, item.gender, item.description,
            item.fabricType, item.price, item.discountPrice || null, item.availableSizes, item.stockQuantity,
            item.isArchived, JSON.stringify(item.images)
          ]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM uniforms WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM uniforms');
      }

    } else if (type === 'notices') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO notices (id, institution_id, title, description, attachment, publish_date)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET 
             institution_id = EXCLUDED.institution_id, title = EXCLUDED.title, 
             description = EXCLUDED.description, attachment = EXCLUDED.attachment, 
             publish_date = EXCLUDED.publish_date`,
          [item.id, item.institutionId, item.title, item.description, item.attachment || null, item.publishDate]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM notices WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM notices');
      }

    } else if (type === 'galleryItems') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO gallery (id, institution_id, image, title, category) 
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET 
             institution_id = EXCLUDED.institution_id, image = EXCLUDED.image, 
             title = EXCLUDED.title, category = EXCLUDED.category`,
          [item.id, item.institutionId, item.image, item.title, item.category]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM gallery WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM gallery');
      }

    } else if (type === 'contacts') {
      const ids = data.map(item => item.id);

      for (const item of data) {
        await client.query(
          `INSERT INTO contacts (id, name, email, institution_name, message, date, is_read)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET 
             name = EXCLUDED.name, email = EXCLUDED.email, 
             institution_name = EXCLUDED.institution_name, message = EXCLUDED.message, 
             date = EXCLUDED.date, is_read = EXCLUDED.is_read`,
          [item.id, item.name, item.email, item.institutionName || null, item.message, item.date, item.isRead]
        );
      }

      if (ids.length > 0) {
        await client.query('DELETE FROM contacts WHERE id NOT IN (SELECT unnest($1::varchar[]))', [ids]);
      } else {
        await client.query('DELETE FROM contacts');
      }

    } else if (type === 'settings') {
      await client.query(
        `INSERT INTO website_settings (
          id, logo_image, logo_text, logo_sub_text, favicon, contact_email, 
          contact_phone, contact_address, whatsapp_number, social_links, seo
        ) VALUES ('global', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET 
          logo_image = EXCLUDED.logo_image, logo_text = EXCLUDED.logo_text, 
          logo_sub_text = EXCLUDED.logo_sub_text, favicon = EXCLUDED.favicon, 
          contact_email = EXCLUDED.contact_email, contact_phone = EXCLUDED.contact_phone, 
          contact_address = EXCLUDED.contact_address, whatsapp_number = EXCLUDED.whatsapp_number, 
          social_links = EXCLUDED.social_links, seo = EXCLUDED.seo`,
        [
          data.logoImage || null, data.logoText, data.logoSubText,
          data.favicon, data.contactEmail, data.contactPhone,
          data.contactAddress, data.whatsappNumber,
          JSON.stringify(data.socialLinks), JSON.stringify(data.seo)
        ]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Sync error for ${type}:`, error);
    res.status(500).json({ error: 'Sync failed', details: error.message });
  } finally {
    client.release();
  }
});

// Serve static assets in production
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
