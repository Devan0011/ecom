import { useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../../components/admin/AdminShell'
import api from '../../services/api'

const roleStyles = {
  admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users', { params: { limit: 100 } })
      setUsers(response.data.users || [])
    } catch (error) {
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const metrics = useMemo(() => {
    const total = users.length
    const admins = users.filter((user) => user.role === 'admin').length
    const active = users.filter((user) => user.isActive).length
    return { total, admins, active }
  }, [users])

  return (
    <AdminShell
      title="Manage Users"
      subtitle="Monitor registered users, account activity and admin assignments."
    >
      <section className="mb-4 grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-2xl font-bold">{metrics.total}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admins</p>
          <p className="mt-2 text-2xl font-bold">{metrics.admins}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Users</p>
          <p className="mt-2 text-2xl font-bold">{metrics.active}</p>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading users...</div>
        ) : users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Joined</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-3 py-3 font-semibold">{user.firstName} {user.lastName}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.phone || '-'}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${roleStyles[user.role] || 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Users size={56} className="mx-auto mb-3 opacity-40" />
            <p>No users found.</p>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
