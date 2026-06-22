# Shaukin Garments — Phase 1 Setup Guide

## Project structure
```
shaukin/
├── backend/          FastAPI + PostgreSQL
│   ├── main.py
│   ├── schema.sql    Run this on Railway PostgreSQL first
│   ├── requirements.txt
│   ├── .env.example  Copy to .env and fill in values
│   └── app/
│       ├── core/     config.py, security.py (JWT)
│       ├── db/       session.py (SQLAlchemy async)
│       ├── models/   user.py, product.py, order.py
│       ├── schemas/  user.py, product.py (Pydantic)
│       └── routers/  auth, users, products, categories, orders, quotes
└── frontend/         Next.js 14
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── .env.local.example
    └── lib/
        ├── api.ts    Typed axios client
        └── store.ts  Zustand auth store
```

---

## Step 1 — Set up Railway PostgreSQL

1. Go to https://railway.app → New Project → PostgreSQL
2. Click your PostgreSQL service → Data tab → Query
3. Paste the entire contents of `backend/schema.sql` and run it
4. Copy the connection string from the Connect tab

---

## Step 2 — Deploy FastAPI backend on Railway

1. In Railway, add a new service → Deploy from GitHub repo
2. Point it to the `backend/` folder (or root if you put it there)
3. Railway auto-detects Python. Add a `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Set environment variables (from `.env.example`):
   - `DATABASE_URL` → from Step 1
   - `SECRET_KEY` → run: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Leave Cloudinary/Razorpay blank for now (Phase 2 & 3)

5. Test your API: `https://your-railway-url.railway.app/docs`
   You should see the full Swagger UI with all endpoints.

---

## Step 3 — Set up Next.js frontend on Vercel

1. Go to https://vercel.com → New Project → Import from GitHub
2. Set root directory to `frontend/`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
4. Deploy

---

## Step 4 — Create your first admin user

After backend is live, call the register endpoint:

```bash
curl -X POST https://your-railway-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shaukin Admin",
    "email": "admin@shaukingarments.com",
    "password": "your-secure-password",
    "role": "retail_customer"
  }'
```

Then manually update the role to `admin` in Railway's PostgreSQL query tab:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@shaukingarments.com';
```

---

## API endpoints available after Phase 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, get JWT |
| GET | /api/auth/me | Get current user |
| GET | /api/users/me | Get profile |
| PATCH | /api/users/me | Update profile |
| GET | /api/categories | List all categories |
| GET | /api/products | List products (filter, search, paginate) |
| GET | /api/products/{slug} | Single product |
| POST | /api/products | Create product (admin only) |
| PATCH | /api/products/{id} | Update product (admin only) |
| DELETE | /api/products/{id} | Soft delete (admin only) |

Interactive docs at: `https://your-backend-url/docs`
