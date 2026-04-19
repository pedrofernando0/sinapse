/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from '@supabase/ssr'

let browserClient = null

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    )
  }

  return browserClient
}
