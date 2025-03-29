"use client"

import { useState, useEffect } from "react"
import {Link,useNavigate} from "react-router"
//import Image from "next/image"
import { ArrowLeft, Search, X, Users } from "lucide-react"
import Header from "/src/components/header"
import { useAuth } from "/src/lib/auth-context"

// User type definition
// type User = {
//   id: string
//   name: string
//   image?: string
//   type: "user" | "event"
//   eventTitle?: string
// }

export default function NewMessagePage() {
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [recentContacts, setRecentContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      //router.push("/login")
      navigate("/login")

    }
  }, [user, isLoading, navigate])

  // Load recent contacts
  useEffect(() => {
    if (user) {
      // In a real app, these would be fetched from an API
      // For demo purposes, we'll create mock data
      const mockRecentContacts = [
        {
          id: "user2",
          name: "김예술",
          image: "/placeholder.svg?height=40&width=40&text=김예술",
          type: "user",
        },
        {
          id: "user3",
          name: "이음악",
          image: "/placeholder.svg?height=40&width=40&text=이음악",
          type: "user",
        },
        {
          id: "event1",
          name: "클래식 음악회 담당자",
          image: "/placeholder.svg?height=40&width=40&text=음악회",
          type: "event",
          eventTitle: "봄의 선율: 클래식 음악회",
        },
        {
          id: "user4",
          name: "박미술",
          image: "/placeholder.svg?height=40&width=40&text=박미술",
          type: "user",
        },
      ]

      setRecentContacts(mockRecentContacts)
    }
  }, [user])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      // In a real app, this would be an API call
      // For demo purposes, we'll filter from a mock list
      const mockAllUsers = [
        {
          id: "user2",
          name: "김예술",
          image: "/placeholder.svg?height=40&width=40&text=김예술",
          type: "user",
        },
        {
          id: "user3",
          name: "이음악",
          image: "/placeholder.svg?height=40&width=40&text=이음악",
          type: "user",
        },
        {
          id: "user4",
          name: "박미술",
          image: "/placeholder.svg?height=40&width=40&text=박미술",
          type: "user",
        },
        {
          id: "user5",
          name: "최댄스",
          image: "/placeholder.svg?height=40&width=40&text=최댄스",
          type: "user",
        },
        {
          id: "user6",
          name: "정연기",
          image: "/placeholder.svg?height=40&width=40&text=정연기",
          type: "user",
        },
        {
          id: "event1",
          name: "클래식 음악회 담당자",
          image: "/placeholder.svg?height=40&width=40&text=음악회",
          type: "event",
          eventTitle: "봄의 선율: 클래식 음악회",
        },
        {
          id: "event2",
          name: "현대미술 전시회 담당자",
          image: "/placeholder.svg?height=40&width=40&text=전시회",
          type: "event",
          eventTitle: "현대미술의 빛과 그림자 전시회",
        },
        {
          id: "event3",
          name: "발레 공연 담당자",
          image: "/placeholder.svg?height=40&width=40&text=발레",
          type: "event",
          eventTitle: "발레 갈라 콘서트: 백조의 호수",
        },
      ]

      const filtered = mockAllUsers.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.eventTitle && contact.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Handle selecting a contact
  const handleSelectContact = (selectedUser) => {
    // In a real app, this would create a Before conversation or navigate to an existing one
    // For demo purposes, we'll just navigate to a mock message detail page
    if (selectedUser.type === "event") {
      navigate("/messages/msg5") // Navigate to the event message example
    } else {
      navigate("/messages/msg1") // Navigate to the personal message example
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


      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="bg-white rounded-t-lg shadow-sm p-4 flex items-center border-b">
            <Link to="/messages" className="text-gray-700 hover:text-primary mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">새 메세지</h1>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="이름 또는 이벤트명으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearching(e.target.value.length > 0)
                }}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setIsSearching(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search results or recent contacts */}
          <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
            {isSearching ? (
              // Search results
              <div>
                <div className="p-3 bg-gray-50 border-b">
                  <h2 className="text-sm font-medium text-gray-600">검색 결과</h2>
                </div>
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((contact) => (
                      <button
                        key={contact.id}
                        className="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <img
                            src={contact.image || "/placeholder.svg?height=40&width=40"}
                            alt={contact.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {contact.type === "event" ? (
                              <span className="text-primary">[{contact.eventTitle}]</span>
                            ) : (
                              ""
                            )}{" "}
                            {contact.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {contact.type === "event" ? "이벤트 담당자" : "사용자"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">검색 결과가 없습니다</div>
                )}
              </div>
            ) : (
              // Recent contacts
              <div>
                <div className="p-3 bg-gray-50 border-b">
                  <h2 className="text-sm font-medium text-gray-600">최근 연락한 사용자</h2>
                </div>
                {recentContacts.length > 0 ? (
                  <div>
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        className="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <img
                            src={contact.image || "/placeholder.svg?height=40&width=40"}
                            alt={contact.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {contact.type === "event" ? (
                              <span className="text-primary">[{contact.eventTitle}]</span>
                            ) : (
                              ""
                            )}{" "}
                            {contact.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {contact.type === "event" ? "이벤트 담당자" : "사용자"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">최근 연락한 사용자가 없습니다</div>
                )}

                {/* Group message button */}
                <div className="p-4 border-t">
                  <button
                    onClick={() => navigate("/messages/group/new")}
                    className="w-full flex items-center justify-center p-3 border border-primary text-primary rounded-lg hover:bg-primary/5"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    그룹 메세지 만들기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

