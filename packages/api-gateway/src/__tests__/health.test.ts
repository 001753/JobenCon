/**
 * Integration test — API Gateway health endpoint
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';

// Set env sebelum import app
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret-that-is-at-least-32-chars-long';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-that-is-at-least-32-chars';

let app: FastifyInstance;

beforeAll(async () => {
  const { buildApp } = await import('../app.js');
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /health', () => {
  it('returns 200 with healthy status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body) as {
      status: string;
      service: string;
    };
    expect(body.status).toBe('healthy');
    expect(body.service).toBe('api-gateway');
  });
});

describe('GET /', () => {
  it('returns service info', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body) as { service: string };
    expect(body.service).toContain('Joben Connect');
  });
});

describe('Rate limiting', () => {
  it('applies rate limit headers', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    // Rate limit headers harus ada
    expect(response.headers['x-ratelimit-limit']).toBeDefined();
  });
});
