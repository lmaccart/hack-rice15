<!-- .github/copilot-instructions.md -->
# Copilot / AI agent instructions — hack-rice15

Purpose: give an AI coding assistant the minimum, actionable context to be productive in this repository.

Quick state (discovered):
- Repository currently contains only `README.md` and `.git/` at the project root. `README.md` states this project targets React (web), React Native (mobile), Firebase, Gemini and Google Cloud Platform.

What to do first (high-value scaffolding steps):
1. Read `README.md` (root) to confirm team, goals, and stack assumptions.
2. Look for standard project files before making changes: `package.json`, `pnpm-lock.yaml` / `yarn.lock`, `android/`, `ios/`, `web/` or `mobile/`, `functions/`, `firebase.json`, `.firebaserc`. If none exist, do not assume build commands — ask the repo owner or create a minimal manifest before implementing build changes.

How this repo typically organizes work (inferred from README):
- Frontend: React (web) and React Native (mobile). Expect `package.json` at repo root or per-platform packages (e.g., `web/package.json`, `mobile/package.json`).
- Backend / cloud: Firebase (Realtime/Firestore, Functions, Hosting), Google Cloud for hosting or APIs, and Gemini used for assistant/AI features.

Agent-specific editing rules (actionable):
- Do not add or run build/test scripts unless `package.json` (or other manifest) is present. Instead, add a short PR or issue template and request missing manifests.
- When creating new files, place web React code under `web/` or `frontend/`, and React Native code under `mobile/` or `app/`. If the repo owner prefers a different layout, ask before large moves.
- For Firebase changes: prefer adding or updating `functions/`, `firebase.json`, and `.firebaserc`. Keep Firebase service account keys out of repo (never create files with secrets). If a Cloud Function is required, add source under `functions/src/` and update `firebase.json`.

Examples and patterns to follow (if present):
- Typical React start script (if `package.json` exists): `npm run start` or `pnpm start`. Test script: `npm test`.
- Typical React Native commands: `npx react-native run-ios` / `npx react-native run-android` (only attempt if an `android/` or `ios/` folder exists).
- Firebase emulator usage (if `firebase.json` present): `firebase emulators:start`.

What NOT to do:
- Don’t invent CI, build, or deploy scripts without discovering existing manifests. Instead, open an issue asking the maintainers for intended repo layout and CI preferences.
- Never add secrets, service account JSON, or API keys to the repo. Suggest use of GitHub Secrets, `.env` files excluded via `.gitignore`, or Secret Manager.

If you need to run or test code but the repo is incomplete:
1. Describe exactly which files are missing (e.g., `package.json`, `src/`), and propose a minimal manifest you can create (show the `package.json` you plan to add).
2. Offer safe, small PRs that add scaffolding (for example: `package.json` with scripts, `.gitignore`, and a `web/README.md` describing how to run each part).

Notes for future maintainers: when adding more code, update this file to reflect concrete build commands and folder layout. If you maintain a monorepo, include a top-level `pnpm-workspace.yaml` or `package.json` with workspaces and document per-package commands here.

Where to look next (important files to add or inspect when they appear):
- `package.json`, `web/` or `frontend/`, `mobile/`, `android/`, `ios/`, `functions/`, `firebase.json`, `.firebaserc`, `.env.example`.

If anything here is unclear or you want me to assume a standard layout and scaffold a minimal project (React + RN + Firebase), tell me which parts to scaffold and I will create a small, non-invasive starter (manifest + READMEs) for review.
