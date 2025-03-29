"use client"

import { useState, useEffect } from "react"
import {Link, useNavigate} from "react-router"
import { Bell, Moon, Sun, Globe, Lock, User, LogOut, ArrowLeft, Camera, Save } from "lucide-react"

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("account")
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingNotifications, setMarketingNotifications] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [language, setLanguage] = useState("ko")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
  })

  // 사용자 정보 로드
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      navigate("/login")
    } else {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setProfileData({
        name: userData.name || "사용자",
        email: userData.email || "user@example.com",
        bio: userData.bio || "자기소개가 없습니다.",
        phone: userData.phone || "010-1234-5678",
      })
    }
  }, [])

  // 로그아웃 함수
  const handleSignOut = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  // 프로필 저장
  const saveProfile = () => {
    if (user) {
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
    }
  }

  // 다크 모드 토글
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // 실제로는 여기서 다크 모드를 적용하는 로직이 필요합니다
  }

  // 알림 설정 토글
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  if (!user) {
    return <div className="container mx-auto py-10">로딩 중...</div>
  }

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <Link to="/mypage" className="mr-4 p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">설정</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 사이드바 */}
            <div className="md:w-64 bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center mb-6 p-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    <img
                        src={user.profileImage || "/placeholder.svg?height=80&width=80&text=User"}
                        alt="프로필 이미지"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 font-medium">{profileData.name}</p>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              <nav>
                <ul className="space-y-1" >
                  <li>
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "account" ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      계정 정보
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "security" ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      보안 설정
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "notifications" ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      알림 설정
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("appearance")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "appearance" ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                    >
                      {darkMode ? <Moon className="h-5 w-5 mr-3" /> : <Sun className="h-5 w-5 mr-3" />}
                      화면 설정
                    </button>
                  </li>
                  <li>
                    <button
                        onClick={() => setActiveTab("language")}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === "language" ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"}`}
                    >
                      <Globe className="h-5 w-5 mr-3" />
                      언어 설정
                    </button>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t">
                  <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 rounded-md flex items-center text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    로그아웃
                  </button>
                </div>
              </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {activeTab === "account" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">계정 정보</h2>
                      <button onClick={() => setIsEditing(!isEditing)} className="text-primary hover:underline">
                        {isEditing ? "취소" : "수정"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded-md">{profileData.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                        {isEditing ? (
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded-md">{profileData.bio}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded-md">{profileData.phone}</p>
                        )}
                      </div>

                      {isEditing && (
                          <div className="flex justify-end mt-4">
                            <button
                                onClick={saveProfile}
                                className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              저장하기
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">보안 설정</h2>

                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">비밀번호 변경</h3>
                            <p className="text-sm text-gray-500">마지막 변경: 3개월 전</p>
                          </div>
                          <button className="text-primary hover:underline">변경</button>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">2단계 인증</h3>
                            <p className="text-sm text-gray-500">계정 보안을 강화합니다</p>
                          </div>
                          <button className="text-primary hover:underline">설정</button>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">로그인 기록</h3>
                            <p className="text-sm text-gray-500">최근 로그인 활동을 확인합니다</p>
                          </div>
                          <button className="text-primary hover:underline">보기</button>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">알림 설정</h2>

                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">푸시 알림</h3>
                            <p className="text-sm text-gray-500">새 메시지, 댓글 등의 알림을 받습니다</p>
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

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">이메일 알림</h3>
                            <p className="text-sm text-gray-500">중요 알림을 이메일로 받습니다</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">마케팅 알림</h3>
                            <p className="text-sm text-gray-500">이벤트 및 프로모션 정보를 받습니다</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={marketingNotifications}
                                onChange={() => setMarketingNotifications(!marketingNotifications)}
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
                    <h2 className="text-xl font-semibold mb-6">화면 설정</h2>

                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">다크 모드</h3>
                            <p className="text-sm text-gray-500">어두운 테마로 전환합니다</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">글꼴 크기</h3>
                            <p className="text-sm text-gray-500">텍스트 크기를 조정합니다</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="px-2 py-1 border rounded-md text-sm">작게</button>
                            <button className="px-2 py-1 bg-primary text-white rounded-md text-sm">보통</button>
                            <button className="px-2 py-1 border rounded-md text-sm">크게</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "language" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">언어 설정</h2>

                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">언어 선택</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                          <option value="ko">한국어</option>
                          <option value="en">English</option>
                          <option value="ja">日本語</option>
                          <option value="zh">中文</option>
                        </select>
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

