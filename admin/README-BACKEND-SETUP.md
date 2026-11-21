# Secure Backend & Database Setup Guide
**Portfolio Admin Dashboard & Authentication System**  
*Owner: Khuram Latif (k.bitlogics)*

---

## 1. Architectural Overview & Security Model

The portfolio management system uses a modern, secure headless architecture:

```
┌─────────────────────────┐         HTTPS (JWT / Bearer Token)         ┌────────────────────────────────┐
│   Admin Dashboard UI    │ ──────────────────────────────────────────> │   Trusted Auth & API Gateway   │
│   (HTML5 + Vanilla JS)  │ <────────────────────────────────────────── │   (Supabase / Firebase / Node) │
└─────────────────────────┘                                             └────────────────────────────────┘
             │                                                                           │
             │ Local Session Guard                                                       │ RLS Policies
             ▼                                                                           ▼
┌─────────────────────────┐                                             ┌────────────────────────────────┐
│ Route Protection Guard  │                                             │  PostgreSQL Database & Storage │
│ (Redirect if no token)  │                                             │  (Projects, Reviews, Inquiries)│
└─────────────────────────┘                                             └────────────────────────────────┘
```

### Security Compliance:
1. **Zero Hardcoded Passwords**: Neither admin passwords nor secret keys are stored in frontend code.
2. **Encrypted Authentication**: All credentials are submitted over TLS (HTTPS) to the backend authentication provider which verifies salted & hashed passwords (`bcrypt`/`argon2`).
3. **Route Protection**: The dashboard route (`admin/index.html`) verifies active cryptographic tokens before rendering. If no valid session exists, it immediately redirects to `admin/login.html`.
4. **Row-Level Security (RLS)**: Public portfolio visitors can only `SELECT` (read) published projects and approved testimonials; only authenticated admin users can `INSERT`, `UPDATE`, or `DELETE`.

---

## 2. Production Setup with Supabase (Recommended)

Supabase provides an open-source, serverless PostgreSQL database with built-in JWT authentication and asset storage.

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `khuram-latif-portfolio`.
3. Choose your nearest region (e.g. Frankfurt, Singapore, or US East) and set a database password.

### Step 2: Create Database Tables (SQL Editor)
In the Supabase Dashboard, open **SQL Editor** -> **New Query**, paste the following script, and click **Run**:

```sql
-- 1. Create Projects Table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    client TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    case_study_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Testimonials Table
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author TEXT NOT NULL,
    company TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    quote TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Articles Table
CREATE TABLE public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    content TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Inquiries Table
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Step 3: Configure Row-Level Security (RLS)
Run this SQL snippet to ensure only authenticated admin users can modify data:

```sql
-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Anyone can read published items
CREATE POLICY "Public Can Read Published Projects"
ON public.projects FOR SELECT
USING (status = 'published');

CREATE POLICY "Public Can Read Approved Testimonials"
ON public.testimonials FOR SELECT
USING (status = 'approved');

CREATE POLICY "Public Can Read Published Articles"
ON public.articles FOR SELECT
USING (status = 'published');

-- 2. Public Insert Policy: Public can submit inquiries
CREATE POLICY "Public Can Submit Inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- 3. Admin Full Access: Only authenticated admin can modify everything
CREATE POLICY "Admin Full Access Projects"
ON public.projects FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Articles"
ON public.articles FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Inquiries"
ON public.inquiries FOR ALL
TO authenticated
USING (true) WITH CHECK (true);
```

### Step 4: Storage Bucket for Project Images
1. In Supabase Dashboard, click **Storage** -> **New Bucket**.
2. Name it: `portfolio-images`.
3. Set **Public Bucket** to `ON` (so images can be viewed publicly on your site).
4. Add Policy:
   - Allow `SELECT` for all users (`true`).
   - Allow `INSERT`, `UPDATE`, `DELETE` for `authenticated` users only.

### Step 5: Create Your Admin User
1. Go to **Authentication** -> **Users** -> **Add User**.
2. Enter your email: `Honeymeharhm55@gmail.com` and set a strong, unique password.
3. Confirm the user.

### Step 6: Connect Dashboard to Supabase
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (e.g. `https://xyzabc.supabase.co`)
   - **anon / public key** (Safe for client-side JavaScript).
   *(⚠️ NEVER share or paste your `service_role` secret key in frontend code).*
3. Open your Admin Dashboard (`admin/index.html`), click on the **Backend & Settings** tab, paste the Project URL and Anon Key, and click **Save Backend Configuration**.

---

## 3. Alternative Custom Node.js / Express Backend

If you prefer hosting your own private API server, here is the standard production structure:

```javascript
// server.js (Express + JWT + bcrypt)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://yourportfolio.com' }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // bcrypt hashed

// Login Endpoint
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, role: 'admin' } });
});

// Auth Middleware
const requireAuth = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'No token provided' });
    const token = header.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token expired or invalid' });
        req.user = decoded;
        next();
    });
};

// Protected routes (projects, testimonials, inquiries)
app.post('/api/projects', requireAuth, (req, res) => { /* Add project */ });
app.put('/api/projects/:id', requireAuth, (req, res) => { /* Edit project */ });
app.delete('/api/projects/:id', requireAuth, (req, res) => { /* Delete project */ });

app.listen(5000, () => console.log('Admin API running on port 5000'));
```

---

## 4. Local Testing & Sandbox Preview

Without setting up cloud accounts right away, the dashboard operates seamlessly in **Local Sandbox Mode**:
- You can sign in using your email and any password (minimum 6 characters).
- All changes (adding new projects, editing testimonials, writing articles, managing inquiries) are automatically stored in your browser's persistent `localStorage`.
- You can export your data as a clean JSON backup anytime via the **Backend & Settings** tab.
