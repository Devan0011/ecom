import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill all fields')
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="bg-slate-100 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Access your orders, cart and wishlist</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Email</span>
            <div className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 dark:border-slate-700">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Password</span>
            <div className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 dark:border-slate-700">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          New to ElectroHub?{' '}
          <Link to="/register" className="font-semibold text-blue-700 dark:text-blue-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
