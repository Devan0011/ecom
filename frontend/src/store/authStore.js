// Auth Store using Zustand
import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  authChecked: false,

  // Check if user is logged in
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        authChecked: true,
      })
      return
    }

    try {
      set({ isLoading: true })
      const response = await api.get('/auth/profile')
      const user = response.data.user
      localStorage.setItem('user', JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        authChecked: true,
      })
    } catch (_error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authChecked: true,
      })
    }
  },

  // Register user
  register: async (userData) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        authChecked: true,
      })
      toast.success('Registration successful!')
      return true
    } catch (error) {
      set({ isLoading: false, authChecked: true })
      const message = error.response?.data?.message
        || (error.request ? 'Cannot reach server. Check deployment API URL and backend status.' : 'Registration failed')
      toast.error(message)
      return false
    }
  },

  // Login user
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        authChecked: true,
      })
      toast.success('Login successful!')
      return true
    } catch (error) {
      set({ isLoading: false, authChecked: true })
      const message = error.response?.data?.message
        || (error.request ? 'Cannot reach server. Check deployment API URL and backend status.' : 'Login failed')
      toast.error(message)
      return false
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      authChecked: true,
    })
    toast.success('Logged out successfully')
  },

  // Update profile
  updateProfile: async (userData) => {
    set({ isLoading: true })
    try {
      const response = await api.put('/auth/profile', userData)
      const updatedUser = response.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      set({
        user: updatedUser,
        isLoading: false,
      })
      toast.success('Profile updated successfully')
      return true
    } catch (error) {
      set({ isLoading: false })
      toast.error(error.response?.data?.message || 'Update failed')
      return false
    }
  },

  // Add address
  addAddress: async (address) => {
    try {
      const response = await api.post('/auth/address', address)
      const updatedUser = response.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      set({ user: updatedUser })
      toast.success('Address added successfully')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address')
      return false
    }
  },
}))
