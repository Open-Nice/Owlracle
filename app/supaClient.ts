import { createClient } from "@supabase/supabase-js";

export const runtime = 'edge'

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
if (!supabaseServiceKey) throw new Error(`Expected env var SUPABASE_SERVICE_KEY`)

export const supabaseClient = createClient(
    supabaseUrl!, 
    supabaseServiceKey!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })