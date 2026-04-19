import { errorResponse, jsonResponse, parseJsonBody } from './http.js';
import { createSupabaseServerClient } from './supabase.js';

const VALID_PROFILES = new Set(['aluno', 'professor']);

const normalizeEmail = (value = '') => value.trim().toLowerCase();
const normalizeProfile = (value = '') =>
  VALID_PROFILES.has(value) ? value : 'aluno';

const buildUserName = (user, profileRow) =>
  profileRow?.full_name ??
  user?.user_metadata?.full_name ??
  user?.email?.split('@')[0] ??
  'Usuário';

const buildHiddenViews = (profileRow) =>
  Array.isArray(profileRow?.hidden_student_views)
    ? profileRow.hidden_student_views
    : [];

const buildProfilePayload = (user, profileRow) => ({
  email: user?.email ?? '',
  full_name: profileRow?.full_name ?? buildUserName(user, profileRow),
  hidden_student_views: buildHiddenViews(profileRow),
  role: normalizeProfile(profileRow?.role),
  user_id: user?.id ?? '',
});

const buildSessionPayload = (user, profileRow) => ({
  email: user?.email ?? '',
  hiddenStudentViews: buildHiddenViews(profileRow),
  name: buildUserName(user, profileRow),
  profile: normalizeProfile(profileRow?.role),
  userId: user?.id ?? '',
});

async function syncProfileRow(supabase, user, requestedProfile) {
  const fallbackProfile = normalizeProfile(
    requestedProfile ?? user?.user_metadata?.role ?? 'aluno',
  );
  const fullName =
    user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Usuário';

  let profileRow = null;

  try {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, hidden_student_views, role')
      .eq('user_id', user.id)
      .maybeSingle();

    profileRow = data ?? null;
  } catch {
    profileRow = null;
  }

  const nextProfileRow = {
    email: user.email,
    full_name: profileRow?.full_name ?? fullName,
    hidden_student_views: buildHiddenViews(profileRow),
    role: profileRow?.role ?? fallbackProfile,
    user_id: user.id,
  };

  try {
    await supabase.from('profiles').upsert(nextProfileRow, {
      onConflict: 'user_id',
    });
  } catch {
    return nextProfileRow;
  }

  return nextProfileRow;
}

async function buildAuthPayload(supabase, requestedProfile) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authUser: null,
      profileRecord: null,
      session: null,
    };
  }

  const profileRow = await syncProfileRow(supabase, user, requestedProfile);

  return {
    authUser: {
      email: user.email,
      id: user.id,
    },
    profileRecord: buildProfilePayload(user, profileRow),
    session: buildSessionPayload(user, profileRow),
  };
}

export async function handleGetSession(request) {
  const { configured, responseHeaders, supabase } = createSupabaseServerClient(request);

  if (!configured || !supabase) {
    return errorResponse('Supabase não está configurado no servidor.', {
      code: 'CONFIG_ERROR',
      status: 500,
    });
  }

  const payload = await buildAuthPayload(supabase);
  return jsonResponse(payload, { headers: responseHeaders });
}

export async function handleLogin(request) {
  const { configured, responseHeaders, supabase } = createSupabaseServerClient(request);

  if (!configured || !supabase) {
    return errorResponse('Supabase não está configurado no servidor.', {
      code: 'CONFIG_ERROR',
      status: 500,
    });
  }

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email ?? body.username);
  const password = String(body.password ?? '');

  if (!email || !email.includes('@')) {
    return errorResponse('Use um e-mail válido para entrar.', {
      code: 'INVALID_EMAIL',
      status: 400,
    });
  }

  if (!password) {
    return errorResponse('A senha é obrigatória.', {
      code: 'INVALID_PASSWORD',
      status: 400,
    });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return errorResponse('Credenciais inválidas.', {
      code: 'INVALID_CREDENTIALS',
      status: 401,
    });
  }

  const payload = await buildAuthPayload(supabase, body.profile);

  if (body.profile && payload.session?.profile !== normalizeProfile(body.profile)) {
    await supabase.auth.signOut();
    return errorResponse('Esta conta não pertence ao perfil selecionado.', {
      code: 'PROFILE_MISMATCH',
      status: 403,
    });
  }

  return jsonResponse(payload, { headers: responseHeaders });
}

export async function handleLogout(request) {
  const { configured, responseHeaders, supabase } = createSupabaseServerClient(request);

  if (!configured || !supabase) {
    return errorResponse('Supabase não está configurado no servidor.', {
      code: 'CONFIG_ERROR',
      status: 500,
    });
  }

  await supabase.auth.signOut();

  return jsonResponse(
    { ok: true },
    { headers: responseHeaders },
  );
}

export async function handleRegister(request) {
  const { configured, responseHeaders, supabase } = createSupabaseServerClient(request);

  if (!configured || !supabase) {
    return errorResponse('Supabase não está configurado no servidor.', {
      code: 'CONFIG_ERROR',
      status: 500,
    });
  }

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  const fullName = String(body.fullName ?? '').trim();
  const profile = normalizeProfile(body.profile);
  const requestUrl = new URL(request.url);

  if (!fullName) {
    return errorResponse('O nome completo é obrigatório.', {
      code: 'INVALID_NAME',
      status: 400,
    });
  }

  if (!email || !email.includes('@')) {
    return errorResponse('Use um e-mail válido para criar a conta.', {
      code: 'INVALID_EMAIL',
      status: 400,
    });
  }

  if (password.length < 8) {
    return errorResponse('A senha precisa ter pelo menos 8 caracteres.', {
      code: 'INVALID_PASSWORD',
      status: 400,
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    options: {
      data: {
        full_name: fullName,
        role: profile,
      },
      emailRedirectTo: `${requestUrl.origin}/login`,
    },
    password,
  });

  if (error) {
    return errorResponse(error.message || 'Não foi possível criar a conta.', {
      code: 'REGISTER_ERROR',
      status: 400,
    });
  }

  if (!data.session) {
    return jsonResponse(
      {
        email,
        ok: true,
        requiresEmailConfirmation: true,
      },
      { headers: responseHeaders, status: 201 },
    );
  }

  const payload = await buildAuthPayload(supabase, profile);
  return jsonResponse(payload, { headers: responseHeaders, status: 201 });
}

export async function handleRecover(request) {
  const { configured, responseHeaders, supabase } = createSupabaseServerClient(request);

  if (!configured || !supabase) {
    return errorResponse('Supabase não está configurado no servidor.', {
      code: 'CONFIG_ERROR',
      status: 500,
    });
  }

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);

  if (!email || !email.includes('@')) {
    return errorResponse('Use um e-mail válido para recuperar a senha.', {
      code: 'INVALID_EMAIL',
      status: 400,
    });
  }

  const requestUrl = new URL(request.url);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${requestUrl.origin}/login`,
  });

  if (error) {
    return errorResponse(error.message || 'Não foi possível iniciar a recuperação.', {
      code: 'RECOVER_ERROR',
      status: 400,
    });
  }

  return jsonResponse({ ok: true }, { headers: responseHeaders });
}
