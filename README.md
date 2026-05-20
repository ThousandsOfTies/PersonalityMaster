# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Backend API server

This project now includes a backend proxy server in `server/index.js` for Cloud Run.

- The frontend calls `VITE_API_URL` or local `/api` instead of sending a Gemini API key from the browser.
- The backend reads `GEMINI_API_KEY` from environment variables and forwards AI requests to Gemini.
- Run locally with `npm run dev:server` and `npm run dev`.

Currently, the backend supports:

- `GET /api/health`
- `POST /api/generate` with `{ prompt, model }`

## Cloud Run deployment

1. Create a secret in Secret Manager:

```powershell
$projectId = "YOUR_PROJECT_ID"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=- --project $projectId
```

2. Build and deploy the container:

```powershell
gcloud config set project YOUR_PROJECT_ID
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/personalitymaster-api
gcloud run deploy personalitymaster-api --image gcr.io/YOUR_PROJECT_ID/personalitymaster-api --region asia-northeast1 --platform managed --allow-unauthenticated --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

3. After deployment, set `VITE_API_URL` to `https://YOUR_SERVICE_URL/api` when building the frontend.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
