import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/app/actions/auth'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Bienvenido{session.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-sm text-zinc-500">{session.user?.email}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
