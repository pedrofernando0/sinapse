const DEFAULT_TIMEOUT_MS = 5000;

const normalizeBaseUrl = (value = '') => value.trim().replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = null, code = 'API_ERROR', details = null, cause = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.cause = cause;
  }
}

export function getApiBaseUrl() {
  return normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || '');
}

export function isApiConfigured() {
  return Boolean(getApiBaseUrl());
}

const buildApiUrl = (path) => {
  if (!path) {
    throw new ApiError('API path is required.', { code: 'CONFIG_ERROR' });
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath}`;
};

const buildRequestHeaders = (headers, hasBody) => {
  const nextHeaders = new Headers(headers);

  if (hasBody && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  if (!nextHeaders.has('Accept')) {
    nextHeaders.set('Accept', 'application/json');
  }

  return nextHeaders;
};

const parseResponseBody = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
};

const normalizeUnknownError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.name === 'AbortError') {
    return new ApiError('The request timed out.', {
      code: 'TIMEOUT_ERROR',
      cause: error,
    });
  }

  return new ApiError('Unable to reach the API.', {
    code: 'NETWORK_ERROR',
    cause: error,
  });
};

export async function apiRequest({
  path,
  method = 'GET',
  headers = {},
  body,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  signal,
} = {}) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const abortListener = signal ? () => controller.abort() : null;

  if (signal && abortListener) {
    signal.addEventListener('abort', abortListener, { once: true });
  }

  try {
    const response = await fetch(buildApiUrl(path), {
      method,
      headers: buildRequestHeaders(headers, body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiError(
        payload?.message || `Request failed with status ${response.status}.`,
        {
          status: response.status,
          code: payload?.code || 'HTTP_ERROR',
          details: payload,
        }
      );
    }

    return payload;
  } catch (error) {
    throw normalizeUnknownError(error);
  } finally {
    globalThis.clearTimeout(timeoutId);

    if (signal && abortListener) {
      signal.removeEventListener('abort', abortListener);
    }
  }
}
