import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
import { ADMIN_CORS, AUTH_CORS, BACKEND_URL, COOKIE_SECRET, DATABASE_URL, JWT_SECRET, REDIS_URL, RESEND_API_KEY, RESEND_FROM_EMAIL, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SHOULD_DISABLE_ADMIN, STORE_CORS, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET, WORKER_MODE, MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET, MEILISEARCH_HOST, MEILISEARCH_ADMIN_KEY } from 'lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
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
            resolve: '@medusajs/file-s3',
            id: 'minio',
            options: {
              s3_url: MINIO_ENDPOINT,
              bucket: MINIO_BUCKET || 'medusa-media', // Указываем твой бакет
              aws_access_key_id: MINIO_ACCESS_KEY,
              aws_secret_access_key: MINIO_SECRET_KEY,
              region: 'us-east-1',
            },
          },
        ],
      },
    },
    {
      key: Modules.SEARCH,
      resolve: '@medusajs/search-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY,
        },
      },
    },
  ],
  plugins: [],
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);