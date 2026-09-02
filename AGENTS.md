# Base44 notes

Single-file Flask app (`app.py`) serving `index.html` + `style.css`/`script.js` from the repo root.

- Run: `docker compose -f docker-compose.base44.yml up -d` (Flask dev server with reload, host port 3000 -> container 5000).
- `Flask(static_url_path='')` is required so `/style.css` and `/script.js` resolve from the repo root.
- `POST /api/chat` returns canned intent replies; no external API key is used yet (`openai` is in requirements but unused).
