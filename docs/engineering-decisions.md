# Engineering Decisions

## Overview

This document describes the primary architectural and implementation decisions made during the development of Shaukin Garments.

Each decision is evaluated in terms of problem context, selected approach, alternatives considered, trade-offs, and future evolution.

---

# Backend Framework

## Decision

FastAPI was selected as the backend framework.

## Motivation

The application exposes multiple REST endpoints for product management, authentication, quotations, recommendations, and administration.

The framework needed to provide:

- High request throughput
- Automatic request validation
- OpenAPI documentation
- Type safety
- Asynchronous request handling

## Alternatives Considered

- Flask
- Django
- Express.js

## Trade-offs

### Advantages

- Native async support
- Automatic OpenAPI generation
- Pydantic validation
- Type annotations
- Lightweight architecture

### Disadvantages

- Smaller ecosystem compared to Django
- Async programming introduces additional complexity

---

# Frontend Framework

## Decision

Next.js 14 was selected for the frontend application.

## Motivation

The application requires:

- Client-side routing
- Responsive rendering
- Component reusability
- Efficient asset optimization
- Production deployment

## Alternatives Considered

- React (CRA)
- Vue
- Angular

## Trade-offs

### Advantages

- Modern App Router
- Optimized builds
- Built-in routing
- Excellent developer experience

### Disadvantages

- More opinionated project structure
- Additional learning curve

---

# Database

## Decision

PostgreSQL is used as the primary database.

## Motivation

The application stores relational business data including:

- Users
- Products
- Categories
- Orders
- Quotations
- Recommendation interactions

These entities require strong consistency and relational integrity.

## Alternatives Considered

- MySQL
- MongoDB
- SQLite

## Trade-offs

### Advantages

- ACID transactions
- Foreign key constraints
- Mature indexing
- Excellent SQL support

### Disadvantages

- More operational overhead than document databases

---

# ORM

## Decision

SQLAlchemy Async ORM

## Motivation

The persistence layer should remain independent of SQL queries while supporting asynchronous database access.

## Advantages

- ORM abstraction
- Relationship management
- Async support
- Transaction management

## Trade-offs

- Additional abstraction layer
- Generated SQL can be harder to inspect

---

# Authentication

## Decision

JWT Bearer Authentication

## Motivation

The API is stateless.

Session storage on the server is intentionally avoided.

JWT enables authentication without maintaining server-side session state.

## Advantages

- Stateless
- Scalable
- Widely supported
- Easy API integration

## Trade-offs

- Token invalidation is non-trivial
- Token expiration requires refresh strategies

---

# Password Storage

## Decision

Passwords are stored as bcrypt hashes.

## Motivation

Plain-text password storage is unacceptable.

bcrypt provides adaptive hashing with configurable computational cost.

---

# Recommendation Strategy

## Decision

Hybrid Recommendation System

## Motivation

Neither content-based filtering nor collaborative filtering independently satisfies all recommendation scenarios.

The implemented solution combines both techniques.

## Components

- TF-IDF
- Cosine Similarity
- Collaborative Filtering
- Hybrid Ranking

## Advantages

- Better personalization
- Reduced cold-start impact
- Improved recommendation diversity

---

# Image Storage

## Decision

Cloudinary

## Motivation

Product images should not be stored directly inside the application server.

Cloudinary provides:

- CDN delivery
- Automatic optimization
- Image transformations
- External asset management

---

# API Design

## Decision

REST

## Motivation

The application primarily exchanges resource-oriented data.

REST provides predictable routing and broad client compatibility.

Example

```
GET /products

POST /orders

PATCH /quotes/{id}
```

---

# Application Structure

## Decision

Layered Architecture

Presentation

↓

API

↓

Business Logic

↓

Persistence

↓

Infrastructure

Responsibilities remain isolated within each layer.

---

# State Management

## Decision

Zustand

## Motivation

Only a limited amount of client-side global state is required.

Examples include:

- Authentication
- Shopping Cart
- User Session

A lightweight solution was preferred over larger state management libraries.

---

# Data Fetching

## Decision

TanStack Query

## Motivation

The frontend frequently consumes REST endpoints.

The library provides:

- Automatic caching
- Background refetching
- Request deduplication
- Optimistic updates

---

# Deployment Strategy

## Decision

Independent Frontend and Backend Deployments

## Motivation

Frontend and backend deployments evolve independently.

Current deployment targets include:

Frontend

- Vercel

Backend

- Render

Database

- Supabase

---

# Recommendation Processing

## Decision

Synchronous Recommendation Generation

## Motivation

The current catalogue size allows recommendations to be generated within acceptable latency.

This avoids introducing additional infrastructure.

Future versions may introduce asynchronous recommendation generation.

---

# Current Limitations

The architecture currently assumes:

- Single backend instance
- Single PostgreSQL database
- Monolithic deployment
- Limited catalogue size
- Moderate user traffic

These assumptions simplify deployment while remaining appropriate for the current application scale.

---

# Future Architectural Evolution

Potential improvements include:

- Redis caching
- Background workers
- Elasticsearch
- Vector database
- Docker Compose
- Kubernetes
- Read replicas
- Message queues
- Event-driven processing

---

# Summary

The selected architecture emphasizes simplicity, maintainability, and clear separation of concerns while remaining suitable for production deployment.

The design favors widely adopted technologies with mature ecosystems, enabling future scalability without requiring significant architectural changes.
