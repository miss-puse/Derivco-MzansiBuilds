import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProjects } from '../context/ProjectContext'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { getMyProjects } = useProjects()
  const myProjects = getMyProjects()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  const completedCount = myProjects.filter(p => p.status === 'completed').length
  const activeCount = myProjects.filter(p => p.status !== 'completed').length
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border-2 border-black rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-black">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
                rows="4"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white border-2 border-black px-6 py-2 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-black mb-2">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {user.bio && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">{myProjects.length}</div>
                <div className="text-gray-600">Total Projects</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">{activeCount}</div>
                <div className="text-gray-600">Active</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">{completedCount}</div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-2 border-black rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Member since:</span> {memberSince}</p>
          <p><span className="font-semibold">Account ID:</span> {user.id}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
