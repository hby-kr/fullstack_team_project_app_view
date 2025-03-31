"use client"

import { useState, useEffect, useRef } from "react"
import {Link, useNavigate} from "react-router"
import { Bell, Moon, Sun, Globe, Lock, User, LogOut, ArrowLeft, Camera, Save, Eye, EyeOff  } from "lucide-react"

import { useAuth } from "/src/lib/auth-context"
import { useSettings } from "/src/lib/settings-context"
import { languageNames } from "/src/lib/translations"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const fileInputRef = useRef(null)
  const {
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    notificationsEnabled,
    toggleNotifications,
    emailNotifications,
    toggleEmailNotifications,
    marketingNotifications,
    toggleMarketingNotifications,
    autoTranslate,
    toggleAutoTranslate,
    fontSize,
    setFontSize,
    t,
  } = useSettings()


  const [activeTab, setActiveTab] = useState("account")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
  })

  // 비밀번호 변경 상태
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "사용자",
        email: user.email || "user@example.com",
        bio: user.bio || t("defaultBio"),
        phone: user.phone || "010-1234-5678",
        profileImage: user.profileImage || "",
      })
    } else {
      navigate("/login")
    }
  }, [user, navigate, t])

  // 프로필 저장
  const saveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        phone: profileData.phone,
        profileImage: profileData.profileImage,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)

      // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 저장
      alert(t("profileSaved"))
    }
  }

  // 비밀번호 변경
  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    // 비밀번호 유효성 검사
    if (passwordData.newPassword.length < 6) {
      setPasswordError(t("passwordRequirement"))
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("passwordMismatch"))
      return
    }

    // 실제 애플리케이션에서는 여기서 API 호출을 통해 비밀번호 변경
    setPasswordSuccess(t("passwordSuccess"))
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  // 프로필 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profileImage: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // 프로필 이미지 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  if (!user) {
    return <div className="container mx-auto py-10">{t("loading")}</div>
  }

  return (
      <div className={`container mx-auto py-8 px-4 ${darkMode ? "dark" : ""}`}>
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <Link to="/mypage" className="mr-4 p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">{t("settings")}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 사이드바 */}
            <div className="md:w-64 bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center mb-6 p-4">
                <div className="relative">
                  <div
                      className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                      onClick={handleImageClick}
                  >
                    <img
                        src={profileData.profileImage || "/placeholder.svg?height=80&width=80&text=User"}
                        alt={t("name")}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                  </div>
                  <button
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full"
                      onClick={handleImageClick}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 font-medium">{profileData.name}</p>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              <nav>
                <ul className="space-y-1">
                  <li>
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "account" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      {t("accountInfo")}
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "security" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      {t("securitySettings")}
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "notifications" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      {t("notificationSettings")}
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("appearance")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "appearance" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                    >
                      {darkMode ? <Moon className="h-5 w-5 mr-3" /> : <Sun className="h-5 w-5 mr-3" />}
                      {t("appearanceSettings")}
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("language")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "language" ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                    >
                      <Globe className="h-5 w-5 mr-3" />
                      {t("languageSettings")}
                    </button>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 rounded-md flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t("logout")}
                  </button>
                </div>
              </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {activeTab === "account" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">{t("accountInfo")}</h2>
                      <button onClick={() => setIsEditing(!isEditing)} className="text-primary hover:underline">
                        {isEditing ? t("cancel") : t("edit")}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("name")}</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded-md">{profileData.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("email")}
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">{profileData.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("bio")}
                        </label>
                        {isEditing ? (
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">{profileData.bio}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("phone")}
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">{profileData.phone}</p>
                        )}
                      </div>

                      {isEditing && (
                          <div className="flex justify-end mt-4">
                            <button
                                onClick={saveProfile}
                                className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {t("save")}
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("securitySettings")}</h2>

                    <div className="space-y-6">
                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <h3 className="font-medium mb-4 dark:text-white">{t("passwordChange")}</h3>

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">{passwordSuccess}</div>
                        )}

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{passwordError}</div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("currentPassword")}
                            </label>
                            <div className="relative">
                              <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                  className="w-full p-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  required
                              />
                              <button
                                  type="button"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("newPassword")}
                            </label>
                            <div className="relative">
                              <input
                                  type={showNewPassword ? "text" : "password"}
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                  className="w-full p-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  required
                              />
                              <button
                                  type="button"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{t("passwordRequirement")}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("confirmPassword")}
                            </label>
                            <div className="relative">
                              <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                  className="w-full p-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  required
                              />
                              <button
                                  type="button"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                              {t("passwordChange")}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("twoFactorAuth")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("twoFactorDescription")}</p>
                          </div>
                          <button className="text-primary hover:underline">{t("setup")}</button>
                        </div>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("loginHistory")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("loginHistoryDescription")}</p>
                          </div>
                          <button className="text-primary hover:underline">{t("view")}</button>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("notificationSettings")}</h2>

                    <div className="space-y-4">
                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("pushNotifications")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("pushDescription")}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={toggleNotifications}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("emailNotifications")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("emailDescription")}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={toggleEmailNotifications}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("marketingNotifications")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("marketingDescription")}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={marketingNotifications}
                                onChange={toggleMarketingNotifications}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "appearance" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("appearanceSettings")}</h2>

                    <div className="space-y-4">
                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("darkMode")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("darkModeDescription")}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("fontSize")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("fontSizeDescription")}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setFontSize("small")}
                                className={`px-2 py-1 ${fontSize === "small" ? "bg-primary text-white" : "border dark:border-gray-600"} rounded-md text-sm dark:text-gray-300`}
                            >
                              {t("small")}
                            </button>
                            <button
                                onClick={() => setFontSize("medium")}
                                className={`px-2 py-1 ${fontSize === "medium" ? "bg-primary text-white" : "border dark:border-gray-600"} rounded-md text-sm dark:text-gray-300`}
                            >
                              {t("medium")}
                            </button>
                            <button
                                onClick={() => setFontSize("large")}
                                className={`px-2 py-1 ${fontSize === "large" ? "bg-primary text-white" : "border dark:border-gray-600"} rounded-md text-sm dark:text-gray-300`}
                            >
                              {t("large")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "language" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("languageSettings")}</h2>

                    <div className="space-y-4">
                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("languageSelect")}
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {Object.entries(languageNames).map(([code, name]) => (
                              <option key={code} value={code}>
                                {name}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{t("autoTranslate")}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("autoTranslateDescription")}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoTranslate}
                                onChange={toggleAutoTranslate}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

