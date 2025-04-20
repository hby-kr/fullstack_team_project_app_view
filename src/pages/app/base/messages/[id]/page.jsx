"use client"

import  React from "react"

import { useState, useEffect, useRef } from "react"
import {Link, useParams, useNavigate} from "react-router"
//import Image from "next/image"
import { ArrowLeft, Send, Paperclip, ImageIcon } from "lucide-react"
import Header from "/src/components/header"
import { useAuth } from "/src/lib/auth-context"

// Message type definition
// type Message = {
//   id: string
//   type: "personal" | "event"
//   senderId: string
//   senderName: string
//   senderImage?: string
//   content: string
//   timestamp: string
//   isRead: boolean
//   eventId?: string
//   eventTitle?: string
// }

// Chat message type definition
// type ChatMessage = {
//   id: string
//   senderId: string
//   content: string
//   timestamp: string
//   isFromCurrentUser: boolean
//   attachments?: string[]
// }

export default function MessageDetailPage() {
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [message, setMessage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState([]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login")
    }
  }, [user, isLoading])

  // Load message and chat history
  useEffect(() => {
    if (user && params.id) {
      // In a real app, these would be fetched from an API
      // For demo purposes, we'll create mock data
      const mockMessages = [
        {
          id: "msg1",
          type: "personal",
          senderId: "user2",
          senderName: "김예술",
          senderImage: "/placeholder.svg?height=40&width=40&text=김예술",
          content: "안녕하세요! 지난번 공연 정말 멋졌어요.",
          timestamp: "2024-03-14T10:30:00",
          isRead: true,
        },
        {
          id: "msg5",
          type: "event",
          senderId: "event1",
          senderName: "클래식 음악회 담당자",
          eventId: "event1",
          eventTitle: "봄의 선율: 클래식 음악회",
          content: "문의하신 좌석 배치도 첨부해 드립니다.",
          timestamp: "2024-03-14T11:20:00",
          isRead: true,
        },
      ]

      const foundMessage = mockMessages.find((msg) => msg.id === params.id)
      if (foundMessage) {
        setMessage(foundMessage)

        // Generate mock chat history based on the message
        const mockChatHistory = []

        // Add initial message
        mockChatHistory.push({
          id: `chat-${foundMessage.id}-1`,
          senderId: foundMessage.senderId,
          content: foundMessage.content,
          timestamp: foundMessage.timestamp,
          isFromCurrentUser: false,
        })

        // Add more mock messages for the conversation
        if (foundMessage.type === "personal") {
          mockChatHistory.push({
            id: `chat-${foundMessage.id}-2`,
            senderId: user.id,
            content: "네, 감사합니다! 다음 공연은 언제인가요?",
            timestamp: "2024-03-14T10:35:00",
            isFromCurrentUser: true,
          })
          mockChatHistory.push({
            id: `chat-${foundMessage.id}-3`,
            senderId: foundMessage.senderId,
            content: "다음 공연은 4월 15일에 예정되어 있습니다. 같은 장소에서 진행될 예정이에요.",
            timestamp: "2024-03-14T10:40:00",
            isFromCurrentUser: false,
          })
        } else if (foundMessage.type === "event") {
          mockChatHistory.push({
            id: `chat-${foundMessage.id}-2`,
            senderId: foundMessage.senderId,
            content: "좌석 배치도입니다. 참고해주세요.",
            timestamp: "2024-03-14T11:21:00",
            isFromCurrentUser: false,
            attachments: ["/placeholder.svg?height=300&width=400&text=좌석배치도"],
          })
          mockChatHistory.push({
            id: `chat-${foundMessage.id}-3`,
            senderId: user.id,
            content: "감사합니다. VIP석은 어디인가요?",
            timestamp: "2024-03-14T11:25:00",
            isFromCurrentUser: true,
          })
          mockChatHistory.push({
            id: `chat-${foundMessage.id}-4`,
            senderId: foundMessage.senderId,
            content: "VIP석은 무대 정면 A, B, C 구역입니다. 좌석 번호는 1~20번입니다.",
            timestamp: "2024-03-14T11:30:00",
            isFromCurrentUser: false,
          })
        }

        setChatHistory(mockChatHistory)
      } else {
        // Message not found, redirect to messages page
        navigate("/messages")
      }
    }
  }, [user, params.id])

  // Scroll to bottom when chat history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for chat sections
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "오늘"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제"
    } else {
      return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    }
  }

  // Group chat messages by date
  const groupedChatMessages = chatHistory.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  // Handle sending a Before message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() && attachments.length === 0) return

    setIsSubmitting(true)

    // Create Before chat message
    const newChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: user?.id || "",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isFromCurrentUser: true,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    // Add to chat history
    setChatHistory([...chatHistory, newChatMessage])

    // Clear input and attachments
    setNewMessage("")
    setAttachments([])
    setIsSubmitting(false)
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = e.target.files
    if (!files) return

    const newAttachments = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newAttachments.push(e.target.result)
          if (newAttachments.length === files.length) {
            setAttachments((prev) => [...prev, ...newAttachments])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
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

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">메세지를 찾을 수 없습니다</p>
          <Link to="/messages" className="text-primary hover:underline">
            메세지 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">


      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-4 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
          {/* Chat header */}
          <div className="bg-white rounded-t-lg shadow-sm p-4 flex items-center border-b">
            <Link to="/messages" className="text-gray-700 hover:text-primary mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
              <img
                src={message.senderImage || "/placeholder.svg?height=40&width=40"}
                alt={message.senderName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium">
                {message.type === "event" ? <span className="text-primary">[{message.eventTitle}]</span> : ""}{" "}
                {message.senderName}
              </h2>
              <p className="text-xs text-gray-500">{message.type === "event" ? "이벤트 담당자" : "사용자"}</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="bg-white flex-grow overflow-y-auto p-4">
            {Object.entries(groupedChatMessages).map(([date, messages]) => (
              <div key={date} className="mb-6">
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {formatDate(messages[0].timestamp)}
                  </span>
                </div>
                <div className="space-y-4">
                  {messages.map((chatMessage) => (
                    <div
                      key={chatMessage.id}
                      className={`flex ${chatMessage.isFromCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          chatMessage.isFromCurrentUser
                            ? "bg-primary text-white rounded-l-lg rounded-tr-lg"
                            : "bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg"
                        } p-3`}
                      >
                        {chatMessage.content && <p className="whitespace-pre-wrap">{chatMessage.content}</p>}
                        {chatMessage.attachments && chatMessage.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {chatMessage.attachments.map((attachment, index) => (
                              <div key={index} className="rounded overflow-hidden">
                                <img
                                  src={attachment || "/placeholder.svg"}
                                  alt="Attachment"
                                  width={300}
                                  height={200}
                                  className="max-w-full h-auto"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <div
                          className={`text-xs mt-1 ${
                            chatMessage.isFromCurrentUser ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {formatTimestamp(chatMessage.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Attachment preview */}
          {attachments.length > 0 && (
            <div className="bg-white p-3 border-t">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={attachment || "/placeholder.svg"}
                      alt="Attachment preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="bg-white rounded-b-lg shadow-sm p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary rounded-full"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary rounded-full"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="메세지를 입력하세요..."
                className="flex-grow mx-2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSubmitting || (!newMessage.trim() && attachments.length === 0)}
                className="p-2 bg-primary text-white rounded-full disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

