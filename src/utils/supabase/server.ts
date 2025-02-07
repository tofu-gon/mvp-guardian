import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

let supabase: ReturnType<typeof createServerClient> | null = null

export async function createClient() {
  if(supabase) return supabase


  const cookieStore = await cookies()

  supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            console.error('error occurred!!!!!!!!!!!!!')
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  return supabase
}