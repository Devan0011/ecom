import { useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../../components/admin/AdminShell'
import api from '../../services/api'

const initialForm = {
  name: '',
  description: '',
  category: 'Phones',
  brand: '',
  price: '',
  originalPrice: '',
  discount: '',
  stock: '',
  imageUrl: '',
  isFeatured: false,
  specificationJson: '{}',
}

const categories = ['Phones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras']

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(initialForm)

  const heading = useMemo(() => (editingId ? 'Edit Product' : 'Add Product'), [editingId])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/products', { params: { limit: 100, page: 1 } })
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    let specification = {}
    try {
      specification = formData.specificationJson?.trim() ? JSON.parse(formData.specificationJson) : {}
    } catch (error) {
      toast.error('Specification must be valid JSON')
      return
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      price: Number(formData.price || 0),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price || 0),
      discount: Number(formData.discount || 0),
      stock: Number(formData.stock || 0),
      isFeatured: formData.isFeatured,
      specification,
      images: formData.imageUrl
        ? [{ url: formData.imageUrl.trim(), alt: formData.name.trim() }]
        : [],
    }

    if (!payload.name || !payload.description || !payload.brand || payload.price <= 0 || payload.stock < 0) {
      toast.error('Please fill required fields correctly')
      return
    }

    try {
      setIsSaving(true)
      if (editingId) {
        await api.put(`/products/${editingId}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/products', payload)
        toast.success('Product created')
      }

      setFormData(initialForm)
      setEditingId(null)
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Phones',
      brand: product.brand || '',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      discount: product.discount ?? '',
      stock: product.stock ?? '',
      imageUrl: product.images?.[0]?.url || '',
      isFeatured: Boolean(product.isFeatured),
      specificationJson: JSON.stringify(product.specification || {}, null, 2),
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return
    }

    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <AdminShell
      title="Manage Products"
      subtitle="Create, update and curate products for the storefront catalog."
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
          <Plus size={16} /> Add Product
        </button>
      }
    >
      {showForm && (
        <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">{heading}</h2>
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
            <input value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Product name" className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Description" rows={3} className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <select value={formData.category} onChange={(e) => updateField('category', e.target.value)} className="rounded border px-3 py-2 text-sm dark:bg-slate-950">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input value={formData.brand} onChange={(e) => updateField('brand', e.target.value)} placeholder="Brand" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <input type="number" min="1" value={formData.price} onChange={(e) => updateField('price', e.target.value)} placeholder="Selling price" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <input type="number" min="1" value={formData.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} placeholder="Original price" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input type="number" min="0" max="100" value={formData.discount} onChange={(e) => updateField('discount', e.target.value)} placeholder="Discount %" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <input type="number" min="0" value={formData.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="Stock" className="rounded border px-3 py-2 text-sm dark:bg-slate-950" required />
            <input value={formData.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} placeholder="Primary image URL" className="md:col-span-2 rounded border px-3 py-2 text-sm dark:bg-slate-950" />
            <textarea value={formData.specificationJson} onChange={(e) => updateField('specificationJson', e.target.value)} rows={5} className="md:col-span-2 rounded border px-3 py-2 font-mono text-xs dark:bg-slate-950" placeholder='{"processor":"Snapdragon","ram":"8GB"}' />

            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} />
              Mark as featured product
            </label>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={isSaving} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
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
          <div className="py-12 text-center text-sm text-slate-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Stock</th>
                  <th className="px-3 py-2 text-left">Featured</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/80x80?text=Item'} alt={product.name} className="h-12 w-12 rounded object-cover" />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{product.category}</td>
                    <td className="px-3 py-3">Rs. {Number(product.price || 0).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-3">{product.stock}</td>
                    <td className="px-3 py-3">{product.isFeatured ? 'Yes' : 'No'}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => handleEdit(product)} className="inline-flex items-center gap-1 text-blue-700"><Edit2 size={14} /> Edit</button>
                        <button type="button" onClick={() => handleDelete(product._id)} className="inline-flex items-center gap-1 text-rose-600"><Trash2 size={14} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
