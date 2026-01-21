'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        // In a real app, you'd want to return this error to the UI
        console.error("Email and password required")
        return
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login Error:", error.message)
        return { error: error.message }
    }

    console.log("Login Successful for:", email)

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password || !confirmPassword) {
        return { error: "Email, Password, and Confirmation are required" }
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error("Signup Error:", error.message)
        return { error: error.message }
    }

    // Force sign out to require manual login
    await supabase.auth.signOut()

    return { success: true, message: "회원가입이 완료되었습니다. 로그인해주세요." }
}
