# AdvisorFlow AI

AdvisorFlow AI is a lightweight operational CRM for Nigerian insurance advisors, brokers, and small agencies. The MVP focuses on one painful problem: missed policy renewals and poor client organization.

## MVP scope

- Advisor registration, login, logout, JWT refresh, and basic password reset
- Advisor dashboard with client, policy, renewal, and activity metrics
- Client CRUD with policy provider, type, start date, expiry date, and notes
- Renewal reminders generated 7 days before expiry, on expiry date, and after expiry
- Dashboard alerts and email notification trigger for due reminders
- Advisor activity timeline
- Education Hub content in English, Yoruba, Hausa, and Igbo
- Subscription-ready advisor profile field with no payment integration yet

## Tech stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Django, Django REST Framework, SimpleJWT
- Database: PostgreSQL in production via `DATABASE_URL`
- Deployment targets: Vercel frontend, Render backend

## Local setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_education
python manage.py runserver
```

The backend uses SQLite when `DATABASE_URL` is not set so local development is fast. Set `DATABASE_URL` to a PostgreSQL connection string for production.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the deployed backend API URL on Vercel.

## Production notes

- Run `python manage.py send_due_reminders` on a daily Render cron job to send due renewal emails.
- Configure a real SMTP backend for production email reminders and password reset.
- Use Render PostgreSQL for the backend database.
- Cloudinary environment variables are included for future document/image storage but no document workflow is part of this MVP.
