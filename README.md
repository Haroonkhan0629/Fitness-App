# Fitness App 

Unified project workspace containing the Fit2Go mobile web frontend and the Django REST backend.

## Project Components

- `nutrition-app/` -> frontend repository (React mobile web app)
- `nutrition-backend/` -> backend repository (Django REST API)

## Tools, Languages, and Frameworks

### Frontend

- JavaScript (ES6+)
- React 18
- React Router DOM
- Axios
- Bootstrap and Reactstrap
- Google OAuth
- Node.js and npm
- Netlify (deployment)

### Backend

- Python 3.11+
- Django 4.2
- Django REST Framework
- Token Authentication (DRF auth token)
- django-cors-headers
- WhiteNoise
- Gunicorn
- SQLite (local development)
- PostgreSQL (production)
- Render (deployment)

### General

- Git and GitHub
- VS Code

## Mobile App Notice

Fit2Go is a mobile app experience delivered through the browser.

When testing on desktop browsers, use the Inspect popup and switch to mobile mode:

1. Open the app in Chrome or Edge.
2. Right-click the page and select **Inspect** (a side panel opens).
3. In the Inspect panel, click the **phone/tablet icon** (Toggle device toolbar).
4. Pick a mobile device from the top dropdown (for example iPhone or Pixel).
5. Refresh the page and continue testing in mobile view.

## Prerequisites

Install before setup:

- Git
- Node.js 18+ and npm
- Python 3.11+ and pip

Verify:

```bash
git --version
node -v
npm -v
python --version
pip --version
```

## Step-by-Step Setup

### 1. Open Workspace Root

```bash
cd "Fitness App"
```

### 2. Setup Backend

```bash
cd nutrition-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata exercise.json
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

### 3. Setup Frontend

Open a new terminal:

```bash
cd "Fitness App/Fit2go/nutrition-app"
npm install
```

Create `.env.local` with:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

Run frontend:

```bash
npm start
```

Frontend runs at `http://localhost:3000`.

### 4. Validate End-to-End

- Ensure backend terminal is running
- Open frontend in browser
- Switch to mobile viewport in inspect mode
- Confirm exercise list loads from API

## Deployment Notes

- Frontend: Netlify
  - Build command: `npm run build`
  - Publish directory: `build`
  - Env var: `REACT_APP_BACKEND_URL=<render-backend-url>`
- Backend: Render
  - Build command: `./build.sh`
  - Start command: `gunicorn nutrition_app.wsgi:application`
  - Use PostgreSQL in production

## Git and Branching Impact

Moving folders on your local machine does not ruin branches.

- Branch history stays intact inside each repository's `.git` folder
- Remotes and existing branches still work as normal
- You still have two separate repositories (frontend and backend)
- Deployments continue based on whichever repo/branch Netlify and Render track

## User Data Ownership

Exercise items are user-specific. When a user signs in, their create, edit, delete, and bookmark actions apply only to their own records. These records are stored and persisted for that individual account, so one user's changes do not modify another user's data.

## Summary

Built a mobile-first fitness web application where users can browse, search, create, edit, delete, and bookmark exercise records. The frontend is a React app styled with Bootstrap and secured with Google OAuth, served through Netlify. The backend is a Django REST API with token-based authentication, connected to a SQLite database locally and PostgreSQL in production on Render.
