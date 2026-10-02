/**
 * API entrypoint.
 *
 * Environment is validated before the server binds a port, so a misconfigured
 * deployment fails immediately instead of accepting traffic it cannot serve
 * (architecture §57).
 */
import { createApp } from './app.js';
import { getEnv } from './config/env.js';

function main(): void {
  const env = getEnv();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.info(`tarn-api listening on http://localhost:${env.PORT}${''}`);
    console.info(`  health:  http://localhost:${env.PORT}/api/v1/health`);
  });

  const shutdown = (signal: string): void => {
    console.info(`${signal} received, shutting down.`);
    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
