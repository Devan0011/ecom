import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import toast from 'react-hot-toast'
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders', {
        params: { status: statusFilter || undefined, limit: 100 },
      })
      setOrders(response.data.orders || [])
    } catch (error) {
      toast.error('Failed to fetch orders')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success('Order status updated')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const statusOptions = ['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <AdminShell
      title="Manage Orders"
      subtitle="Review incoming orders and update their fulfillment status."
    >
      <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((status) => (
            <button
              key={status || 'all'}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading orders...</div>
        ) : orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">Order</th>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Current Status</th>
                  <th className="px-3 py-2 text-left">Update Status</th>
                  <th className="px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-3 py-3 font-semibold">{order.orderNumber}</td>
                    <td className="px-3 py-3">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-3 py-3 font-semibold">{formatCurrency(order.total)}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] || 'bg-slate-100 text-slate-700'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="rounded border border-slate-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
                      >
                        {statusOptions.filter(Boolean).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Package size={56} className="mx-auto mb-3 opacity-40" />
            <p>No orders found for selected filter.</p>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
