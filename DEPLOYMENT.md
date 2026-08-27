# 🚀 Production Deployment Runbook

**Project:** Suryakiran P. J. — Futuristic Full-Stack AI Portfolio  
**Repository:** `https://github.com/skiran-ai/suryakiranpj.git`  
**Production Domain:** `https://www.suryakiranpj.com`  
**Architecture:** Netlify (React SPA) + Render (Django REST API + PostgreSQL)

---

## 🏗️ Architecture Overview

```
[ Visitor Browser ]
        │
        ▼
[ Netlify Edge CDN (React + Vite) ]  ─── HTTPS API Requests ───► [ Render Web Service (Django + WhiteNoise) ]
  • Custom Domain (www.suryakiranpj.com)                          • API Domain (api.suryakiranpj.com / onrender.com)
  • SPA Routing Rewrite (/* -> /index.html)                       • Gunicorn WSGI Worker Server
  • Instant Static Asset Caching                                  │
                                                                  ├─► [ Render Managed PostgreSQL ]
                                                                  │     • Persistent Portfolio Data & Messages
                                                                  ▼
                                                       [ Gmail SMTP Service ]
                                                         • Instant Email Dispatch to suryakiranpjineesh@gmail.com
```

---

## Step 1: Render Backend & PostgreSQL Deployment

### Option A: Using Render Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `skiran-ai/suryakiranpj`.
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **PostgreSQL Database:** `suryakiran-portfolio-db`
   - **Web Service:** `suryakiran-portfolio-api` (Root directory: `backend`)
5. Click **Apply**.

---

## Step 2: Backend Environment Variables Configuration

Set the following environment variables in your Render Web Service dashboard (**Environment** tab):

### Core & Security Settings
| Variable | Recommended Production Value | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(Generate a 50+ char random string)* | Cryptographic signing key |
| `DJANGO_DEBUG` | `False` | Disables debug mode in production |
| `DATABASE_URL` | *(Render auto-links from PostgreSQL)* | PostgreSQL connection string |
| `DJANGO_ALLOWED_HOSTS` | `suryakiran-portfolio-api.onrender.com,api.suryakiranpj.com,suryakiranpj.com,www.suryakiranpj.com` | Allowed hostnames |
| `CORS_ALLOWED_ORIGINS` | `https://www.suryakiranpj.com,https://suryakiranpj.com,https://suryakiranpj.netlify.app` | Allowed frontend origins |
| `CSRF_TRUSTED_ORIGINS` | `https://www.suryakiranpj.com,https://suryakiranpj.com,https://suryakiranpj.netlify.app` | Trusted CSRF origins |
| `GEMINI_API_KEY` | *(Your Google AI Studio API Key)* | Required for grounded KIRAN AI Assistant |
| `SECURE_SSL_REDIRECT` | `True` | Enforces HTTPS redirection |
| `SESSION_COOKIE_SECURE` | `True` | Restricts cookies to HTTPS |
| `CSRF_COOKIE_SECURE` | `True` | Restricts CSRF tokens to HTTPS |

### 📧 Gmail SMTP Email Configuration (Required for Contact Messages to reach your Gmail)
| Variable | Value | Description |
|---|---|---|
| `EMAIL_BACKEND` | `django.core.mail.backends.smtp.EmailBackend` | Production SMTP Email Backend |
| `EMAIL_HOST` | `smtp.gmail.com` | Google Gmail SMTP Host |
| `EMAIL_PORT` | `587` | TLS Port |
| `EMAIL_USE_TLS` | `True` | Enables Transport Layer Security |
| `EMAIL_HOST_USER` | `suryakiranpjineesh@gmail.com` | Your Gmail address |
| `EMAIL_HOST_PASSWORD` | *(16-character Google App Password)* | **Dedicated App Password from Google** (See guide below) |
| `DEFAULT_FROM_EMAIL` | `suryakiranpjineesh@gmail.com` | From header address |
| `CONTACT_EMAIL` | `suryakiranpjineesh@gmail.com` | Recipient address where you receive messages |

> [!IMPORTANT]
> ### 🔑 How to Generate a 16-Character Google App Password:
> 1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
> 2. Ensure **2-Step Verification** is turned **ON**.
> 3. Search for or navigate to **[App Passwords](https://myaccount.google.com/apppasswords)**.
> 4. Enter an App Name (e.g. `Portfolio Contact Form`) and click **Create**.
> 5. Google will display a **16-character password** (e.g., `abcd efgh ijkl mnop`).
> 6. Copy this 16-character code (without spaces) and paste it as `EMAIL_HOST_PASSWORD` in your Render Environment Variables!

---

## Step 3: Initialize Database & Verify Email Dispatch

In the Render Dashboard, open your Web Service and click **Shell**:

1. Create your Django Admin superuser:
   ```bash
   python manage.py createsuperuser
   ```
2. Seed initial portfolio data:
   ```bash
   python manage.py seed_portfolio_data
   ```
3. Test your Gmail SMTP connection:
   ```bash
   python manage.py test_email_dispatch
   ```
   *(If successful, you will instantly receive a test message in your Gmail inbox!)*

---

## Step 4: Netlify Frontend Deployment & Domain Mapping

1. Log in to [Netlify Dashboard](https://app.netlify.com/).
2. Connect your GitHub repository `skiran-ai/suryakiranpj` (Base: `frontend`, Build: `npm run build`, Publish: `dist`).
3. Under **Site Configuration** → **Environment variables**, set:
   ```
   VITE_API_BASE_URL = https://suryakiran-portfolio-api.onrender.com
   ```
   *(Or `https://api.suryakiranpj.com` if using custom backend subdomain).*

---

## Step 5: Custom Domain Setup for `www.suryakiranpj.com`

### 1. In Netlify:
1. Go to **Domain management** → **Add a custom domain**.
2. Enter `www.suryakiranpj.com` (or `suryakiranpj.com`).
3. Set `www.suryakiranpj.com` as the primary domain.

### 2. At your Domain Registrar (e.g., GoDaddy, Namecheap, Hostinger, Cloudflare):
Add the following DNS records:
- **CNAME Record:**
  - Host/Name: `www`
  - Value/Target: `<your-site-name>.netlify.app`
  - TTL: Automatic / 3600
- **A Record (Apex):**
  - Host/Name: `@`
  - Value/Target: `75.2.60.5` (Netlify's load balancer IP)
  - TTL: Automatic / 3600

Netlify will automatically provision a free Let's Encrypt SSL certificate once DNS resolves.

---

## Step 6: Post-Deployment Verification Checklist

- [ ] `GET https://<api-url>/api/health/` returns `{"status": "healthy", "services": {"database": "ONLINE"}}`
- [ ] Submit contact form on `https://www.suryakiranpj.com/#contact` → verify notification arrives in `suryakiranpjineesh@gmail.com`
- [ ] Message record appears in Admin Dashboard at `https://www.suryakiranpj.com/admin/messages`
- [ ] Direct URL refresh on `/cv` or `/projects` loads correctly (no 404)
- [ ] AI Assistant (KIRAN) responds to questions accurately
