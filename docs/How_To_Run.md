# How to run

1. Install dependencies

```bash
cd edge-proctor
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the URL printed by Vite (default http://localhost:5173)

Notes

- Allow camera access when prompted.
- For best performance, use Chrome/Edge and close other camera-using apps.

Custom domain / DNS

- To use a custom domain, replace the `CNAME` file at the repo root with your domain, for example `www.example.com` or `example.com`.
- If you use a `www` subdomain, add a DNS `CNAME` record pointing `www` to `vamsigavara-png.github.io`.
- For apex domains (`example.com`) add A records pointing to GitHub Pages IPs:
	- `185.199.108.153`
	- `185.199.109.153`
	- `185.199.110.153`
	- `185.199.111.153`

After updating DNS and the `CNAME` file, trigger the `Manual Pages Deploy` workflow in Actions, or push to `main` to auto-deploy.
