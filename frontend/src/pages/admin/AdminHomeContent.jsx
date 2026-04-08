import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../../components/admin/AdminShell'
import api from '../../services/api'

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

const normalizeConfig = (config = {}) => ({
  ...defaultHomeConfig,
  ...config,
  sections: { ...defaultHomeConfig.sections, ...(config.sections || {}) },
  headings: { ...defaultHomeConfig.headings, ...(config.headings || {}) },
  brands: { ...defaultHomeConfig.brands, ...(config.brands || {}) },
  promo: { ...defaultHomeConfig.promo, ...(config.promo || {}) },
  statsCards:
    Array.isArray(config.statsCards) && config.statsCards.length
      ? config.statsCards.slice(0, 4)
      : defaultHomeConfig.statsCards,
  budgetCards:
    Array.isArray(config.budgetCards) && config.budgetCards.length
      ? config.budgetCards.slice(0, 3)
      : defaultHomeConfig.budgetCards,
})

export default function AdminHomeContent() {
  const [formData, setFormData] = useState(defaultHomeConfig)
  const [manualBrandsInput, setManualBrandsInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchHomeConfig()
  }, [])

  const fetchHomeConfig = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/home-config/admin')
      const normalized = normalizeConfig(response.data.config || {})
      setFormData(normalized)
      setManualBrandsInput((normalized.brands.manualBrands || []).join(', '))
    } catch (error) {
      toast.error('Failed to load home page settings')
      setFormData(defaultHomeConfig)
      setManualBrandsInput((defaultHomeConfig.brands.manualBrands || []).join(', '))
    } finally {
      setIsLoading(false)
    }
  }

  const updateSection = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }))
  }

  const updateHeading = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      headings: { ...prev.headings, [key]: value },
    }))
  }

  const updateStatsCard = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      statsCards: prev.statsCards.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    }))
  }

  const updateBudgetCard = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      budgetCards: prev.budgetCards.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    }))
  }

  const updatePromo = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      promo: { ...prev.promo, [key]: value },
    }))
  }

  const updateBrands = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      brands: { ...prev.brands, [key]: value },
    }))
  }

  const handleSubmit = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    const manualBrands = manualBrandsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const payload = {
      ...formData,
      brands: {
        ...formData.brands,
        manualBrands,
      },
    }

    try {
      setIsSaving(true)
      const response = await api.put('/home-config/admin', payload)
      const normalized = normalizeConfig(response.data.config || payload)
      setFormData(normalized)
      setManualBrandsInput((normalized.brands.manualBrands || []).join(', '))
      toast.success('Home page settings saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save home page settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminShell
      title="Home Content Control"
      subtitle="Control homepage section visibility, headings, cards, brands and promotional CTA."
      action={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      }
    >
      {isLoading ? (
        <section className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          Loading home content settings...
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Section Visibility</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'showStats', label: 'Stats Strip' },
                { key: 'showBudget', label: 'Shop By Budget' },
                { key: 'showLatest', label: 'Latest Arrivals' },
                { key: 'showTopRated', label: 'Top Rated + Budget Picks' },
                { key: 'showBrands', label: 'Brand Pills' },
                { key: 'showPromo', label: 'Promo CTA Banner' },
              ].map((item) => (
                <label key={item.key} className="inline-flex items-center gap-2 rounded border border-slate-200 p-3 text-sm dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.sections[item.key])}
                    onChange={(e) => updateSection(item.key, e.target.checked)}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Section Headings</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={formData.headings.featured} onChange={(e) => updateHeading('featured', e.target.value)} placeholder="Featured section heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.headings.latest} onChange={(e) => updateHeading('latest', e.target.value)} placeholder="Latest section heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.headings.topRated} onChange={(e) => updateHeading('topRated', e.target.value)} placeholder="Top rated section heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.headings.budget} onChange={(e) => updateHeading('budget', e.target.value)} placeholder="Budget section heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.headings.brands} onChange={(e) => updateHeading('brands', e.target.value)} placeholder="Brands section heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950 md:col-span-2" />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Stats Cards (4)</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {formData.statsCards.map((card, index) => (
                <div key={`${card.label}-${index}`} className="rounded border border-slate-200 p-3 dark:border-slate-700">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Card {index + 1}</p>
                  <input value={card.label || ''} onChange={(e) => updateStatsCard(index, 'label', e.target.value)} placeholder="Label" className="mb-2 w-full rounded border px-3 py-2 text-sm dark:bg-slate-950" />
                  <input value={card.value || ''} onChange={(e) => updateStatsCard(index, 'value', e.target.value)} placeholder="Value (e.g. 50K+)" className="w-full rounded border px-3 py-2 text-sm dark:bg-slate-950" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Budget Cards (3)</h2>
            <div className="mt-4 grid gap-3">
              {formData.budgetCards.map((card, index) => (
                <div key={`${card.title}-${index}`} className="rounded border border-slate-200 p-3 dark:border-slate-700">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Budget Card {index + 1}</p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <input value={card.title || ''} onChange={(e) => updateBudgetCard(index, 'title', e.target.value)} placeholder="Title" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
                    <input value={card.subtitle || ''} onChange={(e) => updateBudgetCard(index, 'subtitle', e.target.value)} placeholder="Subtitle" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
                    <input value={card.link || ''} onChange={(e) => updateBudgetCard(index, 'link', e.target.value)} placeholder="Link (e.g. /products?maxPrice=10000)" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Brand Strip Control</h2>
            <div className="mt-4 space-y-3">
              <input value={formData.brands.title || ''} onChange={(e) => updateBrands('title', e.target.value)} placeholder="Brand section title" className="w-full rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(formData.brands.useAutoBrands)} onChange={(e) => updateBrands('useAutoBrands', e.target.checked)} />
                Auto-generate brands from products
              </label>
              <textarea
                value={manualBrandsInput}
                onChange={(e) => setManualBrandsInput(e.target.value)}
                rows={3}
                disabled={formData.brands.useAutoBrands}
                placeholder="Manual brands (comma separated)"
                className="w-full rounded border px-3 py-2 text-sm dark:bg-slate-950 disabled:opacity-60"
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Promo CTA Banner</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={formData.promo.eyebrow || ''} onChange={(e) => updatePromo('eyebrow', e.target.value)} placeholder="Eyebrow text" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.promo.title || ''} onChange={(e) => updatePromo('title', e.target.value)} placeholder="Main heading" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <textarea value={formData.promo.description || ''} onChange={(e) => updatePromo('description', e.target.value)} rows={3} placeholder="Description" className="rounded border px-3 py-2 text-sm dark:bg-slate-950 md:col-span-2" />
              <input value={formData.promo.primaryText || ''} onChange={(e) => updatePromo('primaryText', e.target.value)} placeholder="Primary button text" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.promo.primaryLink || ''} onChange={(e) => updatePromo('primaryLink', e.target.value)} placeholder="Primary button link" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.promo.secondaryText || ''} onChange={(e) => updatePromo('secondaryText', e.target.value)} placeholder="Secondary button text" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
              <input value={formData.promo.secondaryLink || ''} onChange={(e) => updatePromo('secondaryLink', e.target.value)} placeholder="Secondary button link" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  )
}
