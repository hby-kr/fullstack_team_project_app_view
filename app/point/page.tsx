"use client"

import React, {useState, useEffect} from "react"
import Header from "@/components/header"
import {CheckCircle, MinusCircle, AlertCircle, XCircle} from "lucide-react"

type Point = {
    id: string
    type: "earned" | "used" | "expired"
    amount: number
    description: string
    date: string
}

export default function PointsPage() {
    const [points, setPoints] = useState<Point[]>([])
    const [activeTab, setActiveTab] = useState<"all" | "earned" | "used" | "expired">("all")

    useEffect(() => {
        // 포인트 데이터 가져오기 (예제에서는 mock 데이터 사용)
        const mockPoints: Point[] = [
            {
                id: "point-1",
                type: "earned",
                amount: 5000,
                description: "공연 티켓 구매 적립 포인트",
                date: "2024-01-15",
            },
            {
                id: "point-2",
                type: "used",
                amount: 2000,
                description: "티켓 할인에 사용",
                date: "2024-02-10",
            },
            {
                id: "point-3",
                type: "expired",
                amount: 1500,
                description: "만료된 포인트",
                date: "2023-12-31",
            },
            {
                id: "point-4",
                type: "earned",
                amount: 3000,
                description: "리뷰 작성 보상 포인트",
                date: "2024-02-20",
            },
            {
                id: "point-5",
                type: "used",
                amount: 1000,
                description: "구매 시 사용",
                date: "2024-03-01",
            },
            {
                id: "point-6",
                type: "expired",
                amount: 1200,
                description: "사용하지 않아 만료됨",
                date: "2024-03-31",
            },
        ]

        setPoints(mockPoints)
    }, [])

    const filterPoints = (type: "all" | "earned" | "used" | "expired") => {
        if (type === "all") return points
        return points.filter((point) => point.type === type)
    }

    const filteredPoints = filterPoints(activeTab)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">포인트 내역</h1>

                    {/* 총합 포인트 */}
                    <div className="mb-6">
                        <span className="text-lg font-bold">총합 포인트: </span>
                        <span className="text-lg font-bold text-primary">
                            {points.reduce((total, point) => total + point.amount, 0).toLocaleString()}P
                        </span>
                    </div>

                    {/* 탭 전환 버튼 */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setActiveTab("earned")}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === "earned"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            적립
                        </button>
                        <button
                            onClick={() => setActiveTab("used")}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === "used"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            사용 완료
                        </button>
                        <button
                            onClick={() => setActiveTab("expired")}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === "expired"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            만료됨
                        </button>
                    </div>

                    {/* 포인트 목록 */}
                    <div>
                        {filteredPoints.length > 0 ? (
                            filteredPoints.map((point) => (
                                <div
                                    key={point.id}
                                    className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-start"
                                >
                                    {point.type === "earned" && (
                                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-4"/>
                                    )}
                                    {point.type === "used" && (
                                        <MinusCircle className="w-6 h-6 text-blue-500 mt-0.5 mr-4"/>
                                    )}
                                    {point.type === "expired" && (
                                        <XCircle className="w-6 h-6 text-red-500 mt-0.5 mr-4"/>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-semibold">{point.description}</h2>
                                        <p className="text-sm text-gray-600">포인트: {point.amount.toLocaleString()}점</p>
                                        <p className="text-xs text-gray-500">날짜: {point.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2"/>
                                    해당 항목에 포인트 내역이 없습니다.
                                </div>
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