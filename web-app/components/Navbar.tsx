import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/SearchBar" // Assuming this is client-side safe or we might need to separate it
import { redirect } from 'next/navigation'

export default async function Navbar() {
    const supabase = await createClient()
    // const { data: { user } } = await supabase.auth.getUser()
    const user = null // Mock logged out (Fix slow load)


    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <header className="w-full border-b border-border bg-card p-4 shadow-sm z-10 sticky top-0">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        US Stock Premium
                    </h1>
                    <Badge variant="outline" className="text-xs hidden md:inline-flex bg-background">Beta</Badge>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden lg:block">
                        {/* SearchBar handling needs to be client component if it uses hooks. assuming it is. */}
                        <SearchBar />
                    </div>

                    <nav className="hidden md:flex items-center gap-6 mr-6">
                        <Link href="/stock" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Stocks
                        </Link>
                        <Link href="/hedge-funds" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Hedge Funds
                        </Link>
                        <Link href="/retirement" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Retirement
                        </Link>
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden md:inline-block">
                                {user ? (user as any).email : 'Guest'}
                            </span>
                            <form action={signOut}>
                                <Button size="sm" variant="outline">Logout</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
