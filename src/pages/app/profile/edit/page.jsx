"use client"

import React from "react"

import { useState, useEffect } from "react"
import {Link, useNavigate} from "react-router"
import { User, ArrowLeft, Upload, Save } from "lucide-react"
import { useAuth } from "/src/lib/auth-context"

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  const [name, setName] = useState("")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [gender, setGender] = useState("")
  const [isBirthdayPublic, setIsBirthdayPublic] = useState(false)
  const [isGenderPublic, setIsGenderPublic] = useState(false)
  const [bio, setBio] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [lastNicknameChange, setLastNicknameChange] = useState(null)
  const [canChangeNickname, setCanChangeNickname] = useState(true)
  const [profilePicture, setProfilePicture] = useState(null)

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
      return
    }

    // Initialize form with user data
    if (user) {
      // Use a proper name value or a default if not available
      setName(user.name || "실제 이름을 입력하세요")
      setUserId(user.email)

      // Safely get data from localStorage
      if (typeof window !== "undefined") {
        // Try to get real name from localStorage if available
        const storedRealName = localStorage.getItem("real_name")
        if (storedRealName) {
          setName(storedRealName)
        }

        setUserName(localStorage.getItem("user_name") || "")
        setUserPhone(localStorage.getItem("user_phone") || "")
        setBirthday(localStorage.getItem("birthday") || "")
        setGender(localStorage.getItem("gender") || "")
        setIsBirthdayPublic(localStorage.getItem("isBirthdayPublic") === "true")
        setIsGenderPublic(localStorage.getItem("isGenderPublic") === "true")
        setBio(localStorage.getItem("bio") || "")
        setProfilePicture(localStorage.getItem("profile_picture") || null)

        // Check if nickname can be changed (once per month restriction)
        const lastChangeStr = localStorage.getItem("lastNicknameChange")
        if (lastChangeStr) {
          try {
            const lastChange = new Date(lastChangeStr)
            if (!isNaN(lastChange.getTime())) {
              setLastNicknameChange(lastChange)

              const now = new Date()
              const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
              setCanChangeNickname(lastChange < oneMonthAgo)
            }
          } catch (e) {
            console.error("Error parsing date:", e)
          }
        }
      }
    }
  }, [user, isLoading, navigate])

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        setProfilePicture(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerifyPhone = () => {
    setIsVerifyingPhone(true)
    // In a real app, this would send a verification code to the user's phone
    alert("인증번호가 발송되었습니다. (데모용: 1234)")
  }

  const handleConfirmVerification = () => {
    // In a real app, this would verify the code with your backend
    if (verificationCode === "1234") {
      setIsVerifyingPhone(false)
      alert("전화번호가 인증되었습니다.")
    } else {
      alert("인증번호가 일치하지 않습니다.")
    }
  }

  const handleNicknameChange = (e) => {
    if (!canChangeNickname) {
      alert("닉네임은 한 달에 한 번만 변경할 수 있습니다.")
      return
    }
    setUserName(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, you would update the user profile via API
      // For now, we'll just simulate a delay and redirect back
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local storage (in a real app, this would be handled by your backend)
      if (typeof window !== "undefined") {
        localStorage.setItem("real_name", name)
        localStorage.setItem("user_name", userName)
        localStorage.setItem("user_phone", userPhone)
        localStorage.setItem("birthday", birthday)
        localStorage.setItem("gender", gender)
        localStorage.setItem("isBirthdayPublic", isBirthdayPublic.toString())
        localStorage.setItem("isGenderPublic", isGenderPublic.toString())
        localStorage.setItem("bio", bio)
        if (profilePicture) {
          localStorage.setItem("profile_picture", "profilePicture")
        }

        // If nickname was changed, update the last change date
        if (userName !== localStorage.getItem("user_name")) {
          const now = new Date()
          localStorage.setItem("lastNicknameChange", now.toISOString())
        }
      }

      // Redirect back to mypage
      navigate("/mypage")
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Don't render if loading or not logged in
  if (isLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
                <span className="text-xl font-bold">art U</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <Link to="/mypage" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>마이페이지로 돌아가기</span>
            </Link>

            <h1 className="text-2xl font-bold mb-8">프로필 수정</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <form onSubmit={handleSubmit}>
                {/* Profile picture section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 relative group overflow-hidden">
                    {profilePicture ? (
                        <img
                            src={typeof profilePicture === 'string' ? profilePicture : "/placeholder.svg"}
                            alt="프로필 사진"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-16 h-16 text-gray-500" />
                    )}
                    <label
                        htmlFor="profile-picture"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full cursor-pointer transition-all"
                    >
                      <Upload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="sr-only">프로필 사진 업로드</span>
                    </label>
                    <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="프로필 사진 업로드"
                        onChange={handleProfilePictureChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">프로필 사진을 변경하려면 클릭하세요</p>
                </div>

                {/* Form fields */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      실명
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="실제 이름을 입력하세요"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      실명은 서비스 이용 시 본인 식별 용도로만 사용되며, 별도의 본인 확인 절차는 없습니다. 다른
                      사용자에게는 닉네임만 표시됩니다.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                      아이디 (수정 불가)
                    </label>
                    <input
                        id="userId"
                        type="email"
                        value={userId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">아이디는 변경할 수 없습니다.</p>
                  </div>

                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                      닉네임 {!canChangeNickname && "(한 달에 한 번만 변경 가능)"}
                    </label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={handleNicknameChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${!canChangeNickname ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        disabled={!canChangeNickname}
                        placeholder="사용할 닉네임을 입력하세요"
                    />
                    {lastNicknameChange && !canChangeNickname && (
                        <p className="mt-1 text-xs text-gray-500">
                          마지막 변경일: {lastNicknameChange.toLocaleDateString()}
                        </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호
                    </label>
                    <div className="flex space-x-2">
                      <input
                          id="userPhone"
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="010-0000-0000"
                      />
                      <button
                          type="button"
                          onClick={handleVerifyPhone}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        인��하기
                      </button>
                    </div>
                    {isVerifyingPhone && (
                        <div className="mt-2 flex space-x-2">
                          <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="인증번호 입력"
                          />
                          <button
                              type="button"
                              onClick={handleConfirmVerification}
                              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                          >
                            확인
                          </button>
                        </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">전화번호 변경 시 인증이 필요합니다.</p>
                  </div>

                  <div>
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                      생일
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                          id="birthday"
                          type="date"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${birthday ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          disabled={!!birthday}
                      />
                      <div className="flex items-center">
                        <label htmlFor="birthdayPublic" className="text-sm text-gray-600 mr-2">
                          공개
                        </label>
                        <button
                            type="button"
                            className={`relative w-10 h-6 transition-colors duration-200 ease-in-out rounded-full ${isBirthdayPublic ? "bg-primary" : "bg-gray-200"}`}
                            onClick={() => setIsBirthdayPublic(!isBirthdayPublic)}
                        >
                        <span
                            className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${isBirthdayPublic ? "translate-x-4" : ""}`}
                        />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">생일은 한 번 입력하면 변경할 수 없습니다.</p>
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <div className="flex items-center space-x-4">
                      <select
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">선택하세요</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">기타</option>
                        <option value="prefer_not_to_say">응답하지 않음</option>
                      </select>
                      <div className="flex items-center">
                        <label htmlFor="genderPublic" className="text-sm text-gray-600 mr-2">
                          공개
                        </label>
                        <button
                            type="button"
                            className={`relative w-10 h-6 transition-colors duration-200 ease-in-out rounded-full ${isGenderPublic ? "bg-primary" : "bg-gray-200"}`}
                            onClick={() => setIsGenderPublic(!isGenderPublic)}
                        >
                        <span
                            className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${isGenderPublic ? "translate-x-4" : ""}`}
                        />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      자기소개
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="자신에 대해 간단히 소개해주세요"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Link
                        to="/mypage"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
                        disabled={isSaving}
                    >
                      {isSaving ? (
                          <>저장 중...</>
                      ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            저장하기
                          </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
  )
}

