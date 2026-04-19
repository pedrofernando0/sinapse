import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

const resolveEnvValue = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];

    if (value) {
      return value;
    }
  }

  return '';
};

export function getSupabaseServerConfig() {
  return {
    publishableKey: resolveEnvValue(
      'SUPABASE_PUBLISHABLE_KEY',
      'VITE_SUPABASE_PUBLISHABLE_KEY',
    ),
    url: resolveEnvValue('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  };
}

export function isSupabaseServerConfigured() {
  const { publishableKey, url } = getSupabaseServerConfig();
  return Boolean(url && publishableKey);
}

export function createSupabaseServerClient(request) {
  const responseHeaders = new Headers();

  if (!isSupabaseServerConfigured()) {
    return {
      configured: false,
      responseHeaders,
      supabase: null,
    };
  }

  const { publishableKey, url } = getSupabaseServerConfig();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, options, value }) => {
          responseHeaders.append(
            'set-cookie',
            serializeCookieHeader(name, value, options),
          );
        });
      },
    },
  });

  return {
    configured: true,
    responseHeaders,
    supabase,
  };
}
