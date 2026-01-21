import AuthForm from './auth-form'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const { message, error } = await searchParams
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
            <AuthForm message={message} error={error} />
        </div>
    )
}
