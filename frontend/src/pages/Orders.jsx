import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Package } from 'lucide-react'
import api from '../services/api'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders')
        setOrders(response.data.orders || [])
      } catch (error) {
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-slate-300" />
        <h2 className="mt-4 text-3xl font-bold">No orders yet</h2>
        <p className="mt-2 text-sm text-slate-500">Place your first order to start tracking it here.</p>
        <Link to="/products" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 py-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-4 text-2xl font-bold">My Orders</h1>

        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id
            return (
              <article key={order._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-blue-700 dark:text-blue-400">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-slate-500">{order.orderStatus}</p>
                    </div>
                    <ChevronDown size={18} className={`transition ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-950">
                    <div>
                      <p className="mb-2 font-semibold">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex justify-between">
                            <span>{item.productName} x{item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="font-semibold">Shipping Address</p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {order.shippingAddress?.street}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Timeline</p>
                        <div className="space-y-1">
                          {order.timeline?.map((entry, index) => (
                            <p key={`${order._id}-timeline-${index}`} className="text-slate-600 dark:text-slate-300">
                              {new Date(entry.timestamp).toLocaleDateString('en-IN')} - {entry.status}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
