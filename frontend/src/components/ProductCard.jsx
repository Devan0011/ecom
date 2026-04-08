import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useWishlistStore } from '../store/wishlistStore'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToCart } = useCartStore()
  const { isInWishlist, toggleWishlist } = useWishlistStore()

  const discountPercent = product.discount || 0
  const listedPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast('Please login to add items to cart')
      navigate('/login')
      return
    }

    const success = await addToCart(product._id, 1)
    if (!success && product.stock <= 0) {
      toast.error('Product is out of stock')
    }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast('Please login to use wishlist')
      navigate('/login')
      return
    }

    await toggleWishlist(product._id)
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/80">
      <div className="relative overflow-hidden bg-slate-100">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/500x500?text=ElectroHub'}
            alt={product.images?.[0]?.alt || product.name}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
            {discountPercent}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-slate-600 shadow transition hover:scale-105 hover:text-rose-600"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            className={isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
          {product.category} | {product.brand}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold text-slate-900 transition group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
            <span>{Number(product.averageRating || 0).toFixed(1)}</span>
            <Star size={12} className="fill-white text-white" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({product.totalReviews || 0})
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(product.price)}</span>
          {listedPrice && (
            <span className="text-sm text-slate-500 line-through">{formatCurrency(listedPrice)}</span>
          )}
        </div>

        <p className="mt-1 text-xs font-medium">
          {product.stock > 0 ? (
            <span className="text-emerald-600">In stock</span>
          ) : (
            <span className="text-rose-600">Out of stock</span>
          )}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="brand-button mt-3 flex w-full items-center justify-center gap-2 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </article>
  )
}
