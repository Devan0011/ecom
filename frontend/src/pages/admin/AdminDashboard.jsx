import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Boxes, Receipt, TrendingUp, Users } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import api from '../../services/api'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

const statusStyles = {
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/admin/stats')
        const nextStats = response.data.stats || {}
        setStats(nextStats)
        setRecentOrders(nextStats.recentOrders || [])
      } catch (error) {
        setStats({})
        setRecentOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const totalOrders = stats.totalOrders || 0
  const totalUsers = stats.totalUsers || 0
  const totalProducts = stats.totalProducts || 0
  const totalRevenue = stats.totalRevenue || 0

  const statusData = useMemo(() => {
    const items = stats.ordersByStatus || []
    const base = Math.max(totalOrders, 1)
    return items.map((item) => ({
      ...item,
      progress: Math.round((item.count / base) * 100),
    }))
  }, [stats.ordersByStatus, totalOrders])

  const quickActions = [
    { title: 'Manage Products', path: '/admin/products', description: 'Add, edit and maintain your catalog.' },
    { title: 'Manage Orders', path: '/admin/orders', description: 'Track all order status updates.' },
    { title: 'Manage Users', path: '/admin/users', description: 'View customer registrations and role info.' },
    { title: 'Manage Banners', path: '/admin/banners', description: 'Control home page campaigns and sliders.' },
  ]

  const statCards = [
    { title: 'Total Orders', value: totalOrders, icon: Receipt, tone: 'from-blue-500 to-blue-600' },
    { title: 'Total Users', value: totalUsers, icon: Users, tone: 'from-emerald-500 to-emerald-600' },
    { title: 'Total Products', value: totalProducts, icon: Boxes, tone: 'from-violet-500 to-violet-600' },
    { title: 'Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, tone: 'from-amber-500 to-orange-500' },
  ]

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Track store performance, order flow and key marketplace metrics in one place."
    >
      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
          Loading dashboard data...
        </div>
      ) : (
        <>
          <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon
              return (
                <article key={card.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className={`h-1 bg-gradient-to-r ${card.tone}`} />
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                    </div>
                    <div className={`rounded-full bg-gradient-to-r p-3 text-white ${card.tone}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="mb-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold">Order Status Breakdown</h2>
              {statusData.length ? (
                <div className="space-y-3">
                  {statusData.map((item) => (
                    <div key={item._id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{item._id}</span>
                        <span className="text-slate-500">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No status data available yet.</p>
              )}
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path} className="block rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                  </Link>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Order</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-3 py-3 font-semibold">{order.orderNumber}</td>
                      <td className="px-3 py-3">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="px-3 py-3 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] || 'bg-slate-100 text-slate-700'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                  {!recentOrders.length && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-slate-500">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </AdminShell>
  )
}
