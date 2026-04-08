// User Profile Page
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Edit2, MapPin } from 'lucide-react'

export default function UserProfile() {
  const { user, updateProfile, addAddress } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
  })
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    const success = await addAddress(newAddress)
    if (success) {
      setShowAddressForm(false)
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={20} /> Edit
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    placeholder="First Name"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    placeholder="Last Name"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Gender:</strong> {user?.gender || 'Not specified'}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin size={24} /> Saved Addresses
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {showAddressForm ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  placeholder="Street Address"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="City"
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="State"
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    placeholder="Postal Code"
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    placeholder="Country"
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Address
                </button>
              </form>
            )}

            {user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <p className="font-semibold">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-gray-600">{addr.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No addresses saved yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Member Status</p>
            <p className="text-lg font-bold text-blue-600">Premium Member</p>
            <p className="text-sm text-blue-600 mt-2">Free shipping on all orders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
