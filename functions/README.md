# functions/

This folder should contain Firebase Cloud Functions source (Node.js + Firebase SDK).

Suggested layout:
- `functions/package.json` with `start` (local emulator), `deploy` scripts.
- `functions/src/index.js` or `functions/src/index.ts` for exported functions.

To bootstrap functions:

```bash
cd functions
npm init -y
npm install firebase-functions firebase-admin
# add scripts for emulation and deploy
```

Keep service account keys and other secrets out of the repo. Use `firebase login` and GitHub Secrets for CI.
