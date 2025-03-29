"use client"

import React from "react"

import { useState } from "react"
import {Link, useNavigate} from "react-router"
import { useAuth } from "/src/lib/auth-context"

import { ShoppingCart, Search, X, MessageSquare, Bell } from "lucide-react"

export default function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchResults, setShowSearchResults] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowSearchResults(true)
        }
    }

    const clearSearch = () => {
        setSearchQuery("")
        setShowSearchResults(false)
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
                        <span className="text-xl font-bold">art U</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="relative mx-4 flex-grow max-w-xl">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="이벤트, 사용자, 장소 검색..."
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </form>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2">이벤트</h3>
                                        {searchQuery && (
                                            <div className="space-y-2">
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=event`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                            <span className="text-primary text-xs">공연</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery} 관련 공연</p>
                                                            <p className="text-xs text-gray-500">3월 15일 예술의전당</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=event`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                            <span className="text-primary text-xs">전시</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery} 특별전</p>
                                                            <p className="text-xs text-gray-500">4월 10일 국립현대미술관</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2">사용자</h3>
                                        {searchQuery && (
                                            <div className="space-y-2">
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=user`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery}님</p>
                                                            <p className="text-xs text-gray-500">아티스트</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=user`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery}_official</p>
                                                            <p className="text-xs text-gray-500">공연단체</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2">장소</h3>
                                        {searchQuery && (
                                            <div className="space-y-2">
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=place`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                            <span className="text-primary text-xs">장소</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery} 아트센터</p>
                                                            <p className="text-xs text-gray-500">서울 강남구</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}&type=place`} className="block">
                                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                            <span className="text-primary text-xs">장소</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{searchQuery} 공연장</p>
                                                            <p className="text-xs text-gray-500">서울 마포구</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                                        <Link
                                            to={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            "{searchQuery}" 검색결과 모두 보기
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <nav>
                        <div className="flex items-center space-x-4">
                            <Link to="/cart" className="text-gray-700 hover:text-primary relative">
                                <ShoppingCart className="w-5 h-5" />
                                <span
                                    id="cart-count"
                                    className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                >
                  {typeof window !== "undefined" && localStorage.getItem("cartItems")
                      ? JSON.parse(localStorage.getItem("cartItems") || "[]").length
                      : 0}
                </span>
                            </Link>
                            {user && (
                                <>
                                    <Link to="/messages/:id" className="text-gray-700 hover:text-primary relative">
                                        <MessageSquare className="w-5 h-5" />
                                        <span
                                            id="message-count"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                        >
                      {typeof window !== "undefined" && localStorage.getItem("unreadMessages")
                          ? JSON.parse(localStorage.getItem("unreadMessages") || "[]").length
                          : 2}
                    </span>
                                    </Link>
                                    <Link to="/notifications" className="text-gray-700 hover:text-primary relative">
                                        <Bell className="w-5 h-5" />
                                        <span
                                            id="notification-count"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                        >
                      {typeof window !== "undefined" && localStorage.getItem("unreadNotifications")
                          ? JSON.parse(localStorage.getItem("unreadNotifications") || "[]").length
                          : 3}
                    </span>
                                    </Link>
                                </>
                            )}
                            {user ? (
                                <>
                                    <div className="relative group">
                                        <button className="text-gray-700 hover:text-primary flex items-center">
                                            게시물 작성
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[50] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <Link to="/posts/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                일반 게시물
                                            </Link>
                                            <Link
                                                to="/posts/create-booking"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                예매 게시물
                                            </Link>
                                        </div>
                                    </div>
                                    <Link to="/mypage" className="text-gray-700 hover:text-primary">
                                        마이페이지
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-700 hover:text-primary">
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-primary">
                                        로그인
                                    </Link>
                                    <Link to="/signup" className="text-gray-700 hover:text-primary">
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

