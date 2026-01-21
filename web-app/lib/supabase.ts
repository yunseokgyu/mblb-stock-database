import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gnmgdgrmczckeurncses.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdubWdkZ3JtY3pja2V1cm5jc2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDUyMDgsImV4cCI6MjA4MzA4MTIwOH0.YhR4XiFTV3QAQD6yQ6LWyg6OhIfutn91r3X-ADK6c8Y'

// export const supabase = createClient(supabaseUrl, supabaseKey)

// MOCK CLIENT FOR DB OUTAGE
// This prevents the browser from trying to connect to a dead DB and hanging.
export const supabase = {
    from: (table: string) => ({
        select: (cols: string) => ({
            or: (filter: string) => ({
                limit: (n: number) => Promise.resolve({ data: [], error: null })
            })
        })
    }),
    auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve()
    }
} as any
