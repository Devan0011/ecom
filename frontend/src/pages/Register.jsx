import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [formData, setFormData] = useState(initialForm)

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { firstName, lastName, email, phone, password, confirmPassword } = formData

    if (!firstName || !lastName || !email || !phone || !password) {
      toast.error('Please fill all required fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const success = await register({ firstName, lastName, email, phone, password })
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="bg-slate-100 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mt-1 text-sm text-slate-500">Sign up to shop, track orders and save wishlist</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
          </div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full rounded bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-700 dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
