"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Trash2, CreditCard } from "lucide-react"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"

// 장바구니 아이템 타입
type CartItem = {
  id: string
  title: string
  date: string
  time: string
  ticketType: string
  ticketCount: number
  price: number
  image: string
  isGroupDiscount?: boolean
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 장바구니 아이템 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItems = localStorage.getItem("cartItems")
      if (storedItems) {
        setCartItems(JSON.parse(storedItems))
      }
      setIsLoading(false)
    }
  }, [])

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = dayNames[date.getDay()]

    return `${month}월 ${day}일 (${dayOfWeek})`
  }

  // 가격 포맷 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // 장바구니에서 아이템 제거
  const removeFromCart = (index: number) => {
    const updatedItems = [...cartItems]
    updatedItems.splice(index, 1)
    setCartItems(updatedItems)
    localStorage.setItem("cartItems", JSON.stringify(updatedItems))
  }

  // 총 가격 계산
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  // 결제 진행
  const proceedToCheckout = () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다.")
      return
    }

    // 첫 번째 아이템의 ID를 사용하여 결제 페이지로 이동
    // URL 파라미터로 step=3을 전달하여 결제 단계로 바로 이동
    const firstItem = cartItems[0]
    router.push(`/booking/${encodeURIComponent(firstItem.id)}?step=3`)
  }

  if (isLoading) {
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
      <Header />

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>뒤로 가기</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              장바구니
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
                <Link href="/" className="text-primary hover:underline">
                  공연 둘러보기
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row border rounded-lg p-4 gap-4">
                      <div className="md:w-1/4">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={150}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-3/4 flex flex-col">
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <p>
                              일시: {formatDate(item.date)} {item.time}
                            </p>
                            <p>
                              좌석:{" "}
                              {item.ticketType === "vip"
                                ? "VIP석"
                                : item.ticketType === "student"
                                  ? "학생"
                                  : item.ticketType === "disabled"
                                    ? "장애인"
                                    : item.ticketType === "veteran"
                                      ? "국가유공자"
                                      : item.ticketType === "senior"
                                        ? "경로석"
                                        : "일반석"}
                              {item.isGroupDiscount && <span className="ml-1 text-blue-600">(단체할인)</span>}
                            </p>
                            <p>수량: {item.ticketCount}매</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => removeFromCart(index)}
                            className="flex items-center text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </button>
                          <p className="font-bold text-lg">{formatPrice(item.price)}원</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-lg font-medium">총 결제 금액</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(calculateTotal())}원</p>
                  </div>
                  <button
                    onClick={proceedToCheckout}
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center justify-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    결제하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 art U. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

