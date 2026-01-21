'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { login, signup } from './actions'

interface AuthFormProps {
    message?: string
    error?: string
}

export default function AuthForm({ message: initialMessage, error: initialError }: AuthFormProps) {
    const router = useRouter()
    const [message, setMessage] = useState(initialMessage)
    const [error, setError] = useState(initialError)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (formData: FormData) => {
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                router.push('/')
                router.refresh()
            }
        } catch (e) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (formData: FormData) => {
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const result = await signup(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setMessage(result.message)
                // Switch to login tab implicitly or just show message
                // Optional: router.push('/login?message=...') to reset state cleanly
            }
        } catch (e) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-slate-950 p-8 rounded-xl border border-slate-800 shadow-2xl">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">환영합니다</h1>
                <p className="text-slate-400">데이터 기반 미국 주식 투자, 지금 시작하세요.</p>
            </div>

            {message && (
                <div className="p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm font-medium text-center">
                    {message}
                </div>
            )}

            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">로그인</TabsTrigger>
                    <TabsTrigger value="register">회원가입</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <form action={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input id="email" name="email" type="email" placeholder="example@email.com" required className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input id="password" name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white mt-4">
                            {loading ? '처리 중...' : '로그인'}
                        </Button>
                    </form>
                </TabsContent>

                <TabsContent value="register">
                    <form action={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="r-email">이메일</Label>
                            <Input id="r-email" name="email" type="email" placeholder="example@email.com" required className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="r-password">비밀번호</Label>
                            <Input id="r-password" name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="r-password-confirm">비밀번호 확인</Label>
                            <Input id="r-password-confirm" name="confirmPassword" type="password" required className="bg-slate-900 border-slate-700 text-white" />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-slate-800 text-white border border-slate-600 hover:bg-slate-700 mt-4">
                            {loading ? '처리 중...' : '회원가입하기'}
                        </Button>
                        <p className="text-xs text-center text-slate-500 mt-2">
                            가입 시 이용약관에 동의하게 됩니다.
                        </p>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="flex items-center gap-4 py-4">
                <Separator className="flex-1 bg-slate-800" />
                <span className="text-xs text-muted-foreground">간편 로그인 (준비중)</span>
                <Separator className="flex-1 bg-slate-800" />
            </div>
        </div>
    )
}
