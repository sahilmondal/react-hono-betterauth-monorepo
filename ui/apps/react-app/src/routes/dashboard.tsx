import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { authClient } from '@/lib/auth-client.ts'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: '/login' })
    }
  }, [session, isPending, navigate])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base dark:bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      navigate({ to: '/login' })
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  return (
    <div className="min-h-screen bg-base dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-line">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border border-line">
            <CardHeader className="flex flex-col items-center border-b border-line pb-6">
              <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                {session.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <CardTitle className="text-lg">{session.user.name}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified:</span>
                  <span
                    className={
                      session.user.emailVerified
                        ? 'text-green-600 font-semibold'
                        : 'text-yellow-600 font-semibold'
                    }
                  >
                    {session.user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 border border-line">
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
              <CardDescription>
                Raw Better Auth session structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-60 border border-line">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
