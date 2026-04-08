// Wishlist Store using Zustand
import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,

  // Fetch wishlist
  fetchWishlist: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/wishlist')
      set({
        wishlist: response.data.wishlist,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      console.error('Failed to fetch wishlist')
    }
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist/add', { productId })
      set({ wishlist: response.data.wishlist })
      toast.success('Added to wishlist')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist')
      return false
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`)
      set({ wishlist: response.data.wishlist })
      toast.success('Removed from wishlist')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist')
      return false
    }
  },

  // Check if product in wishlist
  isInWishlist: (productId) => {
    const wishlist = get().wishlist
    return wishlist.some((item) => item._id === productId)
  },

  // Toggle wishlist
  toggleWishlist: async (productId) => {
    const isInWishlist = get().isInWishlist(productId)
    if (isInWishlist) {
      return get().removeFromWishlist(productId)
    } else {
      return get().addToWishlist(productId)
    }
  },
}))
