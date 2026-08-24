# RPSF Training & Trainee Management System — POC

A self-contained, browser-based local POC for the RPSF Training Centre, Gorakhpur. It demonstrates the complete administrative and trainee flow with realistic seed data and local persistence. It is intentionally dependency-free so it can be opened immediately in an IDE.

## Run

```powershell
npx serve . -l 3000
# open http://localhost:3000
```

Or use the included deployment server (no package installation required):

```powershell
npm.cmd start
```

Alternatively open `index.html` directly. Use **Reset demo data** from the login screen to return to the starting scenario.

## Demo credentials

| Role | Login | Password |
|---|---|---|
| Super Admin | admin@rpsf.local | Admin@123 |
| Training Admin | training@rpsf.local | Training@123 |
| Instructor | instructor@rpsf.local | Instructor@123 |
| Exam Cell | exam@rpsf.local | Exam@123 |
| Trainee (Rahul Kumar) | trainee@rpsf.local | Rahul@123 |

Passwords are sample-only; the POC stores a derived browser value, never the displayed password. A production service must use server-side Argon2/bcrypt hashes and HTTP-only sessions.

## Included P0 workflow

- Role-aware sign-in and protected screens
- Course, batch, trainee, enrollment, attendance, material and question-bank management
- Registration IDs, examination applications, approval and roll-number allocation
- Timed objective examination with persisted answers, automatic evaluation and one completed attempt
- Result verification/publication, certificate issuance, printable certificate and public certificate verification
- CSV exports, printable roll/attendance lists, audit activity and in-app notifications
- Self-registration verification queue with approval/rejection remarks
- Detailed editable examination applications, including parent data and document metadata
- Administrator-controlled examination date/time window, MCQ and subjective question authoring, and PDF question-paper records

## Architecture / production handoff

This POC persists in `localStorage` so its entire demo can run without a service. Replace `Store` in `app.js` with authenticated REST endpoints backed by PostgreSQL (Prisma is a suitable ORM), server-side validation, object storage, and a PDF/QR generation worker. Deploy behind Nginx with TLS:

`Internet → Nginx / TLS → Node application → PostgreSQL + S3-compatible storage`

Set the values in `.env.example`, run migrations and seed data during deployment, run `npm run build` (for the future application), and use systemd/PM2. Back up PostgreSQL daily and object storage versioned snapshots. Point DNS for a domain such as `training.example.gov.in` to the reverse proxy and issue TLS certificates with Certbot.

## Deploy this POC on Linux

The repository includes a dependency-free Node static server, a Dockerfile, Nginx example, and systemd service. On Ubuntu/Debian with Node 22:

```bash
sudo mkdir -p /opt/rpsf-ttms
sudo chown "$USER" /opt/rpsf-ttms
# copy this project into /opt/rpsf-ttms
cd /opt/rpsf-ttms
node --check app.js
node server.js
```

For a persistent service, copy `deploy/systemd/rpsf-ttms.service` to `/etc/systemd/system/`, then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rpsf-ttms
sudo cp nginx/ttms.conf /etc/nginx/sites-available/rpsf-ttms
sudo ln -s /etc/nginx/sites-available/rpsf-ttms /etc/nginx/sites-enabled/rpsf-ttms
sudo nginx -t && sudo systemctl reload nginx
```

Update `server_name` first, point DNS to the server, and issue TLS with Certbot. Alternatively:

```bash
docker build -t rpsf-ttms-poc .
docker run -d --restart unless-stopped -p 3000:3000 --name rpsf-ttms rpsf-ttms-poc
```

Important: this deploys the **POC UI only**. Every browser has separate local demo data and its own session. Do not use it for live trainee data, documents, examinations, or certificates until a real backend (PostgreSQL, server authentication/authorization, object storage, server-generated PDFs, and server-side exam timing) has replaced the POC storage layer.

## Publish the POC with GitHub Pages

All source files required for GitHub Pages are included in this repository: `index.html`, `style.css`, `app.js`, `404.html`, `.nojekyll`, and `.github/workflows/deploy-pages.yml`.

1. Create a GitHub repository and push this complete project to its `main` branch.
2. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for **Deploy TTMS POC to GitHub Pages** to succeed.
4. GitHub will show the public Pages URL, normally `https://<account>.github.io/<repository>/`.

No GitHub secret is needed for this static POC. GitHub Pages cannot run `server.js`, Docker, PostgreSQL, or a protected API. It is appropriate for a design demonstration only, not a live government/training management system.

## Verification

```powershell
npm test
```

## Current POC limitations

The static POC has no production database, upload service, real PDF binary generator, or server-enforced authorization. Uploaded document and question-paper names are stored as metadata only; production must validate, virus-scan, store and authorize actual file access server-side. The exam timing control is enforced in the POC browser, and must be duplicated server-side before real deployment.
