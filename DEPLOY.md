# Deploying to cPanel (public_html)

This file explains how to prepare and upload the production build to a typical cPanel `public_html` folder and includes a short security checklist for this static site.

1) Build the production bundle

   - From the project root run:

     npm run build

   - Confirm `dist/index.html` exists and the `dist/assets` and `dist/media` (if used) folders are present.

2) Create a zip of the `dist/` folder (Windows PowerShell)

   - From the project root run:

     Compress-Archive -Path dist\* -DestinationPath site-dist-full.zip -Force

   - (Linux/macOS) from project root run:

     zip -r site-dist-full.zip dist/

3) Upload to cPanel

   Option A — cPanel File Manager (recommended for quick deploy):
   - Log into cPanel, open File Manager and navigate to `public_html`.
   - Delete or backup any old site files (if replacing an existing site).
   - Upload `site-dist-full.zip` to `public_html`.
   - Select the zip file and click "Extract" to place the contents at `public_html/`.
   - Verify `public_html/index.html` is present and open the site in browser.

   Option B — FTP / SFTP / FTPS:
   - Connect to the cPanel server using your FTP client (FileZilla, WinSCP). Use SFTP if available.
   - Upload the *contents* of the `dist/` folder (not the `dist/` parent directory) into `public_html/`.
   - Ensure `index.html` is at the root of `public_html/`.

4) Post-deploy checks

   - Open the site URL and confirm the site loads without 404s for assets.
   - On the live site, open browser devtools Network tab and refresh to confirm no 404s for scripts, CSS, or images.
   - If images or assets use absolute paths, verify those paths are correct for your host.

5) Security notes (important)

   - Admin access in this project is client-side only and stored in browser `localStorage`. This is suitable for local/testing or private cPanel deployments but not for public production.
   - Rotate the admin password before publishing. From the Admin Dashboard: open `Security` and set a new password (stored to `localStorage` key `adi_tech_admin_password_v1`).
   - Do NOT commit secrets or passwords into repository files. If you accidentally committed a password, rotate it now and remove the secret from the repo history.
   - For production-grade security, implement server-side authentication (a simple PHP, Node, or serverless endpoint) and move admin controls behind authenticated endpoints.

6) Troubleshooting

   - If you see blank pages or JS errors: open browser devtools Console and report the errors.
   - If assets are missing after extract: ensure you uploaded the `assets/`, `media/`, and `tech-icons/` folders from `dist/` into `public_html/`.

7) Quick commands summary

   npm run build
   Compress-Archive -Path dist\\* -DestinationPath site-dist-full.zip -Force   # Windows PowerShell
   zip -r site-dist-full.zip dist/                                         # Linux/macOS

---

If you'd like, I can also add a small `deploy.ps1` script that automates zipping and optionally uploads via FTP (you'll need credentials). Tell me to proceed and I'll add it.
