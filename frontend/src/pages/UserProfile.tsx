"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { User,Award,Coins, Lock, Edit3, Save, X, Eye, EyeOff, Github, Upload, Trash2, Loader2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { getProfile, updateProfile,updateProfileWithImage } from "../services/api"

// Mock achievements data - you might want to fetch this from API too
const achievements = [
  "First Steps - Completed first coding session",
  "Nature Lover - Completed first outdoor activity",
  "Eco Warrior - Earned 100 eco-credits"
]

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGithubToken, setShowGithubToken] = useState(false)
  const [editedGithubUsername, setEditedGithubUsername] = useState("")
  const [editedGithubToken, setEditedGithubToken] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const profileData = await getProfile()
        // Update the user context with fresh data from API
        setUser(profileData.data)
        console.log(profileData.data)
        
        // Initialize edit form fields
        setEditedGithubUsername(profileData.github_username || "")
        setEditedGithubToken(profileData.github_token || "")
        setProfileImage(profileData.profile_pic || null)
      } catch (err: any) {
        console.error("Failed to fetch profile:", err)
        setError(err.response?.data?.message || "Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, []) // Empty dependency array - only run on mount

  // Initialize form fields when user data changes
  useEffect(() => {
    if (user) {
      setEditedGithubUsername(user.github_username || "")
      setEditedGithubToken(user.github_token || "")
      setProfileImage(user.profile_pic || null)
    }
  }, [user])

  useEffect(() => {
    // Clean up the object URL when the component unmounts
    return () => {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage)
      }
    }
  }, [profileImage])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    
    try {
      // Prepare profile data for API (excluding image)
      const profileUpdateData: any = {}
      if (editedGithubUsername !== user.github_username) {
        profileUpdateData.github_username = editedGithubUsername
      }
      if (editedGithubToken !== user.github_token) {
        profileUpdateData.github_token = editedGithubToken
      }

      console.log("Saving profile data:", profileUpdateData)
      
      // Update profile with or without image
      let updatedProfile
      if (uploadedImage) {
        // Use the combined update function if there's an image
        updatedProfile = await updateProfileWithImage(profileUpdateData, uploadedImage)
        
        // Clean up the blob URL since we now have a server URL
        if (profileImage && profileImage.startsWith('blob:')) {
          URL.revokeObjectURL(profileImage)
        }
        setUploadedImage(null)
      } else {
        // Just update the profile data
        updatedProfile = await updateProfile(profileUpdateData)
      }
      
      // Update user context with the response from API
      setUser(updatedProfile)
      
      // Update local state with the new values
      setProfileImage(updatedProfile.profile_pic || null)
      
      setIsEditing(false)
    } catch (err: any) {
      console.error("Failed to update profile:", err)
      setError(err.response?.data?.message || err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form fields to current user data
    // setEditedUsername(user.username || "")
    // setEditedEmail(user.email || "")
    setEditedGithubUsername(user.github_username || "")
    setEditedGithubToken(user.github_token || "")
    
    // Reset profile image if changed
    if (uploadedImage) {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage)
      }
      setProfileImage(user.profile_pic || null)
      setUploadedImage(null)
    }
    
    setIsEditing(false)
    setError(null)
  }

  const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        setError("Image file size must be less than 5MB")
        return
      }
      
      console.log("Profile picture selected:", file.name)
      
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
      setUploadedImage(file)
      setError(null)
    }
  }

  const removeProfileImage = () => {
    if (profileImage && profileImage.startsWith('blob:')) {
      URL.revokeObjectURL(profileImage)
    }
    setProfileImage(null)
    setUploadedImage(null)
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const maskedGithubToken = user.github_token
    ? `${user.github_token.slice(0, 6)}${'*'.repeat(Math.max(0, user.github_token.length - 10))}${user.github_token.slice(-4)}`
    : ""

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 flex items-center">
          <User className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
          Profile
        </h1>
        <p className="text-green-600 text-sm sm:text-base">Manage your account settings and view your eco-coding journey.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-800 text-lg sm:text-xl">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-green-600 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                  >
                    <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="border-gray-300 bg-transparent text-xs sm:text-sm"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-green-200">
                    {profileImage ? (
                      <AvatarImage src={profileImage}  /> //alt={user.github_username}
                    ) : (
                      <AvatarFallback className="bg-green-100 text-green-800 text-xl sm:text-2xl">
                        {user.github_username?.slice(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                      <label htmlFor="profile-pic" className="cursor-pointer">
                        <div className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 sm:p-2">
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <input
                          id="profile-pic"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicUpload}
                          className="hidden"
                        />
                      </label>
                      {profileImage && (
                        <button
                          onClick={removeProfileImage}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:p-2"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <div className="space-y-3 sm:space-y-4">
                      {/* <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
                        <Input
                          id="username"
                          value={editedUsername}
                          onChange={(e) => setEditedUsername(e.target.value)}
                          className="border-green-200 focus:border-green-500 text-sm sm:text-base"
                          disabled={isSaving}
                        />
                      </div> */}
                      {/* <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          className="border-green-200 focus:border-green-500 text-sm sm:text-base"
                          disabled={isSaving}
                        />
                      </div> */}
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="github-username" className="text-xs sm:text-sm">GitHub Username</Label>
                        <Input
                          id="github-username"
                          value={editedGithubUsername}
                          onChange={(e) => setEditedGithubUsername(e.target.value)}
                          className="border-green-200 focus:border-green-500 text-sm sm:text-base"
                          placeholder="your-github-username"
                          disabled={isSaving}
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor="github-token" className="text-xs sm:text-sm">GitHub Token</Label>
                        <div className="relative">
                          <Input
                            id="github-token"
                            type={showGithubToken ? "text" : "password"}
                            value={editedGithubToken}
                            onChange={(e) => setEditedGithubToken(e.target.value)}
                            className="border-green-200 focus:border-green-500 pr-10 text-sm sm:text-base"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            disabled={isSaving}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowGithubToken(!showGithubToken)}
                            disabled={isSaving}
                          >
                            {showGithubToken ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Used for GitHub integration and activity tracking
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {/* <h2 className="text-xl sm:text-2xl font-bold text-green-800 text-center sm:text-left">{user.username}</h2> */}
                      {/* <div className="flex items-center space-x-2 text-green-600 text-sm sm:text-base">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{user.email}</span>
                      </div> */}
                      {/* <div className="flex items-center space-x-2 text-green-600 text-sm sm:text-base">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Joined {joinDate}</span>
                      </div> */}
                      {user.github_username && (
                        <div className="flex items-center space-x-2 text-green-600 text-sm sm:text-base">
                          <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{user.github_username}</span>
                        </div>
                      )}
                      {user.github_token && (
                        <div className="flex items-center space-x-2 text-green-600 text-sm sm:text-base">
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-mono text-xs sm:text-sm">
                            {showGithubToken ? user.github_token : maskedGithubToken}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-green-50"
                            onClick={() => setShowGithubToken(!showGithubToken)}
                          >
                            {showGithubToken ? (
                              <EyeOff className="h-3 w-3 text-green-600" />
                            ) : (
                              <Eye className="h-3 w-3 text-green-600" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 flex items-center text-lg sm:text-xl">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Achievements
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Badges you've earned on your eco-coding journey</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800 text-sm sm:text-base">{achievement}</h4>
                        <p className="text-xs text-green-600">Achievement unlocked!</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 sm:py-8">
                    <Award className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base">No achievements yet</p>
                    <p className="text-xs sm:text-sm text-gray-500">Complete activities to earn your first badge!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 text-base sm:text-lg">Eco-Credits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="font-medium text-green-800 text-xs sm:text-sm">Available</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 sm:px-3 py-1">{user.eco_credits || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  <span className="font-medium text-orange-800 text-xs sm:text-sm">Locked</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 sm:px-3 py-1">{user.locked_credits || 0}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-xs sm:text-sm">Total Earned</span>
                <span className="text-base sm:text-lg font-bold text-green-800">{(user.eco_credits || 0) + (user.locked_credits || 0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 text-base sm:text-lg">Streak Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-1" />
                  <div className="text-lg sm:text-xl font-bold text-yellow-800">{user.current_streak || 0}</div>
                </div>
                <div className="text-xs text-yellow-600">Current Streak</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-1" />
                  <div className="text-lg sm:text-xl font-bold text-purple-800">{user.longest_streak || 0}</div>
                </div>
                <div className="text-xs text-purple-600">Longest Streak</div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 text-base sm:text-lg">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-blue-800">{user.coding_hours || 0}</div>
                <div className="text-xs text-blue-600">Coding Hours</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-green-800">{user.activitiesCount || 0}</div>
                <div className="text-xs text-green-600">Activities Completed</div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}