"use client"

import { useState, useEffect } from "react"
import {Link, useNavigate} from "react-router"
import { Bell, Settings, Search, X, ChevronRight } from "lucide-react"
import Header from "/src/components/header"
import { useAuth } from "/src/lib/auth-context"


export default function MessagesPage() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  // Load messages and notifications
  useEffect(() => {
    if (user) {
      // In a real app, these would be fetched from an API
      // For demo purposes, we'll create mock data
      const mockPersonalMessages = [
        {
          id: "msg1",
          type: "personal",
          senderId: "user2",
          senderName: "김예술",
          senderImage: "/placeholder.svg?height=40&width=40&text=김예술",
          content: "안녕하세요! 지난번 공연 정말 멋졌어요.",
          timestamp: "2024-03-14T10:30:00",
          isRead: false,
        },
        {
          id: "msg2",
          type: "personal",
          senderId: "user3",
          senderName: "이음악",
          senderImage: "/placeholder.svg?height=40&width=40&text=이음악",
          content: "다음 주 연습 일정 확인해 주세요.",
          timestamp: "2024-03-13T15:45:00",
          isRead: true,
        },
        {
          id: "msg3",
          type: "personal",
          senderId: "user4",
          senderName: "박미술",
          senderImage: "/placeholder.svg?height=40&width=40&text=박미술",
          content: "전시회 초대장 보내드립니다. 꼭 와주세요!",
          timestamp: "2024-03-12T09:15:00",
          isRead: true,
        },
        {
          id: "msg4",
          type: "personal",
          senderId: "user5",
          senderName: "최댄스",
          senderImage: "/placeholder.svg?height=40&width=40&text=최댄스",
          content: "안무 영상 공유해 드립니다. 피드백 부탁드려요.",
          timestamp: "2024-03-11T18:20:00",
          isRead: true,
        },
      ]

      const mockEventMessages = [
        {
          id: "msg5",
          type: "event",
          senderId: "event1",
          senderName: "클래식 음악회 담당자",
          eventId: "event1",
          eventTitle: "봄의 선율: 클래식 음악회",
          content: "문의하신 좌석 배치도 첨부해 드립니다.",
          timestamp: "2024-03-14T11:20:00",
          isRead: false,
        },
        {
          id: "msg6",
          type: "event",
          senderId: "event2",
          senderName: "현대미술 전시회 담당자",
          eventId: "event2",
          eventTitle: "현대미술의 빛과 그림자 전시회",
          content: "단체 관람 할인에 대한 안내 드립니다.",
          timestamp: "2024-03-13T14:10:00",
          isRead: true,
        },
        {
          id: "msg7",
          type: "event",
          senderId: "event3",
          senderName: "발레 공연 담당자",
          eventId: "event3",
          eventTitle: "발레 갈라 콘서트: 백조의 호수",
          content: "예매하신 공연 시간이 30분 지연될 예정입니다. 양해 부탁드립니다.",
          timestamp: "2024-03-12T16:45:00",
          isRead: true,
        },
      ]

      const mockNotifications = [
        {
          id: "notif1",
          type: "message",
          title: "새 메시지",
          content: "김예술님으로부터 새 메시지가 도착했습니다.",
          timestamp: "2024-03-14T10:30:00",
          isRead: false,
          linkTo: "/messages",
        },
        {
          id: "notif2",
          type: "event",
          title: "공연 알림",
          content: "예매하신 '봄의 선율: 클래식 음악회' 공연이 내일 예정되어 있습니다.",
          timestamp: "2024-03-13T09:00:00",
          isRead: false,
          linkTo: "/booking/음악-1",
        },
        {
          id: "notif3",
          type: "system",
          title: "시스템 알림",
          content: "art U 앱이 업데이트 되었습니다. 새로운 기능을 확인해보세요!",
          timestamp: "2024-03-12T15:30:00",
          isRead: true,
          linkTo: "/",
        },
        {
          id: "notif4",
          type: "event",
          title: "예매 확인",
          content: "'현대미술의 빛과 그림자 전시회' 예매가 확정되었습니다.",
          timestamp: "2024-03-11T11:20:00",
          isRead: true,
          linkTo: "/booking/미술-1",
        },
      ]

      setMessages([...mockPersonalMessages, ...mockEventMessages])
      setNotifications(mockNotifications)
    }
  }, [user])

  // Filter messages based on active tab
  const filteredMessages = messages.filter((message) => {
    if (searchQuery) {
      return (
          message.type === activeTab &&
          (message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (message.eventTitle && message.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    }
    return message.type === activeTab
  })

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Helper function to format time
    const formatTime = (date) => date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

    // Helper function to format date
    const formatDate = (date) => date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });

    if (diffDays === 0) {
      // Today: show time
      return formatTime(date);
    } else if (diffDays === 1) {
      // Yesterday
      return "어제";
    } else if (diffDays < 7) {
      // Within a week
      return `${diffDays}일 전`;
    } else {
      // More than a week
      return formatDate(date);
    }
  };

  // Count unread messages
  const unreadCount = messages.filter((message) => !message.isRead).length;
  console.log(unreadCount);

  // Count unread notifications
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Mark message as read and navigate to conversation detail page
  const handleMessageClick = (message) => {
    // Mark as read
    setMessages(messages.map((msg) => (msg.id === message.id ? { ...msg, isRead: true } : msg)))

    // Navigate to conversation detail
    navigate(`/messages/${message.id}`)
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
            {/* Messages header */}
            <div className="bg-purple-50 rounded-t-lg p-4 flex justify-between items-center">
              <Link to="/mypage" className="text-gray-700 hover:text-primary">
                <Settings className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-center flex-grow">메세지</h1>
              <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-700 hover:text-primary relative"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-medium">알림</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    to={notification.linkTo || "#"}
                                    className={`block p-3 border-b border-gray-100 hover:bg-gray-50 ${
                                        !notification.isRead ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-sm">{notification.title}</p>
                                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                                  </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">알림이 없습니다</div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-200 text-center">
                        <Link to="/notifications" className="text-sm text-primary hover:underline">
                          모든 알림 보기
                        </Link>
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Message tabs */}
            <div className="bg-white flex border-b">
              <button
                  className={`flex-1 py-3 text-center font-medium ${
                      activeTab === "personal" ? "text-primary border-b-2 border-primary" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("personal")}
              >
                개인메세지
              </button>
              <button
                  className={`flex-1 py-3 text-center font-medium ${
                      activeTab === "event" ? "text-primary border-b-2 border-primary" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("event")}
              >
                이벤트메세지
              </button>
            </div>

            {/* Search bar */}
            <div className="bg-white p-3 border-b">
              <div className="relative">
                <input
                    type="text"
                    placeholder="메세지 검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setIsSearching(e.target.value.length > 0)
                    }}
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

            {/* Message list */}
            <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
              {filteredMessages.length > 0 ? (
                  <div>
                    {filteredMessages.map((message) => (
                        <button
                            key={message.id}
                            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 flex items-start ${
                                !message.isRead ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleMessageClick(message)}
                            aria-label={`${message.senderName}과의 대화 보기`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                              <img
                                  src={message.senderImage || "/placeholder.svg?height=40&width=40"}
                                  alt={message.senderName}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium truncate">
                                {message.type === "event" ? <span className="text-primary">[{message.eventTitle}]</span> : ""}{" "}
                                {message.senderName}
                              </h3>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTimestamp(message.timestamp)}
                        </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.content}</p>
                            <p className="text-xs text-primary mt-1">대화 내용 보기</p>
                          </div>
                          <div className="flex-shrink-0 ml-2 self-center">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </button>
                    ))}
                  </div>
              ) : (
                  <div className="p-8 text-center text-gray-500">
                    {searchQuery ? "검색 결과가 없습니다" : "메세지가 없습니다"}
                  </div>
              )}
            </div>

            {/* New message button */}
            <div className="mt-4 flex justify-end">
              <Link
                  to="/messages/new"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 shadow-md"
              >
                + 새 메세지
              </Link>
            </div>
          </div>
        </main>
      </div>
  )
}

