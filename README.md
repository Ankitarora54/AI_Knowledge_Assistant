# AI Knowledge Assistant

React/Vite frontend with an Express backend.

## Local Development

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Verify it at:

```text
http://localhost:5000/health
```

Update `backend/.env` with the real database and service credentials. Use
`DATABASE_SSL=false` for local Postgres and `true` for hosted databases that
require SSL.

### Frontend

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and defaults to:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

## Deploy Backend To Render

The root [render.yaml](render.yaml) defines the backend web service.

1. Push the repository to GitHub or GitLab.
2. In Render, create a Blueprint and select this repository.
3. Provide the secret environment variables requested by the Blueprint.
4. Set `CORS_ORIGINS` to the deployed frontend origin, for example:

```text
https://your-frontend.example.com
```

For multiple frontend origins, separate them with commas.

Render supplies `PORT` automatically. The backend listens on that port and
binds to `0.0.0.0`.

## Deploy Frontend

The frontend is a standard Vite static build:

```powershell
cd frontend
npm ci
npm run build
```

Publish the generated `frontend/dist` directory on any static host. Configure
this build-time environment variable:

```text
VITE_API_BASE_URL=https://ai-knowledge-assistant-y5pw.onrender.com/api
```

This value is also defined in `frontend/.env.production`, which Vite loads
automatically for `npm run build`. Local `npm run dev` still uses
`http://localhost:5000/api`.

After the frontend is deployed, add its exact origin to the backend
`CORS_ORIGINS` value in Render.

## Security

Never commit `.env` files. Before publishing this repository, rotate any API
keys or credentials that have previously been shared or exposed.
