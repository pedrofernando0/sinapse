import { handleApiRequest } from '../src/server/api/router.js';

const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);

async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function toWebRequest(req) {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host ?? 'localhost:5173';
  const url = new URL(req.url, `${protocol}://${host}`);
  const body = METHODS_WITHOUT_BODY.has(req.method.toUpperCase())
    ? undefined
    : await readRequestBody(req);

  return new Request(url, {
    body,
    headers: req.headers,
    method: req.method,
  });
}

async function writeWebResponse(res, response) {
  if (typeof response.headers.getSetCookie === 'function') {
    const setCookies = response.headers.getSetCookie();

    if (setCookies.length > 0) {
      res.setHeader('Set-Cookie', setCookies);
    }
  } else {
    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }
  }

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      res.setHeader(key, value);
    }
  });

  res.statusCode = response.status;

  if (!response.body) {
    res.end();
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  res.end(Buffer.from(arrayBuffer));
}

export default async function handler(req, res) {
  const request = await toWebRequest(req);
  const response = await handleApiRequest(request);
  await writeWebResponse(res, response);
}
