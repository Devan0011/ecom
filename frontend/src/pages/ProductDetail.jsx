import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, isLoading, fetchProductDetails } = useProductStore()
  const { addToCart } = useCartStore()
  const { isInWishlist, toggleWishlist } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()

  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reviews, setReviews] = useState([])
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })

  useEffect(() => {
    fetchProductDetails(id)
  }, [id, fetchProductDetails])

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.get(`/products/${id}/reviews`)
        setReviews(response.data.reviews || [])
      } catch (error) {
        setReviews([])
      }
    }

    loadReviews()
  }, [id])

  useEffect(() => {
    setCurrentImageIndex(0)
    setQuantity(1)
  }, [id])

  const images = useMemo(() => {
    if (!product?.images?.length) {
      return [{ url: 'https://via.placeholder.com/700x700?text=ElectroHub', alt: product?.name || 'Product' }]
    }
    return product.images
  }, [product])

  const increaseQty = () => {
    setQuantity((prev) => Math.min(prev + 1, Math.max(product?.stock || 1, 1)))
  }

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast('Please login to add to cart')
      navigate('/login')
      return
    }

    const success = await addToCart(id, quantity)
    if (success) {
      toast.success('Product added to cart')
    }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast('Please login to manage wishlist')
      navigate('/login')
      return
    }

    await toggleWishlist(id)
  }

  const handleShare = async () => {
    const link = window.location.href
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Product link copied')
    } catch (error) {
      toast.error('Unable to copy link')
    }
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      toast('Please login to submit review')
      navigate('/login')
      return
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill title and comment')
      return
    }

    try {
      setSubmittingReview(true)
      await api.post(`/products/${id}/reviews`, {
        productId: id,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        comment: reviewForm.comment,
      })

      const response = await api.get(`/products/${id}/reviews`)
      setReviews(response.data.reviews || [])
      setReviewForm({ rating: 5, title: '', comment: '' })
      fetchProductDetails(id)
      toast.success('Review submitted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-lg text-slate-500">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 py-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-blue-700 dark:text-blue-400">
          ← Back to Products
        </button>

        <div className="grid gap-5 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900 lg:grid-cols-2">
          <section>
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700">
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt || product.name}
                className="h-[420px] w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-auto">
                {images.map((image, index) => (
                  <button
                    key={image.url || index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded border ${
                      index === currentImageIndex ? 'border-blue-600' : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <img src={image.url} alt={image.alt || product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <p className="text-xs text-slate-500">{product.category} | {product.brand}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                {Number(product.averageRating || 0).toFixed(1)} <Star size={12} className="fill-white text-white" />
              </span>
              <span className="text-sm text-slate-500">{product.totalReviews || 0} ratings</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-500 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
              {product.discount > 0 && (
                <span className="text-sm font-semibold text-emerald-600">{product.discount}% off</span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium">
              {product.stock > 0 ? (
                <span className="text-emerald-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-rose-600">Out of Stock</span>
              )}
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{product.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded border border-slate-300 dark:border-slate-700">
                <button type="button" onClick={decreaseQty} className="px-3 py-2 text-sm">-</button>
                <input
                  type="number"
                  min="1"
                  max={Math.max(product.stock, 1)}
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value || 1)
                    setQuantity(Math.min(Math.max(1, value), Math.max(product.stock, 1)))
                  }}
                  className="w-14 border-x border-slate-300 bg-transparent px-1 py-2 text-center text-sm outline-none dark:border-slate-700"
                />
                <button type="button" onClick={increaseQty} className="px-3 py-2 text-sm">+</button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="inline-flex items-center gap-2 rounded bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`rounded border px-4 py-3 text-sm font-medium ${
                  isInWishlist(id)
                    ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-slate-800'
                    : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <Heart size={16} className={isInWishlist(id) ? 'fill-rose-500 inline' : 'inline'} /> Wishlist
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="rounded border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                <Share2 size={16} className="inline" /> Share
              </button>
            </div>

            {product.specification && Object.keys(product.specification).length > 0 && (
              <div className="mt-6 rounded border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-3 text-sm font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(product.specification)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div key={key} className="rounded bg-slate-50 p-2 text-xs dark:bg-slate-800">
                        <p className="text-slate-500">{key}</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">Ratings & Reviews</h2>

          <form onSubmit={handleSubmitReview} className="mt-4 grid gap-3 rounded border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm font-semibold">Write a review</p>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} Star</option>
              ))}
            </select>
            <input
              type="text"
              value={reviewForm.title}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Review title"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              rows={3}
              placeholder="Share your experience"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="w-fit rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article key={review._id} className="rounded border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{review.user?.firstName} {review.user?.lastName}</p>
                    <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {review.rating} <Star size={11} className="fill-white text-white" />
                    </span>
                    <p className="text-sm font-semibold">{review.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="rounded border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                No reviews yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
