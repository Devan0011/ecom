import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '../store/wishlistStore'
import ProductCard from '../components/ProductCard'

export default function WishList() {
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!wishlist.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <Heart size={56} className="mx-auto text-slate-300" />
        <h2 className="mt-4 text-3xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Save products for later and compare before checkout.</p>
        <Link to="/products" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Explore products
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 py-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-4 text-2xl font-bold">My Wishlist ({wishlist.length})</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
