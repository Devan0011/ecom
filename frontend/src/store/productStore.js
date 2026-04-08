// Product Store using Zustand
import { create } from 'zustand'
import api from '../services/api'

export const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  product: null,
  filters: {},
  isLoading: false,
  pagination: {},

  // Fetch products
  fetchProducts: async (params = {}) => {
    set({ isLoading: true })
    try {
      const response = await api.get('/products', { params })
      set({
        products: response.data.products,
        filteredProducts: response.data.products,
        pagination: response.data.pagination,
        isLoading: false,
      })
    } catch (error) {
      set({
        products: [],
        filteredProducts: [],
        pagination: {},
        isLoading: false,
      })
      console.error('Failed to fetch products')
    }
  },

  // Fetch single product
  fetchProductDetails: async (id) => {
    set({ isLoading: true })
    try {
      const response = await api.get(`/products/${id}`)
      set({
        product: response.data.product,
        isLoading: false,
      })
    } catch (error) {
      set({ product: null, isLoading: false })
      console.error('Failed to fetch product details')
    }
  },

  // Fetch filters
  fetchFilters: async () => {
    try {
      const response = await api.get('/products/filters')
      const nextFilters = response.data.filters || {}
      set({ filters: nextFilters })
      return nextFilters
    } catch (error) {
      console.error('Failed to fetch filters')
      return {}
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured')
      return response.data.products
    } catch (error) {
      console.error('Failed to fetch featured products')
      return []
    }
  },
}))
