IndexNow setup
==============

To enable IndexNow pings (used by Bing, Yandex, Seznam, Naver),
do this once per domain:

1. Generate a key:
     openssl rand -hex 16
   (Any 8–128 hex character string works.)

2. Save the key file at the root of this directory:
     public/<your-key>.txt
   The file contents must be exactly the key, no newline.

3. Add two repo secrets in GitHub:
     SITE_URL        e.g. https://yourdomain.com
     INDEXNOW_KEY    the same key

4. Deploy. The file will be available at
     https://yourdomain.com/<your-key>.txt

The Sitemap Ping workflow under .github/workflows reads both secrets
and pings the IndexNow API whenever a game JSON changes on `main`.

This README is harmless — IndexNow only requires the <key>.txt file.
