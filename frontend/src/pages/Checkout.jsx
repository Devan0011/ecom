import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, isLoading, fetchCart } = useCartStore()
  const { user } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'India',
    phone: user?.phone || '',
  })

  const [paymentMethod, setPaymentMethod] = useState('UPI')

  useEffect(() => {
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      fetchCart()
    }
  }, [cart, fetchCart])

  const totals = useMemo(() => {
    const subtotal = cart?.totalPrice || 0
    const tax = Math.round(subtotal * 0.18)
    const shipping = subtotal > 500 ? 0 : 50
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    }
  }, [cart?.totalPrice])

  if (isLoading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Add products before checkout.</p>
      </div>
    )
  }

  const handleAddressChange = (event) => {
    setShippingAddress((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    try {
      const response = await api.post('/orders', {
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
      })
      toast.success('Order placed successfully')
      navigate('/order-success', { state: { order: response.data.order } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-slate-100 py-6 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <article className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
              <h1 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Truck size={20} /> Delivery Address
              </h1>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="street" value={shippingAddress.street} onChange={handleAddressChange} placeholder="Street Address" className="sm:col-span-2 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
                <input name="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="City" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
                <input name="state" value={shippingAddress.state} onChange={handleAddressChange} placeholder="State" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
                <input name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} placeholder="Postal Code" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
                <input name="country" value={shippingAddress.country} onChange={handleAddressChange} placeholder="Country" className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
                <input name="phone" value={shippingAddress.phone} onChange={handleAddressChange} placeholder="Phone Number" className="sm:col-span-2 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950" required />
              </div>
            </article>

            <article className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <CreditCard size={20} /> Payment Method
              </h2>

              <div className="grid gap-2 sm:grid-cols-2">
                {['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'COD'].map((method) => (
                  <label key={method} className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    {method}
                  </label>
                ))}
              </div>

              <p className="mt-3 text-xs text-slate-500">Demo checkout: payment is simulated for testing.</p>
            </article>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isProcessing ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <div className="space-y-3 border-b border-slate-200 pb-3 dark:border-slate-700">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between gap-2 text-sm">
                <span className="line-clamp-2">{item.product?.name} x {item.quantity}</span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax (18%)</span><span>{formatCurrency(totals.tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}</span></div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 text-lg font-bold dark:border-slate-700">
            <div className="flex justify-between"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
