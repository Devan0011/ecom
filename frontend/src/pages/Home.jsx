import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

const fallbackCategories = ['Phones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras']
const fallbackBrands = ['ElectroMax', 'Titan', 'SoundBeat', 'AeroLite', 'SnapGrip', 'VisionCam']
const statsCardTones = [
  'from-blue-600 to-blue-700 text-blue-100',
  'from-emerald-600 to-emerald-700 text-emerald-100',
  'from-violet-600 to-violet-700 text-violet-100',
  'from-amber-500 to-orange-500 text-amber-100',
]

const defaultHomeConfig = {
  sections: {
    showStats: true,
    showBudget: true,
    showLatest: true,
    showTopRated: true,
    showBrands: true,
    showPromo: true,
  },
  headings: {
    featured: 'Top Deals For You',
    latest: 'Latest Arrivals',
    topRated: 'Top Rated Picks',
    budget: 'Shop By Budget',
    brands: 'Top Brands On ElectroHub',
  },
  statsCards: [
    { label: 'Happy Shoppers', value: '50K+' },
    { label: 'Orders Delivered', value: '120K+' },
    { label: 'Partner Brands', value: '50+' },
    { label: 'Daily Discounts', value: '200+' },
  ],
  budgetCards: [
    {
      title: 'Under Rs. 10,000',
      subtitle: 'Accessories and value picks',
      link: '/products?maxPrice=10000',
    },
    {
      title: 'Rs. 10,001 - 30,000',
      subtitle: 'Best value phones and tablets',
      link: '/products?minPrice=10001&maxPrice=30000',
    },
    {
      title: 'Premium Range',
      subtitle: 'Flagship and performance devices',
      link: '/products?minPrice=30001',
    },
  ],
  brands: {
    title: 'Top Brands On ElectroHub',
    useAutoBrands: true,
    manualBrands: [],
  },
  promo: {
    eyebrow: 'ElectroHub Plus',
    title: 'Unlock Exclusive Early Access Deals',
    description:
      'Get priority offers, flash sale alerts and limited-time coupons delivered straight to your profile.',
    primaryText: 'Join Free',
    primaryLink: '/register',
    secondaryText: 'Continue Shopping',
    secondaryLink: '/products',
  },
}

export default function Home() {
  const [banners, setBanners] = useState([])
  const [activeBanner, setActiveBanner] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [latestProducts, setLatestProducts] = useState([])
  const [topRatedProducts, setTopRatedProducts] = useState([])
  const [budgetProducts, setBudgetProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [homeConfig, setHomeConfig] = useState(defaultHomeConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHome = async () => {
      setIsLoading(true)
      try {
        const [bannerRes, featuredRes, categoryRes, latestRes, topRatedRes, budgetRes, configRes] = await Promise.all([
          api.get('/banners'),
          api.get('/products/featured'),
          api.get('/products/categories'),
          api.get('/products', { params: { limit: 8, sort: '-createdAt' } }),
          api.get('/products', { params: { limit: 4, sort: '-averageRating,-totalReviews' } }),
          api.get('/products', { params: { limit: 4, maxPrice: 20000, sort: 'price' } }),
          api.get('/home-config'),
        ])

        setBanners(bannerRes.data.banners || [])
        setFeaturedProducts(featuredRes.data.products || [])
        setCategories(categoryRes.data.categories || fallbackCategories)
        setLatestProducts(latestRes.data.products || [])
        setTopRatedProducts(topRatedRes.data.products || [])
        setBudgetProducts(budgetRes.data.products || [])
        setHomeConfig({
          ...defaultHomeConfig,
          ...(configRes.data.config || {}),
          sections: {
            ...defaultHomeConfig.sections,
            ...(configRes.data.config?.sections || {}),
          },
          headings: {
            ...defaultHomeConfig.headings,
            ...(configRes.data.config?.headings || {}),
          },
          brands: {
            ...defaultHomeConfig.brands,
            ...(configRes.data.config?.brands || {}),
          },
          promo: {
            ...defaultHomeConfig.promo,
            ...(configRes.data.config?.promo || {}),
          },
          statsCards:
            configRes.data.config?.statsCards?.length
              ? configRes.data.config.statsCards.slice(0, 4)
              : defaultHomeConfig.statsCards,
          budgetCards:
            configRes.data.config?.budgetCards?.length
              ? configRes.data.config.budgetCards.slice(0, 3)
              : defaultHomeConfig.budgetCards,
        })
      } catch (error) {
        setCategories(fallbackCategories)
        setFeaturedProducts([])
        setLatestProducts([])
        setTopRatedProducts([])
        setBudgetProducts([])
        setHomeConfig(defaultHomeConfig)
      } finally {
        setIsLoading(false)
      }
    }

    loadHome()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return undefined
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [banners.length])

  const currentBanner = banners[activeBanner]

  const categoriesWithIcons = useMemo(() => {
    const iconMap = {
      Phones: '📱',
      Laptops: '💻',
      Tablets: '📲',
      Accessories: '🎧',
      Audio: '🔊',
      Cameras: '📷',
    }

    return (categories.length ? categories : fallbackCategories).map((name) => ({
      name,
      icon: iconMap[name] || '🛍️',
    }))
  }, [categories])

  const topBrands = useMemo(() => {
    const useAutoBrands = homeConfig?.brands?.useAutoBrands !== false
    const manualBrands = (homeConfig?.brands?.manualBrands || [])
      .map((name) => String(name).trim())
      .filter(Boolean)

    if (!useAutoBrands) {
      return manualBrands.length ? manualBrands : fallbackBrands
    }

    const brands = [
      ...featuredProducts.map((item) => item.brand),
      ...latestProducts.map((item) => item.brand),
      ...topRatedProducts.map((item) => item.brand),
      ...manualBrands,
    ]
      .filter(Boolean)
      .map((name) => String(name).trim())

    const unique = [...new Set(brands)]
    return unique.length ? unique.slice(0, 10) : fallbackBrands
  }, [featuredProducts, latestProducts, topRatedProducts, homeConfig?.brands])

  const prevBanner = () => {
    if (!banners.length) return
    setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const nextBanner = () => {
    if (!banners.length) return
    setActiveBanner((prev) => (prev + 1) % banners.length)
  }

  const sections = homeConfig.sections || defaultHomeConfig.sections
  const headings = homeConfig.headings || defaultHomeConfig.headings
  const statsCards = homeConfig.statsCards?.length ? homeConfig.statsCards : defaultHomeConfig.statsCards
  const budgetCards = homeConfig.budgetCards?.length ? homeConfig.budgetCards : defaultHomeConfig.budgetCards
  const promo = homeConfig.promo || defaultHomeConfig.promo
  const brandTitle = homeConfig.brands?.title || headings.brands || defaultHomeConfig.headings.brands

  return (
    <div className="pb-10">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <section className="glass-surface mb-4 rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {categoriesWithIcons.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center rounded-md p-3 text-center transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-surface relative overflow-hidden rounded-2xl">
          {currentBanner ? (
            <>
              <div className="relative h-64 md:h-80">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/30 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-6 text-white md:p-10">
                  <p className="mb-2 text-sm font-medium text-slate-100">Mega Electronics Sale</p>
                  <h1 className="text-2xl font-bold md:text-4xl">{currentBanner.title}</h1>
                  {currentBanner.description && (
                    <p className="mt-3 text-sm text-slate-200 md:text-base">{currentBanner.description}</p>
                  )}
                  {currentBanner.discount && (
                    <div className="mt-4 inline-flex w-fit items-center rounded bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
                      {currentBanner.discount}
                    </div>
                  )}
                  <div className="mt-5">
                    <Link
                      to={currentBanner.link || '/products'}
                      className="inline-flex rounded bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                    >
                      {currentBanner.linkText || 'Shop Now'}
                    </Link>
                  </div>
                </div>
              </div>

              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevBanner}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={nextBanner}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow"
                    aria-label="Next banner"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white md:h-80">
              <div>
                <h1 className="text-3xl font-bold">India&apos;s Smartest Electronics Store</h1>
                <p className="mt-3 text-sm text-blue-100">Top brands, fast delivery, and trusted support.</p>
                <Link
                  to="/products"
                  className="mt-5 inline-flex rounded bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900"
                >
                  Browse Deals
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="glass-surface flex items-center gap-3 rounded-2xl p-4">
            <Truck className="text-blue-600" size={22} />
            <div>
              <p className="text-sm font-semibold">Fast Delivery</p>
              <p className="text-xs text-slate-500">Express delivery in major cities</p>
            </div>
          </article>
          <article className="glass-surface flex items-center gap-3 rounded-2xl p-4">
            <ShieldCheck className="text-emerald-600" size={22} />
            <div>
              <p className="text-sm font-semibold">Genuine Products</p>
              <p className="text-xs text-slate-500">All items sourced from trusted brands</p>
            </div>
          </article>
          <article className="glass-surface flex items-center gap-3 rounded-2xl p-4">
            <Wallet className="text-amber-600" size={22} />
            <div>
              <p className="text-sm font-semibold">Easy Payments</p>
              <p className="text-xs text-slate-500">UPI, cards, wallet and COD</p>
            </div>
          </article>
        </section>

        {sections.showStats && (
          <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((card, index) => {
              const toneClass = statsCardTones[index] || statsCardTones[0]
              const toneTextClass = toneClass.split(' ').pop()
              return (
                <article key={`${card.label}-${index}`} className={`rounded-lg bg-gradient-to-r p-4 text-white shadow-sm ${toneClass}`}>
                  <p className={`text-xs uppercase tracking-wide ${toneTextClass}`}>{card.label}</p>
                  <p className="mt-2 text-2xl font-bold">{card.value}</p>
                </article>
              )
            })}
          </section>
        )}

        {sections.showBudget && (
          <section className="glass-surface mt-6 rounded-2xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{headings.budget || defaultHomeConfig.headings.budget}</h2>
              <Link to="/products" className="text-sm font-semibold text-blue-700 dark:text-blue-400">View all</Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {budgetCards.map((card, index) => {
                const BudgetIcon = [BadgePercent, Sparkles, ShieldCheck][index] || BadgePercent
                const iconClass = ['text-blue-600', 'text-violet-600', 'text-emerald-600'][index] || 'text-blue-600'
                return (
                  <Link
                    key={`${card.title}-${index}`}
                    to={card.link || '/products'}
                    className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
                  >
                    <BudgetIcon size={18} className={iconClass} />
                    <p className="mt-3 font-semibold">{card.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className="glass-surface mt-6 rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{headings.featured || defaultHomeConfig.headings.featured}</h2>
            <Link to="/products" className="text-sm font-semibold text-blue-700 dark:text-blue-400">View all</Link>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-500">Loading featured products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
              No featured products available yet. Add products from admin panel.
            </div>
          )}
        </section>

        {sections.showLatest && (
          <section className="glass-surface mt-6 rounded-2xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{headings.latest || defaultHomeConfig.headings.latest}</h2>
              <Link to="/products?sort=-createdAt" className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Explore newest
              </Link>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-sm text-slate-500">Loading latest products...</div>
            ) : latestProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {latestProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                Latest products will appear here once inventory is added.
              </div>
            )}
          </section>
        )}

        {sections.showTopRated && (
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <article className="glass-surface rounded-2xl p-4 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{headings.topRated || defaultHomeConfig.headings.topRated}</h2>
                <Link to="/products?sort=-averageRating" className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  View top rated
                </Link>
              </div>
              {isLoading ? (
                <div className="py-16 text-center text-sm text-slate-500">Loading top rated products...</div>
              ) : topRatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {topRatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                  Ratings will appear as customers review products.
                </div>
              )}
            </article>

            <article className="glass-surface rounded-2xl p-4">
              <h2 className="text-xl font-bold">Budget Picks Under Rs. 20,000</h2>
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <p className="text-sm text-slate-500">Loading budget picks...</p>
                ) : budgetProducts.length > 0 ? (
                  budgetProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/72x72?text=Item'}
                        alt={product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                        <p className="mt-1 text-sm font-bold text-blue-700 dark:text-blue-400">
                          Rs. {Number(product.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No budget products available right now.</p>
                )}
              </div>
            </article>
          </section>
        )}

        {sections.showBrands && (
          <section className="glass-surface mt-6 rounded-2xl p-4">
            <h2 className="text-xl font-bold">{brandTitle}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {topBrands.map((brand) => (
                <Link
                  key={brand}
                  to={`/products?brand=${encodeURIComponent(brand)}`}
                  className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-blue-400"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </section>
        )}

        {sections.showPromo && (
          <section className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-wide text-blue-200">{promo.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold">{promo.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">{promo.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to={promo.primaryLink || '/register'} className="rounded bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
                {promo.primaryText || 'Join Free'}
              </Link>
              <Link to={promo.secondaryLink || '/products'} className="rounded border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
                {promo.secondaryText || 'Continue Shopping'}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
