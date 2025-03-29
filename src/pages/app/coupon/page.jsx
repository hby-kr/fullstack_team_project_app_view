"use client"

import { useState, useEffect } from "react"
import Header from "/src/components/header"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

// type Coupon = {
//   id: string
//   title: string
//   description: string
//   validUntil: string
//   isUsed: boolean
// }

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState("available")

  useEffect(() => {
    // 세션 스토리지에서 쿠폰 불러오기
    const storedCoupons = sessionStorage.getItem("coupons")
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons))
    } else {
      // 테스트용: 쿠폰이 없을 경우 생성
      const mockCoupons = [
        {
          id: "coupon-1",
          title: "10% 할인 쿠폰",
          description: "모든 공연에 사용할 수 있는 10% 할인 쿠폰",
          validUntil: "2024-12-31",
          isUsed: false,
        },
        {
          id: "coupon-2",
          title: "무료 음료 쿠폰",
          description: "1개 공연에 대해 무료로 음료 제공",
          validUntil: "2024-11-30",
          isUsed: true,
        },
        {
          id: "coupon-3",
          title: "15% 할인 쿠폰",
          description: "특정 공연에 적용 가능한 15% 할인 쿠폰",
          validUntil: "2024-10-15",
          isUsed: false,
        },
        {
          id: "coupon-4",
          title: "무료 티켓 업그레이드",
          description: "일반석 티켓을 VIP 티켓으로 업그레이드 가능",
          validUntil: "2024-09-01",
          isUsed: true,
        },
      ]

      // 세션 스토리지에 쿠폰 저장
      sessionStorage.setItem("coupons", JSON.stringify(mockCoupons))
      setCoupons(mockCoupons)
    }
  }, [])

  const availableCoupons = coupons.filter((coupon) => !coupon.isUsed)
  const unavailableCoupons = coupons.filter((coupon) => coupon.isUsed)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">쿠폰</h1>

          {/* 탭 전환 버튼 */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "available"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              사용 가능한 쿠폰
            </button>
            <button
              onClick={() => setActiveTab("unavailable")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "unavailable"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              사용 불가 쿠폰
            </button>
          </div>

          {/* 쿠폰 목록 */}
          <div>
            {activeTab === "available" && (
              <div>
                {availableCoupons.length > 0 ? (
                  availableCoupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-4" />
                      <div>
                        <h2 className="text-lg font-semibold">{coupon.title}</h2>
                        <p className="text-gray-600">{coupon.description}</p>
                        <p className="text-sm text-gray-500">유효기간: {coupon.validUntil}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      사용 가능한 쿠폰이 없습니다.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "unavailable" && (
              <div>
                {unavailableCoupons.length > 0 ? (
                  unavailableCoupons.map((coupon) => (
                    <div key={coupon.id} className="bg-gray-100 rounded-lg shadow-sm p-4 mb-4 flex items-start">
                      <XCircle className="w-6 h-6 text-red-500 mt-0.5 mr-4" />
                      <div>
                        <h2 className="text-lg font-semibold">{coupon.title}</h2>
                        <p className="text-gray-600">{coupon.description}</p>
                        <p className="text-sm text-gray-500">유효기간: {coupon.validUntil}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      사용 불가 쿠폰이 없습니다.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 art U. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

