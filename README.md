<div align="center">

# 🏥 Shaukin Garments

### Production-Grade B2B & Retail E-Commerce Platform for Institutional Uniforms & Linens

*Digitising institutional uniform procurement through modern cloud-native architecture, intelligent product recommendations, and seamless B2B workflows.*

<p>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-4F46E5?style=for-the-badge)](https://shaukin-garments.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Swagger_UI-009688?style=for-the-badge&logo=swagger)](https://shaukin-garments.onrender.com/docs)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</p>

<p>

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwind-css)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-blue?logo=cloudinary)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![scikit--learn](https://img.shields.io/badge/ML-TF--IDF_&_Collaborative-F7931E?logo=scikit-learn)

</p>

---

### ⭐ Highlights

🚀 Production Deployment

🛍️ Full Stack Commerce Platform

🏥 Built for a Real Business

🤖 Hybrid ML Recommendation Engine

⚡ Async FastAPI Backend

🔐 JWT Authentication

☁️ Cloud Native Deployment

📦 PostgreSQL + SQLAlchemy

📱 Responsive UI

---

### 🔗 Links

| Resource | Link |
|-----------|------|
| 🌐 Live Website | https://shaukin-garments.vercel.app |
| 📚 Swagger API | https://shaukin-garments.onrender.com/docs |
| 🎥 Demo Video | *Coming Soon* |
| 📖 Documentation | docs/ |
| 🧠 ML Documentation | docs/recommendation-engine.md |

</div>

---

# 📖 Table of Contents

- Project Overview
- Why This Project?
- Problem Statement
- Solution
- Features
- Screenshots
- System Architecture
- Workflow
- Tech Stack
- Folder Structure
- Installation
- Environment Variables
- API Documentation
- Database Design
- Recommendation Engine
- Engineering Decisions
- Technical Challenges
- Performance
- Security
- Deployment
- Roadmap
- Known Limitations
- Contributing
- Author
- License

---

# 🎯 Project Overview

Shaukin Garments is a **production-ready full-stack B2B and retail e-commerce platform** designed specifically for institutional uniform procurement.

Unlike conventional e-commerce websites that primarily focus on retail customers, this platform addresses the operational challenges faced by hospitals, schools, industrial organizations, petrol pumps, corporate offices, and institutional buyers who purchase uniforms and linens in bulk.

The platform combines modern cloud-native technologies with intelligent recommendation systems to digitize a traditionally manual procurement workflow.

---

## Who is it for?

### 🏥 Hospitals

- Doctor Coats
- OT Drapes
- Scrub Suits
- Nurse Uniforms
- Patient Gowns
- Bed Linens

---

### 🏫 Schools

- School Uniforms
- Blazers
- House T-Shirts
- Sports Uniforms

---

### 🏭 Industries

- Safety Uniforms
- Industrial Wear
- Reflective Jackets
- Worker Uniforms

---

### 🏢 Corporate Offices

- Staff Uniforms
- Reception Uniforms
- Corporate Shirts
- Sarees

---

### 👤 Retail Customers

- Individual purchases
- Cart & Checkout
- Secure Authentication

---

# ❤️ Why This Project?

This project wasn't built as a portfolio exercise.

It was built to solve a **real operational problem**.

My father's institutional uniform business handled every customer interaction through WhatsApp calls, spreadsheets, and manual negotiations.

That resulted in:

- No searchable product catalogue
- No inventory visibility
- No online ordering
- No quotation tracking
- No centralized customer data
- No recommendation system
- No analytics

As the business expanded, these manual processes became increasingly difficult to manage.

Instead of adopting a generic e-commerce platform, I designed and developed a custom solution tailored specifically for institutional procurement workflows.

Today, the application serves as the digital backbone of the business.

---

# ❗ Problem Statement

Traditional commerce platforms like Shopify or WooCommerce are excellent for retail stores.

However, institutional procurement follows an entirely different workflow.

Bulk buyers don't simply add products to a cart.

They usually require:

- Multiple products in one quotation
- Size-wise quantity breakdowns
- MOQ enforcement
- Different pricing for retail and bulk
- Custom embroidery requirements
- Negotiation before purchase
- Delivery scheduling
- GST documentation

Generic e-commerce platforms do not provide these capabilities out of the box.

---

# ✅ Solution

Shaukin Garments introduces a dedicated institutional commerce platform consisting of three major layers.

## 1️⃣ Commerce Layer

Handles

- Product Catalogue
- Search
- Categories
- Cart
- Checkout

---

## 2️⃣ Business Layer

Handles

- Bulk Quote Workflow
- Admin Dashboard
- Inventory
- Orders
- Authentication
- Pricing

---

## 3️⃣ Intelligence Layer

Provides

- Hybrid Recommendations
- Behaviour Tracking
- Frequently Bought Together
- Trending Products
- Cross-category Suggestions

This allows customers to discover products naturally while increasing business conversions.

---

# ✨ Key Features

## 🛍 Customer Experience

- ✅ Beautiful Landing Page
- ✅ Responsive Design
- ✅ Product Catalogue
- ✅ Advanced Search
- ✅ Category Filtering
- ✅ Product Detail Pages
- ✅ Image Gallery
- ✅ Dual Pricing (Retail & Bulk)
- ✅ Shopping Cart
- ✅ GST Calculation
- ✅ Bulk Quote Request
- ✅ WhatsApp Integration
- ✅ Personalized Recommendations

---

## 🏢 Institutional Features

- ✅ Multi-item Quotations
- ✅ MOQ Enforcement
- ✅ Delivery Information
- ✅ Custom Notes
- ✅ Organization Details
- ✅ Bulk Pricing

---

## 🔐 Authentication

- JWT Authentication
- Role Based Access
- Admin Dashboard
- Retail Users
- Institutional Users

---

## 🤖 Machine Learning

- Hybrid Recommendation Engine
- TF-IDF
- Collaborative Filtering
- Interaction Tracking
- Cosine Similarity
- Frequently Bought Together
- Trending Products

---

## 📸 Application Preview

| Landing Page | Product Catalogue |
|---------------|-------------------|
| ![](assets/landing-page.png) | ![](assets/products-catalogue.png) |

| Product Page | Cart |
|--------------|------|
| ![](assets/product-page.png) | ![](assets/cart-page.png) |

| Bulk Quote | Admin Dashboard |
|------------|-----------------|
| ![](assets/bulk-quote-page.png) | ![](assets/admin-dashboard.png) |

| Recommendation Engine | API Documentation |
|-----------------------|-------------------|
| ![](assets/recommendation-engine.png) | ![](assets/api-docs.png) |

---

# 🏗 System Architecture

```mermaid
graph TD

A[Customer]

A --> B[Next.js 14 Frontend]

B --> C[FastAPI Backend]

C --> D[JWT Authentication]

C --> E[Product APIs]

C --> F[Bulk Quote APIs]

C --> G[Recommendation Engine]

E --> H[(PostgreSQL)]

F --> H

G --> H

C --> I[Cloudinary]

C --> J[WhatsApp Integration]

C --> K[Razorpay]

G --> L[TF-IDF Engine]

G --> M[Collaborative Filtering]

L --> N[Hybrid Ranking]

M --> N

N --> B
```

---

# ⚙ Overall Workflow

```mermaid
flowchart TD

A[User Visits Website]

A --> B[Browse Products]

B --> C[Search / Filter]

C --> D[Open Product]

D --> E[Track User Behaviour]

E --> F[Recommendation Engine]

F --> G[Display Personalized Products]

D --> H[Add to Cart]

H --> I[Checkout]

I --> J[Order Created]

D --> K[Bulk Quote]

K --> L[Admin Dashboard]

L --> M[Quote Response]

```
# 🛠 Technology Stack

The platform is built using a modern cloud-native architecture focused on scalability, maintainability, and developer productivity.

| Category | Technology | Why It Was Chosen |
|----------|------------|-------------------|
| **Frontend** | Next.js 14 (App Router) | Server Components, routing, performance, SEO |
| **Language** | TypeScript | Static typing and maintainability |
| **Styling** | Tailwind CSS | Utility-first styling with rapid UI development |
| **Client State** | Zustand | Lightweight global state for authentication and shopping cart |
| **Server State** | TanStack Query | Data fetching, caching and background synchronization |
| **Forms** | React Hook Form | Efficient form handling with minimal re-renders |
| **Backend** | FastAPI | High-performance asynchronous REST API framework |
| **Language** | Python 3.11 | Mature ecosystem and ML support |
| **ORM** | SQLAlchemy 2.0 Async | Type-safe asynchronous database operations |
| **Database Driver** | asyncpg | High-performance PostgreSQL async driver |
| **Database** | PostgreSQL (Supabase) | ACID compliance, relational data, JSONB support |
| **Authentication** | JWT + bcrypt | Secure stateless authentication |
| **Machine Learning** | scikit-learn | TF-IDF Vectorization & Cosine Similarity |
| **Media Storage** | Cloudinary | Optimized image hosting and CDN delivery |
| **Payments** | Razorpay | Indian payment gateway |
| **Deployment (Frontend)** | Vercel | Optimized deployment for Next.js |
| **Deployment (Backend)** | Render | Cloud hosting for FastAPI |
| **Version Control** | Git & GitHub | Source code management |

---

# 📂 Project Structure

```text
shaukin-garments/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── schema.sql
│   ├── requirements.txt
│   └── main.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   └── public/
│
├── assets/
│   ├── landing-page.png
│   ├── products-catalogue.png
│   ├── product-page.png
│   ├── cart-page.png
│   ├── bulk-quote-page.png
│   ├── admin-dashboard.png
│   ├── recommendation-engine.png
│   └── api-docs.png
│
├── docs/
│
├── README.md
│
└── LICENSE
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, ensure you have the following installed.

- Node.js 18+
- Python 3.11+
- PostgreSQL / Supabase
- Git

---

# Clone Repository

```bash
git clone https://github.com/dishi575/shaukin-garments.git

cd shaukin-garments
```

---

# Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Create Environment File

```bash
cp .env.example .env
```

Run Database Schema

```bash
psql DATABASE_URL -f schema.sql
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create

```text
.env.local
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:3000
```

---

# 🔐 Environment Variables

## Backend

| Variable | Required | Description |
|-----------|----------|-------------|
| DATABASE_URL | ✅ | PostgreSQL Database URL |
| SECRET_KEY | ✅ | JWT Secret |
| ALGORITHM | ✅ | JWT Algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | ✅ | Token Expiry |
| CLOUDINARY_CLOUD_NAME | ✅ | Cloudinary Cloud |
| CLOUDINARY_API_KEY | ✅ | Cloudinary API Key |
| CLOUDINARY_API_SECRET | ✅ | Cloudinary Secret |
| RAZORPAY_KEY_ID | Optional | Razorpay |
| RAZORPAY_KEY_SECRET | Optional | Razorpay Secret |

---

## Frontend

| Variable | Required |
|-----------|----------|
| NEXT_PUBLIC_API_URL | ✅ |
| NEXT_PUBLIC_RAZORPAY_KEY | Optional |

---

# ⚙ Configuration

## Backend

- FastAPI
- SQLAlchemy Async
- JWT Authentication
- AsyncPG
- Pydantic

---

## Frontend

- Next.js App Router
- Zustand
- TanStack Query
- TailwindCSS

---

# 📡 REST API Overview

## Authentication

| Method | Endpoint |
|----------|-----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## Products

| Method | Endpoint |
|----------|-----------|
| GET | /api/products |
| GET | /api/products/{slug} |
| POST | /api/products |
| PATCH | /api/products/{id} |
| DELETE | /api/products/{id} |

---

## Quotes

| Method | Endpoint |
|----------|-----------|
| POST | /api/quotes |
| GET | /api/quotes |
| PATCH | /api/quotes/{id} |

---

## Orders

| Method | Endpoint |
|----------|-----------|
| POST | /api/orders |
| GET | /api/orders/my |

---

## Recommendations

| Method | Endpoint |
|----------|-----------|
| POST | /api/recommendations/track |
| GET | /api/recommendations/product/{id} |
| GET | /api/recommendations/home |

---

# 🧾 Sample API Request

```http
POST /api/quotes
```

```json
{
  "guest_name":"City Hospital",
  "guest_phone":"9876543210",
  "items":[
      {
          "name":"Doctor Coat",
          "qty":50
      }
  ]
}
```

Response

```json
{
  "status":"pending",
  "message":"Quote request received."
}
```

---

# 🗄 Database Design

## Core Tables

- Users
- Products
- Categories
- Orders
- Bulk Quotes
- ML Interactions

---

## Entity Relationship Diagram

```mermaid
erDiagram

USERS ||--o{ ORDERS : places

USERS ||--o{ BULK_QUOTES : submits

CATEGORIES ||--o{ PRODUCTS : contains

PRODUCTS ||--o{ ML_INTERACTIONS : tracked

USERS ||--o{ ML_INTERACTIONS : performs
```

---

## Database Design Decisions

### Why PostgreSQL?

- ACID Compliance
- JSONB Support
- Strong Relationships
- Mature Ecosystem
- Excellent Query Performance

---

### Why UUIDs?

- More secure than sequential IDs
- Prevent resource enumeration
- Better suited for distributed systems

---

### Why JSONB?

Bulk quotations and order snapshots are stored using JSONB to preserve the original order details even if product information changes later.

---

### Indexes Used

- Product Slug
- Category
- Email
- Recommendation Queries
- Quote Status
- Product Search
