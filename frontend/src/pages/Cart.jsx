import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function Cart() {
  const navigate = useNavigate()
  const { cart, isLoading, fetchCart, removeFromCart, updateCartItem, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  const handleRemove = async (productId) => {
    await removeFromCart(productId)
  }

  const handleClear = async () => {
    const success = await clearCart()
    if (success) toast.success('Cart cleared')
  }

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
        <p className="text-6xl">🛒</p>
        <h2 className="mt-4 text-3xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Add products and come back here to checkout.</p>
        <Link to="/products" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Shop now
        </Link>
      </div>
    )
  }

  const subtotal = cart.totalPrice || 0
  const tax = Math.round(subtotal * 0.18)
  const shipping = subtotal > 500 ? 0 : 50
  const grandTotal = subtotal + tax + shipping

  return (
    <div className="bg-slate-100 py-6 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
              <h1 className="text-2xl font-bold">My Cart ({cart.totalItems || cart.items.length})</h1>
              <button type="button" onClick={handleClear} className="text-sm font-semibold text-rose-600">Clear cart</button>
            </div>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <article key={item._id} className="grid gap-3 rounded border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-[110px,1fr,140px]">
                  <Link to={`/product/${item.product?._id}`} className="block overflow-hidden rounded border border-slate-200 dark:border-slate-700">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=ElectroHub'}
                      alt={item.product?.name}
                      className="h-24 w-full object-cover"
                    />
                  </Link>

                  <div>
                    <Link to={`/product/${item.product?._id}`} className="font-semibold hover:text-blue-700 dark:hover:text-blue-400">
                      {item.product?.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{item.product?.brand} | {item.product?.category}</p>
                    <p className="mt-2 text-lg font-bold">{formatCurrency(item.price)}</p>

                    <div className="mt-3 inline-flex items-center rounded border border-slate-300 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                        className="px-2 py-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between sm:flex-col sm:items-end">
                    <p className="text-lg font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product._id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold dark:border-slate-700">Price Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax (18%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-3 text-lg font-bold dark:border-slate-700">
            <div className="flex justify-between"><span>Total</span><span>{formatCurrency(grandTotal)}</span></div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full rounded bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-400"
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="mt-3 block text-center text-sm font-semibold text-blue-700 dark:text-blue-400">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
