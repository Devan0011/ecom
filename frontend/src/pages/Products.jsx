import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/ProductCard'

const defaultFilters = {
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  search: '',
  sort: 'latest',
  page: 1,
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [availableFilters, setAvailableFilters] = useState({ brands: [], categories: [], priceRange: { min: 0, max: 0 } })
  const [filters, setFilters] = useState(defaultFilters)

  const { products, isLoading, pagination, fetchProducts, fetchFilters } = useProductStore()

  useEffect(() => {
    const nextFilters = {
      ...defaultFilters,
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'latest',
      page: Number(searchParams.get('page') || 1),
    }

    setFilters(nextFilters)
  }, [searchParams])

  useEffect(() => {
    const loadFilters = async () => {
      const filterData = await fetchFilters()
      setAvailableFilters(filterData || { brands: [], categories: [], priceRange: { min: 0, max: 0 } })
    }

    loadFilters()
  }, [fetchFilters])

  useEffect(() => {
    fetchProducts({
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      search: filters.search || undefined,
      sort: filters.sort || undefined,
      page: filters.page || 1,
      limit: 12,
    })
  }, [filters, fetchProducts])

  const updateFilter = (key, value) => {
    const next = {
      ...filters,
      [key]: value,
      page: key === 'page' ? value : 1,
    }

    const nextParams = new URLSearchParams()
    Object.entries(next).forEach(([filterKey, filterValue]) => {
      if (filterValue !== '' && filterValue !== null && filterValue !== undefined && Number.isNaN(filterValue) === false) {
        if (filterKey === 'page' && Number(filterValue) <= 1) return
        nextParams.set(filterKey, String(filterValue))
      }
    })

    setSearchParams(nextParams)
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
    setShowFilters(false)
  }

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.pages || 1
    const current = pagination.page || filters.page || 1
    const start = Math.max(1, current - 2)
    const end = Math.min(totalPages, start + 4)
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, idx) => start + idx)
  }, [pagination.page, pagination.pages, filters.page])

  return (
    <div className="bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-5">
        <aside className="hidden w-72 shrink-0 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900 lg:block">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
            <h2 className="font-semibold">Filters</h2>
            <button type="button" onClick={clearAllFilters} className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Clear All
            </button>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <p className="mb-2 font-semibold">Search</p>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search products"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <p className="mb-2 font-semibold">Category</p>
              <div className="space-y-2">
                {availableFilters.categories?.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category}
                      onChange={() => updateFilter('category', category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
                {filters.category && (
                  <button type="button" onClick={() => updateFilter('category', '')} className="text-xs text-blue-700 dark:text-blue-400">
                    Reset category
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Brand</p>
              <div className="max-h-44 space-y-2 overflow-auto pr-1">
                {availableFilters.brands?.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand === brand}
                      onChange={() => updateFilter('brand', brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
              {filters.brand && (
                <button type="button" onClick={() => updateFilter('brand', '')} className="mt-2 text-xs text-blue-700 dark:text-blue-400">
                  Reset brand
                </button>
              )}
            </div>

            <div>
              <p className="mb-2 font-semibold">Price Range</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  placeholder={`Min ${availableFilters.priceRange?.min || 0}`}
                  className="rounded border border-slate-300 px-2 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  placeholder={`Max ${availableFilters.priceRange?.max || 0}`}
                  className="rounded border border-slate-300 px-2 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-500">Home / Products</p>
              <h1 className="text-xl font-bold">All Electronics</h1>
              <p className="text-xs text-slate-500">{pagination.total || products.length} products found</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded border border-slate-300 px-3 py-2 text-sm lg:hidden dark:border-slate-700"
              >
                <Filter size={16} /> Filters
              </button>

              <div className="inline-flex items-center gap-2 rounded border border-slate-300 px-2 py-2 text-sm dark:border-slate-700">
                <SlidersHorizontal size={14} />
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="latest">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-averageRating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 lg:hidden dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Quick Filters</p>
                <button type="button" onClick={() => setShowFilters(false)}><X size={16} /></button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">All categories</option>
                  {availableFilters.categories?.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={filters.brand}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">All brands</option>
                  {availableFilters.brands?.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={clearAllFilters} className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-400">Clear all filters</button>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {(pagination.pages || 1) > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={(pagination.page || filters.page) <= 1}
                    onClick={() => updateFilter('page', (pagination.page || filters.page) - 1)}
                    className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-slate-700"
                  >
                    Prev
                  </button>
                  {pageNumbers.map((page) => (
                    <button
                      type="button"
                      key={page}
                      onClick={() => updateFilter('page', page)}
                      className={`rounded px-3 py-1 text-sm ${
                        (pagination.page || filters.page) === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={(pagination.page || filters.page) >= (pagination.pages || 1)}
                    onClick={() => updateFilter('page', (pagination.page || filters.page) + 1)}
                    className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-slate-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700">
              No products found for selected filters.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
