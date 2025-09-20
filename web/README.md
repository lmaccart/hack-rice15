# web/

This folder should contain the React web app. Suggested minimal setup:

- `web/package.json` with `start`, `build`, and `test` scripts (e.g., created by `create-react-app` or Vite).
- Place source under `web/src/` and static assets under `web/public/`.

How to bootstrap locally (example using Vite + React):

```bash
cd web
npm init vite@latest . -- --template react
npm install
npm run dev
```

If you prefer `create-react-app` or TypeScript, adapt accordingly.
