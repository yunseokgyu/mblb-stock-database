import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Force sign out to ensure manual login flow
            await supabase.auth.signOut()
            return NextResponse.redirect(`${origin}/login?message=이메일 인증이 완료되었습니다. 로그인해주세요.`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not verify email code`)
}
