// Cart Store using Zustand
import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,

  // Fetch cart
  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/cart')
      set({
        cart: response.data.cart,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      console.error('Failed to fetch cart')
    }
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity })
      set({ cart: response.data.cart })
      toast.success('Added to cart')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart')
      return false
    }
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity })
      set({ cart: response.data.cart })
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart')
      return false
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`)
      set({ cart: response.data.cart })
      toast.success('Removed from cart')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from cart')
      return false
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart')
      set({ cart: response.data.cart })
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart')
      return false
    }
  },

  // Get cart total
  getCartTotal: () => {
    const cart = get().cart
    return cart?.totalPrice || 0
  },

  // Get cart item count
  getCartItemCount: () => {
    const cart = get().cart
    return cart?.totalItems || 0
  },
}))
