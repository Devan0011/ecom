import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

const categories = ['Phones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras']

export default function Header({ isDark, setIsDark }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getCartItemCount, fetchCart } = useCartStore()
  const { wishlist, fetchWishlist } = useWishlistStore()

  const cartCount = getCartItemCount()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
      fetchWishlist()
    }
  }, [isAuthenticated, fetchCart, fetchWishlist])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    navigate(`/products?search=${encodeURIComponent(query)}`)
    setSearchQuery('')
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleAuthRoute = (path) => {
    if (!isAuthenticated) {
      toast('Please login first')
      navigate('/login')
      return
    }
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/70">
      <div className="brand-gradient text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] font-semibold tracking-wide">
          <span>Trusted Electronics Marketplace</span>
          <span>Free shipping above Rs. 500</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-fit items-center gap-2">
          <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-white shadow-md">E</div>
          <div className="hidden sm:block leading-tight">
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">ElectroHub</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Modern electronics destination</p>
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className="glass-surface hidden flex-1 items-center gap-2 rounded-xl px-3 py-2 md:flex"
        >
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-slate-100"
          />
        </form>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="outline-button rounded-xl p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => handleAuthRoute('/wishlist')}
            className="outline-button relative rounded-xl p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {isAuthenticated && wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleAuthRoute('/cart')}
            className="outline-button relative rounded-xl p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {isAuthenticated && cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="group relative">
              <button className="outline-button flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <User size={16} />
                <span>{user?.firstName || 'Account'}</span>
                <ChevronDown size={14} />
              </button>

              <div className="invisible absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                  My Profile
                </Link>
                <Link to="/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="outline-button rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Login
              </Link>
              <Link to="/register" className="brand-button rounded-xl px-4 py-2 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="outline-button ml-auto rounded-xl p-2.5 text-slate-700 md:hidden dark:bg-slate-800 dark:text-slate-100"
          aria-label="Open mobile menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="hidden border-t border-slate-200/80 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/60 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2.5">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-teal-300"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div className="glass-surface border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-700">
          <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search size={16} className="text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleAuthRoute('/wishlist')} className="outline-button px-3 py-2 text-sm dark:bg-slate-800">
              Wishlist
            </button>
            <button type="button" onClick={() => handleAuthRoute('/cart')} className="outline-button px-3 py-2 text-sm dark:bg-slate-800">
              Cart
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800"
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="outline-button px-3 py-2 text-sm dark:bg-slate-800"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm text-rose-600">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="outline-button px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="brand-button px-3 py-2 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
