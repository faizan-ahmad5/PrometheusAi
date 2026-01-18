# AI-Powered Full-Stack SaaS Web Application

## Project Overview

This project is a full-stack AI-powered web application designed using a SaaS-based architecture. It provides users with secure authentication, AI-powered chat, media uploads, online payments, community interaction, and usage tracking.

The system focuses on security, scalability, and real-world integrations, making it suitable for production-level use.

---

## Tech Stack

### Frontend

- React – Component-based user interface
- Vite – Fast development and optimized builds
- React Router – Client-side routing and protected routes
- Axios – API communication
- Stripe JS – Secure payment handling
- React Hot Toast – User notifications

### Backend

- Node.js + Express.js – REST API development
- MongoDB + Mongoose – Database and schema modeling
- JWT – Stateless authentication
- bcrypt – Password hashing
- crypto – Secure token generation and hashing
- Nodemailer – Email verification and notifications
- OpenAI / Gemini APIs – AI prompt processing
- ImageKit – Image upload and CDN delivery
- Stripe SDK – Payments and webhook handling
- dotenv, cors, rate-limiting – Security and configuration

---

## Authentication & Email Verification

- Users register with email and password
- A secure verification token is generated, hashed, stored with expiry, and sent via email
- Users must verify their email before accessing core features
- Authentication is handled using JWT, making the backend stateless and scalable

---

## AI Chat System

- Authenticated users can send prompts to the AI
- Backend checks available credits and rate limits
- Prompts are sent to OpenAI or Gemini
- AI responses are stored in the database
- Credits are deducted per request to prevent abuse

---

## Image Uploads

- Image uploads are handled using ImageKit
- Backend generates signed upload tokens
- Frontend uploads images directly to ImageKit
- This approach reduces server load and improves performance

---

## Payments & Credits (Stripe)

- Users purchase credits using Stripe Checkout
- Payments are processed securely by Stripe
- Credits are added only after Stripe sends a verified webhook
- This ensures reliable and secure payment confirmation

---

## Community Module

- Users can create posts and interact with other users
- Authentication is required for creating content
- Designed with moderation and scalability in mind

---

## Usage Tracking & Quotas

- All major actions (AI usage, uploads, payments) are logged
- Middleware enforces usage limits based on user credits
- Logs are used for monitoring, analytics, and admin control

---

## Security Highlights

- Hashed passwords and verification tokens
- JWT-based authentication
- Rate limiting to prevent abuse
- Webhook signature verification
- Environment variables for sensitive data

---

## Summary

This project demonstrates a secure, scalable, and production-ready AI SaaS platform with real-world integrations such as AI APIs, payment gateways, and cloud-based media handling.
