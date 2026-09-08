# E&B MARKETIZA — STEP 4B (REAL SUPABASE DATABASE)

This version connects authentication, products, and product images to Supabase.

## Setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase-schema.sql`.
3. Copy your Project URL and public anon key.
4. Open `config.js` and replace:
   - YOUR_SUPABASE_URL
   - YOUR_SUPABASE_ANON_KEY
5. Upload all files to your GitHub Pages repository root.
6. Keep GitHub Pages on main / (root).

## Important
Only use the public anon key in browser code. Never put a Supabase service_role/secret key in `config.js`.

## Authentication
Register/login uses Supabase Auth. If email confirmation is enabled, the user must confirm their email before logging in.

## Products
Sellers can add, edit and delete products. Products are stored in the `products` table. Product images are stored in the `product-images` Supabase Storage bucket.

Real checkout, orders, commissions and payment processing should be added as a separate step after the database is working.
