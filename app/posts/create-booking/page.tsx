"use client"

import type React from "react"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {ArrowLeft, Upload, Tag, Calendar, MapPin, Clock, Ticket, Info} from "lucide-react"
import Header from "@/components/header"
import {useAuth} from "@/lib/auth-context"

export default function CreateBookingPostPage() {
    const router = useRouter()
    const {user, isLoading} = useAuth()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("음악")
    const [tags, setTags] = useState("")
    const [images, setImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 주차 정보 상태 추가
    const [parkingInfo, setParkingInfo] = useState({
        available: "unknown", // "yes", "no", "unknown"
        fee: "", // 주차 요금 입력
        notes: "", // 주차 메모 입력
    })

    // 예매 관련 추가 필드
    // eventDate와 eventTimes 상태를 eventSchedules로 대체
    const [eventSchedules, setEventSchedules] = useState<Array<{ date: string; times: string[] }>>([
        {date: "", times: [""]}, // 초기값: 빈 날짜와 빈 시간 하나
    ])
    const [location, setLocation] = useState("")
    const [ticketPrice, setTicketPrice] = useState({
        regular: "",
        vip: "",
        student: "",
        disabled: "", // 장애인
        veteran: "", // 국가유공자
        senior: "", // 경로석
    })
    const [totalSeats, setTotalSeats] = useState("")
    const [bookingLink, setBookingLink] = useState("")
    const [bookingStartDate, setBookingStartDate] = useState("")

    // 단체관람 할인 관련 상태 추가
    const [groupDiscount, setGroupDiscount] = useState({
        minPeople: "10", // 기본값 10명
        discountRate: "10", // 기본값 10%
    })

    // Redirect to login page if not logged in
    if (!isLoading && !user) {
        router.push("/login")
        return null
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newImages: string[] = []

        Array.from(files).forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    newImages.push(e.target.result as string)
                    if (newImages.length === files.length) {
                        setImages((prev) => [...prev, ...newImages])
                    }
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const post = {
            id: `booking-${Date.now()}`,
            title,
            content,
            category,
            tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            images,
            // @ts-ignore
            author: user.name,
            // @ts-ignore
            authorId: user.id,
            createdAt: new Date().toISOString(),
            type: "booking",
            eventSchedules,
            location,
            ticketPrice,
            groupDiscount,
            totalSeats: Number.parseInt(totalSeats) || 0,
            bookingLink,
            bookingStartDate,
            parkingInfo, // 주차 정보 추가
            bookable: true,
        }

        // handleSubmit 함수에서 eventDate와 eventTimes 대신 eventSchedules 사용
        if (
            !title.trim() ||
            !content.trim() ||
            eventSchedules.length === 0 ||
            !eventSchedules[0].date ||
            eventSchedules[0].times.length === 0 ||
            !eventSchedules[0].times[0] ||
            !location
        ) {
            alert("필수 항목을 모두 입력해주세요.")
            return
        }

        setIsSubmitting(true)

        try {
            // 실제 구현에서는 API 호출로 데이터를 저장합니다
            // 여기서는 간단히 로컬 스토리지에 저장하는 예시를 보여줍니다
            // post 객체에서 eventDate와 eventTimes 대신 eventSchedules 사용
            const post = {
                id: `booking-${Date.now()}`,
                title,
                content,
                category,
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                images,
                // @ts-ignore
                author: user.name,
                // @ts-ignore
                authorId: user.id,
                createdAt: new Date().toISOString(),
                type: "booking",
                eventSchedules, // 날짜와 시간 정보를 함께 저장
                location,
                ticketPrice,
                groupDiscount,
                totalSeats: Number.parseInt(totalSeats) || 0,
                bookingLink,
                bookingStartDate,
                bookable: true,
            }

            const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]")
            localStorage.setItem("posts", JSON.stringify([post, ...existingPosts]))

            alert("예매 게시물이 성공적으로 등록되었습니다.")
            router.push("/")
        } catch (error) {
            console.error("게시물 등록 실패:", error)
            alert("게시물 등록에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        <span>뒤로 가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">예매 게시물 작성</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        공연/전시 제목
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="공연/전시 제목을 입력하세요"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        카테고리
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="음악">음악</option>
                                        <option value="미술">미술</option>
                                        <option value="춤">춤</option>
                                        <option value="연기">연기</option>
                                        <option value="뮤지컬">뮤지컬</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>

                                {/* 날짜와 시간 입력 UI 부분을 다음으로 교체 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="w-4 h-4 inline mr-1"/>
                                        공연/전시 일정
                                    </label>

                                    <div className="space-y-6 border border-gray-200 rounded-md p-4">
                                        {eventSchedules.map((schedule, scheduleIndex) => (
                                            <div key={scheduleIndex} className="p-4 bg-gray-50 rounded-lg relative">
                                                {/* 날짜 입력 */}
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor={`eventDate-${scheduleIndex}`}
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        날짜
                                                    </label>
                                                    <input
                                                        id={`eventDate-${scheduleIndex}`}
                                                        type="date"
                                                        value={schedule.date}
                                                        onChange={(e) => {
                                                            const newSchedules = [...eventSchedules]
                                                            newSchedules[scheduleIndex].date = e.target.value
                                                            setEventSchedules(newSchedules)
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                        required
                                                    />
                                                </div>

                                                {/* 시간 입력 */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        <Clock className="w-4 h-4 inline mr-1"/>
                                                        시간 (여러 회차 추가 가능)
                                                    </label>
                                                    <div className="space-y-2">
                                                        {schedule.times.map((time, timeIndex) => (
                                                            <div key={timeIndex} className="flex items-center gap-2">
                                                                <input
                                                                    id={
                                                                        timeIndex === 0
                                                                            ? `eventTime-${scheduleIndex}`
                                                                            : `eventTime-${scheduleIndex}-${timeIndex}`
                                                                    }
                                                                    type="time"
                                                                    value={time}
                                                                    onChange={(e) => {
                                                                        const newSchedules = [...eventSchedules]
                                                                        newSchedules[scheduleIndex].times[timeIndex] = e.target.value
                                                                        setEventSchedules(newSchedules)
                                                                    }}
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                                    required={timeIndex === 0} // 첫 번째 시간은 필수
                                                                />
                                                                {schedule.times.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newSchedules = [...eventSchedules]
                                                                            newSchedules[scheduleIndex].times = newSchedules[scheduleIndex].times.filter(
                                                                                (_, i) => i !== timeIndex,
                                                                            )
                                                                            setEventSchedules(newSchedules)
                                                                        }}
                                                                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                                                        aria-label="시간 삭제"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-5 w-5"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSchedules = [...eventSchedules]
                                                                newSchedules[scheduleIndex].times.push("")
                                                                setEventSchedules(newSchedules)
                                                            }}
                                                            className="mt-2 flex items-center text-sm text-primary hover:text-primary-dark"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 mr-1"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            회차 추가
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* 일정 삭제 버튼 */}
                                                {eventSchedules.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEventSchedules(eventSchedules.filter((_, i) => i !== scheduleIndex))
                                                        }}
                                                        className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                                        aria-label="일정 삭제"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* 일정 추가 버튼 */}
                                        <button
                                            type="button"
                                            onClick={() => setEventSchedules([...eventSchedules, {
                                                date: "",
                                                times: [""]
                                            }])}
                                            className="mt-4 flex items-center justify-center w-full py-2 border border-dashed border-gray-300 rounded-md text-primary hover:bg-gray-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            새 일정 추가
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="w-4 h-4 inline mr-1"/>
                                        장소
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="예: 예술의전당 콘서트홀"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <Ticket className="w-4 h-4 inline mr-1"/>
                                        티켓 가격
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="regularPrice" className="block text-xs text-gray-500 mb-1">
                                                일반석
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="regularPrice"
                                                    type="number"
                                                    value={ticketPrice.regular}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        regular: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="vipPrice" className="block text-xs text-gray-500 mb-1">
                                                VIP석
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="vipPrice"
                                                    type="number"
                                                    value={ticketPrice.vip}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        vip: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="studentPrice" className="block text-xs text-gray-500 mb-1">
                                                학생
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="studentPrice"
                                                    type="number"
                                                    value={ticketPrice.student}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        student: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="disabledPrice" className="block text-xs text-gray-500 mb-1">
                                                장애인
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="disabledPrice"
                                                    type="number"
                                                    value={ticketPrice.disabled}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        disabled: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="veteranPrice" className="block text-xs text-gray-500 mb-1">
                                                국가유공자
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="veteranPrice"
                                                    type="number"
                                                    value={ticketPrice.veteran}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        veteran: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="seniorPrice" className="block text-xs text-gray-500 mb-1">
                                                경로석
                                            </label>
                                            <div className="flex">
                                                <input
                                                    id="seniorPrice"
                                                    type="number"
                                                    value={ticketPrice.senior}
                                                    onChange={(e) => setTicketPrice({
                                                        ...ticketPrice,
                                                        senior: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                                <span
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          원
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h4 className="text-sm font-medium mb-3">단체관람 할인</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="minPeople" className="block text-xs text-gray-500 mb-1">
                                                    최소 인원 수
                                                </label>
                                                <div className="flex">
                                                    <input
                                                        id="minPeople"
                                                        type="number"
                                                        value={groupDiscount.minPeople}
                                                        onChange={(e) => setGroupDiscount({
                                                            ...groupDiscount,
                                                            minPeople: e.target.value
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                        placeholder="10"
                                                        min="1"
                                                    />
                                                    <span
                                                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                            명 이상
                          </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="discountRate"
                                                       className="block text-xs text-gray-500 mb-1">
                                                    할인율
                                                </label>
                                                <div className="flex">
                                                    <input
                                                        id="discountRate"
                                                        type="number"
                                                        value={groupDiscount.discountRate}
                                                        onChange={(e) => setGroupDiscount({
                                                            ...groupDiscount,
                                                            discountRate: e.target.value
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                        placeholder="10"
                                                        min="0"
                                                        max="100"
                                                    />
                                                    <span
                                                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                            %
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="totalSeats"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            총 좌석 수
                                        </label>
                                        <input
                                            id="totalSeats"
                                            type="number"
                                            value={totalSeats}
                                            onChange={(e) => setTotalSeats(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bookingStartDate"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            예매 시작일
                                        </label>
                                        <input
                                            id="bookingStartDate"
                                            type="date"
                                            value={bookingStartDate}
                                            onChange={(e) => setBookingStartDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="bookingLink"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        외부 예매 링크 (선택사항)
                                    </label>
                                    <input
                                        id="bookingLink"
                                        type="url"
                                        value={bookingLink}
                                        onChange={(e) => setBookingLink(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="https://example.com/booking"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        외부 예매 사이트가 있는 경우 입력하세요. 없으면 art U 내에서 예매가 진행됩니다.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Info className="w-4 h-4 inline mr-1"/>
                                        공연/전시 상세 정보
                                    </label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="공연/전시에 대한 상세 정보를 입력하세요"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Tag className="w-4 h-4 inline mr-1"/>
                                        태그 (쉼표로 구분)
                                    </label>
                                    <input
                                        id="tags"
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="예: 클래식, 피아노, 공연"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">포스터 및 이미지
                                        업로드</label>
                                    <div
                                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                                                >
                                                    <span>이미지 파일 선택</span>
                                                    <input
                                                        id="image-upload"
                                                        name="image-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                                <p className="pl-1">또는 드래그 앤 드롭</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 inline mr-1"/>
                                        주차 정보
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="parkingAvailable"
                                                className="block text-xs text-gray-500 mb-1"
                                            >
                                                주차 가능 여부
                                            </label>
                                            <select
                                                id="parkingAvailable"
                                                value={parkingInfo.available}
                                                onChange={(e) => setParkingInfo({
                                                    ...parkingInfo,
                                                    available: e.target.value
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="yes">가능</option>
                                                <option value="no">불가능</option>
                                                <option value="unknown">모름</option>
                                            </select>
                                        </div>

                                        {parkingInfo.available === "yes" && (
                                            <>
                                                <div>
                                                    <label
                                                        htmlFor="parkingFee"
                                                        className="block text-xs text-gray-500 mb-1"
                                                    >
                                                        주차 요금 (1시간 기준)
                                                    </label>
                                                    <div className="flex">
                                                        <input
                                                            id="parkingFee"
                                                            type="number"
                                                            value={parkingInfo.fee}
                                                            onChange={(e) =>
                                                                setParkingInfo({
                                                                    ...parkingInfo,
                                                                    fee: e.target.value
                                                                })
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                            placeholder="0"
                                                            min="0"
                                                        />
                                                        <span
                                                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md"
                                                        >
                            원
                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="parkingNotes"
                                                        className="block text-xs text-gray-500 mb-1"
                                                    >
                                                        주차 공간 추가 정보
                                                    </label>
                                                    <input
                                                        id="parkingNotes"
                                                        type="text"
                                                        value={parkingInfo.notes}
                                                        onChange={(e) =>
                                                            setParkingInfo({
                                                                ...parkingInfo,
                                                                notes: e.target.value
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                        placeholder="예: 지하 1층, 3시간 무료 제공"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {images.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            업로드된 이미지 ({images.length})
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <div
                                                        className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                                        <Image
                                                            src={image || "/placeholder.svg"}
                                                            alt={`업로드 이미지 ${index + 1}`}
                                                            width={200}
                                                            height={200}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Link href="/"
                                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                        취소
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "등록 중..." : "예매 게시물 등록"}
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

