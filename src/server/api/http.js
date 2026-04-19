export async function parseJsonBody(request) {
  const rawBody = await request.text();

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

export function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

export function errorResponse(message, { code = 'API_ERROR', details = null, status = 500 } = {}) {
  return jsonResponse(
    {
      code,
      details,
      message,
    },
    { status },
  );
}

export function noContentResponse(headers) {
  return new Response(null, {
    headers,
    status: 204,
  });
}

export function mergeHeaders(...headerGroups) {
  const mergedHeaders = new Headers();

  headerGroups.filter(Boolean).forEach((headers) => {
    new Headers(headers).forEach((value, key) => {
      mergedHeaders.append(key, value);
    });
  });

  return mergedHeaders;
}
