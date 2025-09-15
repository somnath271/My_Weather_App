# WeatherScope

A real-time weather forecast application that provides accurate weather information for any city worldwide.

## Run locally

1. Create `.env.local` in project root:

```
OPENWEATHERMAP_API_KEY=your_real_key
```

2. Install CLI (recommended to use latest):

```
npm i -g vercel@latest
```

3. Install dependencies (none required, but safe to run):

```
npm install
```

4. Start dev server:

```
vercel dev --yes
```

- If port is busy: `vercel dev --yes --listen 3001`

Open:

- App: http://localhost:3000
- API: http://localhost:3000/api/weather?city=London
- API: http://localhost:3000/api/search-city?q=lon

## Deploy via GitHub → Vercel

1. Push to GitHub.
2. In Vercel Dashboard, Import the repo.
3. Add Environment Variable:
   - `OPENWEATHERMAP_API_KEY`
4. Deploy.
