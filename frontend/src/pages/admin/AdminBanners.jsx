import { useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../../components/admin/AdminShell'
import api from '../../services/api'

const initialForm = {
  title: '',
  description: '',
  image: '',
  link: '',
  linkText: '',
  discount: '',
  discountCode: '',
  isActive: true,
}

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(initialForm)

  const formTitle = useMemo(() => (editingId ? 'Edit Banner' : 'Create Banner'), [editingId])

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await api.get('/banners/admin/all', { params: { limit: 100 } })
      setBanners(response.data.banners || [])
    } catch (error) {
      toast.error('Failed to fetch banners')
      setBanners([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.image.trim()) {
      toast.error('Title and image URL are required')
      return
    }

    try {
      setIsSaving(true)
      if (editingId) {
        await api.put(`/banners/${editingId}`, formData)
        toast.success('Banner updated')
      } else {
        await api.post('/banners', formData)
        toast.success('Banner created')
      }

      resetForm()
      fetchBanners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving banner')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      linkText: banner.linkText || '',
      discount: banner.discount || '',
      discountCode: banner.discountCode || '',
      isActive: Boolean(banner.isActive),
    })
    setEditingId(banner._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return

    try {
      await api.delete(`/banners/${id}`)
      toast.success('Banner deleted')
      fetchBanners()
    } catch (error) {
      toast.error('Failed to delete banner')
    }
  }

  return (
    <AdminShell
      title="Manage Banners"
      subtitle="Control home page campaign creatives, discounts and destination links."
      action={
        <button
          type="button"
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
            } else {
              setShowForm(true)
              setEditingId(null)
            }
          }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Banner
        </button>
      }
    >
      {showForm && (
        <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">{formTitle}</h2>
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
            <input value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Banner title" className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Banner description" rows={3} className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input type="url" value={formData.image} onChange={(e) => updateField('image', e.target.value)} placeholder="Image URL" className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <input value={formData.linkText} onChange={(e) => updateField('linkText', e.target.value)} placeholder="Button text (optional)" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input value={formData.link} onChange={(e) => updateField('link', e.target.value)} placeholder="Link (e.g. /products)" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input value={formData.discount} onChange={(e) => updateField('discount', e.target.value)} placeholder="Discount label (e.g. 40% OFF)" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input value={formData.discountCode} onChange={(e) => updateField('discountCode', e.target.value)} placeholder="Discount code" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />

            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => updateField('isActive', e.target.checked)} />
              Active banner
            </label>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={isSaving} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {isSaving ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
              </button>
              <button type="button" onClick={resetForm} className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading banners...</div>
        ) : banners.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {banners.map((banner) => (
              <article key={banner._id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                  {!banner.isActive && (
                    <span className="absolute left-2 top-2 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                      Inactive
                    </span>
                  )}
                  {banner.discount && (
                    <span className="absolute right-2 top-2 rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                      {banner.discount}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{banner.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{banner.description || 'No description'}</p>
                  <p className="mt-2 text-xs text-slate-500">Order: {banner.order ?? 0}</p>

                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => handleEdit(banner)} className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(banner._id)} className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">No banners found.</div>
        )}
      </section>
    </AdminShell>
  )
}
