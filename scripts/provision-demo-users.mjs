import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'vzgammlsunjmuwnhsezm'
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || `https://${PROJECT_REF}.supabase.co`

const DEMO_USERS = [
  {
    email: process.env.VITE_DEMO_STUDENT_EMAIL || 'demo.aluno.pedro@sinapse.app',
    fullName: 'Pedro Demo',
    password: 'pedro',
    role: 'aluno',
    usernameAlias: 'pedro',
  },
  {
    email: process.env.VITE_DEMO_TEACHER_EMAIL || 'demo.professor.pedro@sinapse.app',
    fullName: 'Pedro Demo',
    password: 'pedro',
    role: 'professor',
    usernameAlias: 'pedro',
  },
]

const getServiceRoleKey = () => {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  const rawOutput = execFileSync(
    'npx',
    ['-y', 'supabase@latest', 'projects', 'api-keys', '--project-ref', PROJECT_REF, '--output', 'json'],
    { encoding: 'utf8' }
  )

  const keys = JSON.parse(rawOutput)
  const serviceRoleKey = keys.find((key) => key.id === 'service_role' || key.name === 'service_role')?.api_key

  if (!serviceRoleKey) {
    throw new Error('Nao foi possivel obter a service_role key do projeto.')
  }

  return serviceRoleKey
}

const adminClient = createClient(SUPABASE_URL, getServiceRoleKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const listExistingUsers = async () => {
  const { data, error } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (error) {
    throw error
  }

  return data.users
}

const syncProfile = async ({ id, email, fullName, role }) => {
  const { error } = await adminClient
    .from('profiles')
    .upsert(
      {
        user_id: id,
        email,
        full_name: fullName,
        role,
        hidden_student_views: [],
      },
      {
        onConflict: 'user_id',
      }
    )

  if (error) {
    throw error
  }
}

const ensureDemoUser = async (account) => {
  const existingUsers = await listExistingUsers()
  const existingUser = existingUsers.find(
    (user) => user.email?.toLowerCase() === account.email.toLowerCase()
  )

  if (existingUser) {
    const { error } = await adminClient.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      password: account.password,
      user_metadata: {
        full_name: account.fullName,
        role: account.role,
        username_alias: account.usernameAlias,
      },
    })

    if (error) {
      throw error
    }

    await syncProfile({
      id: existingUser.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
    })

    return {
      action: 'updated',
      email: account.email,
      id: existingUser.id,
      role: account.role,
    }
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: account.email,
    email_confirm: true,
    password: account.password,
    user_metadata: {
      full_name: account.fullName,
      role: account.role,
      username_alias: account.usernameAlias,
    },
  })

  if (error) {
    throw error
  }

  await syncProfile({
    id: data.user.id,
    email: account.email,
    fullName: account.fullName,
    role: account.role,
  })

  return {
    action: 'created',
    email: account.email,
    id: data.user.id,
    role: account.role,
  }
}

const results = []

for (const account of DEMO_USERS) {
  results.push(await ensureDemoUser(account))
}

process.stdout.write(`${JSON.stringify(results, null, 2)}\n`)
