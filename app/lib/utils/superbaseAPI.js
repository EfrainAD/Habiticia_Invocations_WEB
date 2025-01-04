'user server'

import { createClient } from '@supabase/supabase-js'

// Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchHabiticaAuth(user) {
   const email = user.email

   const { data, error } = await supabase
      .from('habitica_auth')
      .select()
      .eq('email', email)

   if (error) {
      console.error('Error fetching Habitica Auth:', error)
   } else {
      const { userId, apiKey } = data[0]
      return { userId, apiKey }
   }
}
