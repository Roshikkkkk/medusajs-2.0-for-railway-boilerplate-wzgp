import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
import { ADMIN_CORS, AUTH_CORS, BACKEND_URL, COOKIE_SECRET, DATABASE_URL, JWT_SECRET, REDIS_URL, RESEND_API_KEY, RESEND_FROM_EMAIL, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SHOULD_DISABLE_ADMIN, STORE_CORS, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET, WORKER_MODE } from 'lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: true, // Логи для отладки
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
      healthCheck: {
        path: '/health',
        healthy: async () => {
          try {
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
          } catch (e) {
            console.error("Healthcheck failed:", e);
            return false;
          }
        },
      },
    },
    build: {
      rollupOptions: {
        external: ["@medusajs/dashboard"],
      },
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'uploads',
              backend_url: `${BACKEND_URL}/uploads`,
            },
          },
        ],
      },
    },
  ],
  plugins: [],
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);