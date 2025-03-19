"use client"

import type React from "react"

import {useState, useEffect} from "react"
import {useParams, useRouter} from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {ArrowLeft, Star, AlertCircle} from "lucide-react"
import Header from "@/components/header"
import {useAuth} from "@/lib/auth-context"

export default function ReviewPage() {
    const params = useParams()
    const router = useRouter()
    const {user, isLoading} = useAuth()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [eventInfo, setEventInfo] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [hasPurchased, setHasPurchased] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [reviewId, setReviewId] = useState<string | null>(null)

    useEffect(() => {
        // 로그인 확인
        if (!isLoading && !user) {
            router.push("/login")
            return
        }

        // 이벤트 정보 가져오기
        const encodedId = params.id as string
        const id = decodeURIComponent(encodedId)

        // URL에서 edit 모드와 리뷰 ID 확인
        const urlParams = new URLSearchParams(window.location.search)
        const editMode = urlParams.get("edit")
        const reviewIdParam = urlParams.get("reviewId")

        if (editMode === "true" && reviewIdParam) {
            setIsEditMode(true)
            setReviewId(reviewIdParam)

            // 기존 리뷰 데이터 로드 (실제로는 API 호출)
            // 여기서는 로컬 스토리지에서 가져오는 예시
            const eventId = params.id as string
            const existingReviews = JSON.parse(localStorage.getItem(`reviews-${eventId}`) || "[]")
            const existingReview = existingReviews.find((review: any) => review.id === reviewIdParam)

            if (existingReview) {
                setRating(existingReview.rating)
                setComment(existingReview.comment)
            } else {
                // 리뷰를 찾을 수 없는 경우
                alert("수정할 리뷰를 찾을 수 없습니다.")
                router.push(`/booking/${encodedId}`)
            }
        }

        // ID에서 카테고리와 번호 추출
        const parts = id.split("-")
        const category = parts[0]
        const itemNumber = parts[1] || "1"

        // 가짜 이벤트 정보 생성
        const mockEventInfo = {
            id: id,
            title: `${decodeURIComponent(category)} 공연 ${itemNumber}`,
            category: decodeURIComponent(category),
            image: `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(category)}-${itemNumber}`,
            description: `이것은 ${decodeURIComponent(category)} 관련 공연에 대한 상세 설명입니다.`,
            location: "예술의전당 한가람아트센터",
        }

        setEventInfo(mockEventInfo)

        // 구매 여부 확인 (실제로는 API 호출로 확인)
        // 여기서는 로컬 스토리지에서 장바구니 아이템을 확인하는 방식으로 구현
        const checkPurchaseStatus = () => {
            // 실제 구현에서는 서버에서 구매 내역을 확인해야 함
            // 여기서는 데모를 위해 로컬 스토리지의 장바구니 아이템을 확인
            const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
            const hasBought = cartItems.some((item: any) => item.id === id)

            // 데모 목적으로 50% 확률로 구매했다고 가정
            const randomPurchase = Math.random() > 0.5

            setHasPurchased(hasBought || randomPurchase)
        }

        checkPurchaseStatus()
    }, [params.id, router, user, isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            setError("별점을 선택해주세요.")
            return
        }

        if (!comment.trim()) {
            setError("리뷰 내용을 입력해주세요.")
            return
        }

        if (!hasPurchased && !isEditMode) {
            setError("이 공연/전시를 구매한 사용자만 리뷰를 작성할 수 있습니다.")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            // 실제 구현에서는 API 호출로 리뷰를 저장
            // 여기서는 간단히 로컬 스토리지에 저장하는 예시
            const eventId = params.id as string
            const existingReviews = JSON.parse(localStorage.getItem(`reviews-${eventId}`) || "[]")

            if (isEditMode && reviewId) {
                // 리뷰 수정 로직
                const updatedReviews = existingReviews.map((review: any) => {
                    if (review.id === reviewId) {
                        return {
                            ...review,
                            rating,
                            comment,
                            date: new Date().toISOString().split("T")[0], // 수정 날짜 업데이트
                        }
                    }
                    return review
                })

                localStorage.setItem(`reviews-${eventId}`, JSON.stringify(updatedReviews))
                alert("리뷰가 성공적으로 수정되었습니다.")
            } else {
                // 새 리뷰 작성 로직
                const newReview = {
                    id: `review-${Date.now()}`,
                    userId: user?.id,
                    userName: user?.name,
                    rating,
                    comment,
                    date: new Date().toISOString().split("T")[0],
                }

                localStorage.setItem(`reviews-${eventId}`, JSON.stringify([...existingReviews, newReview]))
                alert("리뷰가 성공적으로 등록되었습니다.")
            }

            router.push(`/booking/${encodeURIComponent(params.id as string)}`)
        } catch (error) {
            console.error("리뷰 등록 실패:", error)
            setError("리뷰 등록에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading || !eventInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href={`/booking/${encodeURIComponent(params.id as string)}`}
                        className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        <span>공연 상세 페이지로 돌아가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h1>

                        <div className="flex items-center mb-6">
                            <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={eventInfo.image || "/placeholder.svg"}
                                    alt={eventInfo.title}
                                    width={96}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold">{eventInfo.title}</h2>
                                <p className="text-gray-600">{eventInfo.location}</p>
                            </div>
                        </div>

                        {!hasPurchased && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2"/>
                                    <div>
                                        <h3 className="font-medium text-yellow-700">구매 확인 필요</h3>
                                        <p className="text-yellow-600 text-sm">
                                            이 공연/전시를 구매한 사용자만 리뷰를 작성할 수 있습니다.
                                            <br/>
                                            <span className="text-xs">(데모 목적으로 이 메시지가 표시되더라도 리뷰 작성은 가능합니다.)</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${
                                                        (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span
                                            className="ml-2 text-gray-600">{rating > 0 ? `${rating}점` : "별점을 선택하세요"}</span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        리뷰 내용
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="공연/전시에 대한 솔직한 리뷰를 작성해주세요."
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Link
                                        href={`/booking/${encodeURIComponent(params.id as string)}`}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        취소
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "처리 중..." : isEditMode ? "리뷰 수정" : "리뷰 등록"}
                                    </button>
                                </div>
                            </div>
                        </form>
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

