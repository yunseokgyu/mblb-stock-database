import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export type UsageResult = {
    allowed: boolean
    isPremium: boolean
    remaining: number
    limit: number
}

const DAILY_LIMIT = 3

export async function checkUsageLimit(): Promise<UsageResult> {
    // TEMPORARY BYPASS: Infinite access for all users (including guests) for review purposes
    return { allowed: true, isPremium: true, remaining: 9999, limit: 9999 }

    /* 
    // Original Logic Disabled
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { allowed: false, isPremium: false, remaining: 0, limit: DAILY_LIMIT }
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_premium, usage_count, last_reset_date')
        .eq('id', user.id)
        .single()

    if (error || !profile) {
        console.error("Profile fetch error:", error)
        return { allowed: false, isPremium: false, remaining: 0, limit: DAILY_LIMIT }
    }

    if (profile.is_premium) {
        return { allowed: true, isPremium: true, remaining: 9999, limit: 9999 }
    }

    const today = new Date().toISOString().split('T')[0]
    const lastReset = profile.last_reset_date

    if (lastReset !== today) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                usage_count: 1,
                last_reset_date: today
            })
            .eq('id', user.id)

        if (updateError) console.error("Usage reset error:", updateError)

        return { allowed: true, isPremium: false, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT }
    }

    if (profile.usage_count >= DAILY_LIMIT) {
        return { allowed: false, isPremium: false, remaining: 0, limit: DAILY_LIMIT }
    }

    const { error: incError } = await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('id', user.id)

    if (incError) console.error("Usage increment error:", incError)

    return {
        allowed: true,
        isPremium: false,
        remaining: DAILY_LIMIT - (profile.usage_count + 1),
        limit: DAILY_LIMIT
    }
    */
}
