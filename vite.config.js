import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function apiDevServerPlugin(env) {
  // Inject loaded environment variables into process.env so API handlers can access SMTP credentials
  Object.assign(process.env, env);

  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const parsedUrl = new URL(req.url, 'http://localhost');
          req.query = Object.fromEntries(parsedUrl.searchParams.entries());
          const relativePath = parsedUrl.pathname.replace(/^\/api\//, '');
          const jsFilePath = path.resolve(process.cwd(), 'api', `${relativePath}.js`);

          if (fs.existsSync(jsFilePath)) {
            try {
              const runHandler = async () => {
                if (!res.json) {
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  };
                }
                if (!res.status) {
                  res.status = (code) => {
                    res.statusCode = code;
                    return res;
                  };
                }
                try {
                  const mod = await server.ssrLoadModule(`./api/${relativePath}.js`);
                  const handler = mod.default || mod;
                  await handler(req, res);
                } catch (handlerErr) {
                  console.error(`[API Dev Server Error] ${req.url}:`, handlerErr);
                  if (!res.headersSent) {
                    res.status(500).json({ error: handlerErr.message });
                  }
                }
              };

              if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
                await runHandler();
                return;
              }

              let rawBody = '';
              req.on('data', chunk => { rawBody += chunk; });
              req.on('end', async () => {
                req.body = rawBody;
                await runHandler();
              });
              return;
            } catch (err) {
              console.error(`[API Dev Server Middleware Error] ${req.url}:`, err);
            }
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin(env)],
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('framer-motion') || id.includes('lucide-react')) {
                return 'vendor-ui';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
            }
          }
        }
      }
    }
  };
});