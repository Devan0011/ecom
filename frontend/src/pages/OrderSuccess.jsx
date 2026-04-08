import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Home, Package, Truck } from 'lucide-react'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function OrderSuccess() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg">Order information not available.</p>
        <Link to="/" className="mt-4 inline-block text-blue-700">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4">
        <section className="rounded-lg bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <CheckCircle size={72} className="mx-auto text-emerald-500" />
          <h1 className="mt-4 text-3xl font-bold">Order placed successfully</h1>
          <p className="mt-2 text-sm text-slate-500">Order #{order.orderNumber}</p>
          <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </section>

        <section className="mt-4 grid gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle size={24} /></div>
            <p className="mt-2 text-sm font-semibold">Order Confirmed</p>
          </div>
          <div className="text-center opacity-70">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800"><Package size={24} /></div>
            <p className="mt-2 text-sm font-semibold">Packed & Ready</p>
          </div>
          <div className="text-center opacity-70">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800"><Truck size={24} /></div>
            <p className="mt-2 text-sm font-semibold">Out for Delivery</p>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
            <h2 className="mb-2 font-semibold">Shipping Address</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </article>

          <article className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
            <h2 className="mb-2 font-semibold">Payment Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
              <div className="mt-2 border-t border-slate-200 pt-2 text-base font-bold dark:border-slate-700">
                <div className="flex justify-between"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-4 rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-3 font-semibold">Items in this order</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.product}-${index}`} className="flex items-center justify-between rounded border border-slate-200 p-3 text-sm dark:border-slate-700">
                <p>{item.productName} x {item.quantity}</p>
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link to="/orders" className="flex-1 rounded bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
            Track Order
          </Link>
          <Link to="/products" className="flex-1 rounded bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-amber-400">
            Continue Shopping
          </Link>
          <Link to="/" className="flex items-center justify-center rounded border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">
            <Home size={16} className="mr-2" /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
