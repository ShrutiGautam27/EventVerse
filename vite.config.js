import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Keep provider credentials server-side and make the same endpoint available in local Vite development.
  if (env.TICKETMASTER_API_KEY && !process.env.TICKETMASTER_API_KEY) {
    process.env.TICKETMASTER_API_KEY = env.TICKETMASTER_API_KEY
  }

  return {
    plugins: [
      react(),
      {
        name: 'eventverse-local-event-api',
        configureServer(server) {
          server.middlewares.use('/api/events', async (req, res) => {
            res.status = (code) => { res.statusCode = code; return res }
            res.json = (payload) => {
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify(payload))
              return res
            }
            try {
              const { default: handler } = await import('./api/events.js')
              await handler(req, res)
            } catch {
              if (!res.writableEnded) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({ error: 'Local event feed failed', events: [] }))
              }
            }
          })
        },
      },
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
    },
  }
})
