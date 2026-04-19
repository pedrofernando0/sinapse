import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('vercel SPA routing', () => {
  it('rewrites deep links to index.html', () => {
    const configPath = path.resolve(process.cwd(), 'vercel.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));

    expect(config.rewrites).toContainEqual({
      source: '/(.*)',
      destination: '/index.html',
    });
  });
});
