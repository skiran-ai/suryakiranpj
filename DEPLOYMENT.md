# 🚀 Production Deployment Runbook

**Project:** Suryakiran P. J. — Futuristic Full-Stack AI Portfolio  
**Repository:** `https://github.com/skiran-ai/suryakiranpj.git`  
**Architecture:** Netlify (React SPA) + Render (Django REST API + PostgreSQL)

---

## 🏗️ Architecture Overview

```
[ Visitor Browser ]
        │
        ▼
[ Netlify Edge CDN (React + Vite) ]  ─── HTTPS API Requests ───► [ Render Web Service (Django + WhiteNoise) ]
  • Custom Domain (e.g. suryakiran.dev)                           • API Domain (e.g. api.suryakiran.dev)
  • SPA Routing Rewrite (/* -> /index.html)                       • Gunicorn WSGI Worker Server
  • Instant Static Asset Caching                                  │
                                                                  ▼
                                                   [ Render Managed PostgreSQL ]
                                                     • Connection Pooling (conn_max_age=600)
                                                     • Persistent Portfolio Data & Audit Logs
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

### Option B: Manual Service Creation
1. **Create Database:**
   - Click **New +** → **PostgreSQL**.
   - Name: `suryakiran-portfolio-db`
   - Region: Choose closest to your audience (e.g., Singapore or Frankfurt).
   - Plan: Free.
   - Copy the **Internal Database URL**.

2. **Create Web Service:**
   - Click **New +** → **Web Service**.
   - Connect repository: `skiran-ai/suryakiranpj`.
   - **Root Directory:** `backend`
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command:** `gunicorn portfolio_backend.wsgi:application --bind 0.0.0.0:$PORT`

---

## Step 2: Backend Environment Variables Configuration

Set the following environment variables in your Render Web Service dashboard (**Environment** tab):

| Variable | Recommended Production Value | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(Generate a 50+ char random string)* | Cryptographic signing key (NO hardcoded fallback) |
| `DJANGO_DEBUG` | `False` | Disables debug mode in production |
| `DATABASE_URL` | *(Render auto-links from PostgreSQL)* | Connection string for PostgreSQL |
| `DJANGO_ALLOWED_HOSTS` | `api.yourdomain.com,your-service.onrender.com` | Allowed incoming hostnames (comma-separated) |
| `CORS_ALLOWED_ORIGINS` | `https://yourdomain.com,https://your-site.netlify.app` | Allowed frontend origins (comma-separated) |
| `CSRF_TRUSTED_ORIGINS` | `https://yourdomain.com,https://your-site.netlify.app` | Trusted CSRF origins (comma-separated) |
| `GEMINI_API_KEY` | *(Your Google AI Studio API Key)* | Required for grounded KIRAN AI Assistant |
| `SECURE_SSL_REDIRECT` | `True` | Enforces HTTPS redirection |
| `SESSION_COOKIE_SECURE` | `True` | Restricts cookies to HTTPS |
| `CSRF_COOKIE_SECURE` | `True` | Restricts CSRF tokens to HTTPS |

> [!TIP]
> Generate a secure `DJANGO_SECRET_KEY` locally:
> ```bash
> python -c "import secrets; print(secrets.token_urlsafe(50))"
> ```

---

## Step 3: Initialize Database & Admin Superuser

Once the Render build completes successfully:

1. In the Render Dashboard, open the Web Service and click **Shell**.
2. Create your Django Admin superuser:
   ```bash
   python manage.py createsuperuser
   ```
   Follow prompts to enter your username, email, and secure password.

3. Seed initial portfolio data (Idempotent — safe to run on empty DB):
   ```bash
   python manage.py seed_portfolio_data
   ```

4. Verify Admin access:
   - Navigate to `https://<your-render-service>.onrender.com/admin/`
   - Log in with the superuser credentials created above.

---

## Step 4: Netlify Frontend Connection

1. Log in to [Netlify Dashboard](https://app.netlify.com/).
2. Select your site.
3. Go to **Site Configuration** → **Environment variables**.
4. Add the production API base URL variable:
   ```
   VITE_API_BASE_URL = https://<your-render-service>.onrender.com
   ```
   *(Or `https://api.yourdomain.com` once custom DNS is mapped).*

5. Trigger a new deploy:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**.

6. Verify that frontend API calls successfully reach your Django backend.

---

## Step 5: Custom Domain & DNS Mapping (Optional)

When you are ready to attach a custom domain (e.g. `yourdomain.com`):

### 1. Frontend DNS (Netlify)
- In Netlify, go to **Domain management** → **Add custom domain** (`yourdomain.com`).
- Add DNS records at your domain registrar:
  - **Apex (`@`):** `A` record pointing to Netlify Load Balancer IP (`75.2.60.5`)
  - **Subdomain (`www`):** `CNAME` pointing to `<your-site-name>.netlify.app`

### 2. Backend DNS (Render)
- In Render Web Service, go to **Settings** → **Custom Domains** → **Add Custom Domain** (`api.yourdomain.com`).
- Add DNS record at your domain registrar:
  - **Subdomain (`api`):** `CNAME` pointing to `<your-service-name>.onrender.com`

### 3. Update Environment Variables
- In Render:
  ```
  DJANGO_ALLOWED_HOSTS = api.yourdomain.com,your-service.onrender.com
  CORS_ALLOWED_ORIGINS = https://yourdomain.com,https://www.yourdomain.com,https://your-site.netlify.app
  CSRF_TRUSTED_ORIGINS = https://yourdomain.com,https://www.yourdomain.com,https://your-site.netlify.app
  ```
- In Netlify:
  ```
  VITE_API_BASE_URL = https://api.yourdomain.com
  ```

---

## Step 6: Post-Deployment Verification Checklist

- [ ] `GET https://<api-url>/api/health/` returns `{"status": "healthy", "services": {"database": "ONLINE"}}`
- [ ] `GET https://<api-url>/api/profile/` returns JSON profile payload
- [ ] `POST https://<api-url>/api/ai/chat/` with `{"message": "skills"}` returns grounded AI response
- [ ] `https://<frontend-url>/` loads Three.js 3D background without console errors
- [ ] Command Palette (`Ctrl + K`) opens and navigates sections smoothly
- [ ] Project X-Ray architecture modal opens and displays system specifications
- [ ] Direct URL refresh on `/cv` or `/projects` loads correctly (no 404)
- [ ] Contact form submission saves to database and appears in `/admin/`
- [ ] Switching SiteSetting to `PRIVATE` in admin shields public endpoints with 503 status
