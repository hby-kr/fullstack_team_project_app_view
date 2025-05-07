"use client"

import {useState, useEffect} from "react"
import {Link, useParams} from "react-router"
// 기존 import 문 아래에 Star 아이콘 추가
import {ArrowLeft, Calendar, MapPin, Clock, Users, CreditCard, Ticket, ShoppingCart, Star} from "lucide-react"
import Header from "/src/components/header"
import {useAuth} from "/src/lib/auth-context"

export default function BookingPage() {
    const params = useParams()
    const {user} = useAuth()
    const [eventInfo, setEventInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [ticketCount, setTicketCount] = useState(1)
    // 티켓 타입 상태에 새로운 옵션 추가
    const [ticketType, setTicketType] = useState("regular")
    const [totalPrice, setTotalPrice] = useState(0)
    const [step, setStep] = useState(1) // 1: 날짜/시간 선택, 2: 좌석/티켓 선택, 3: 결제 정보
    // 결제 수단 상태 추가
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const encodedId = params.id;
                const id = decodeURIComponent(encodedId);
                const base = "http://localhost:4775/api/events";

                const resEvent = await fetch(`${base}/${id}`, {credentials: "include"});
                const event = await resEvent.json(); // ✅ 여기가 핵심

                const safeJson = async (res) => {
                    if (!res.ok) return [];
                    const text = await res.text();
                    if (!text) return [];
                    try {
                        return JSON.parse(text);
                    } catch (err) {
                        console.error("❌ JSON 파싱 오류:", err);
                        return [];
                    }
                };

                const dates = await safeJson(await fetch(`${base}/${id}/dates`, {credentials: "include"}));
                const options = dates.length > 0
                    ? await safeJson(await fetch(`${base}/dates/${dates[0].dateId}/options`, {credentials: "include"}))
                    : [];

                const images = await safeJson(await fetch(`${base}/${id}/images`, {credentials: "include"}));
                const reviewData = await safeJson(await fetch(`${base}/${id}/reviews`, {credentials: "include"}));
                const reviewImgs = await safeJson(await fetch(`${base}/${id}/review-images`, {credentials: "include"}));

                const reviewsWithImages = reviewData.map((review) => ({
                    id: review.reviewId,
                    userId: review.userId,
                    userName: review.userId,
                    rating: review.rate,
                    comment: review.contents,
                    date: review.createdAt?.substring(0, 10),
                    images: reviewImgs.filter((img) => img.reviewId === review.reviewId),
                }));

                setEventInfo({
                    id,
                    title: event.title,
                    category: event.ctgrId || "공연",
                    image: images[0]?.imgUrl || "/placeholder.svg",
                    description: event.memo || "공연 상세 설명이 없습니다.",
                    location: event.location,
                    dates: dates.map((d) => d.eventDate),
                    times: ["14:00", "19:30"],
                    price: {
                        regular: dates[0]?.eventPrice || 0,
                        vip: options.find((o) => o.optName.includes("VIP"))?.optPrice,
                        student: options.find((o) => o.optName.includes("학생"))?.optPrice,
                        disabled: options.find((o) => o.optName.includes("장애"))?.optPrice,
                        veteran: options.find((o) => o.optName.includes("유공자"))?.optPrice,
                        senior: options.find((o) => o.optName.includes("경로"))?.optPrice,
                    },
                    groupDiscount: options.length > 0 ? {
                        minPeople: options[0]?.goalMin || 10,
                        discountRate: options[0]?.dcRate || 10,
                    } : null,
                    availableSeats: 240,
                    reviews: reviewsWithImages,
                });

                setReviews(reviewsWithImages);
            } catch (err) {
                console.error("❌ useEffect 에러:", err);
                setEventInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventData();
    }, [params.id]);

    useEffect(() => {
        if (!eventInfo) return;

        const matchedDate = eventInfo.dates.find((d) => d === selectedDate);
        if (!matchedDate) return;

        let basePrice = eventInfo.price.regular;

        if (ticketType === "vip") basePrice = eventInfo.price.vip;
        else if (ticketType === "student") basePrice = eventInfo.price.student;
        else if (ticketType === "disabled") basePrice = eventInfo.price.disabled;
        else if (ticketType === "veteran") basePrice = eventInfo.price.veteran;
        else if (ticketType === "senior") basePrice = eventInfo.price.senior;

        if (!basePrice) basePrice = eventInfo.price.regular;

        let total = basePrice * ticketCount;

        if (ticketCount >= (eventInfo.groupDiscount?.minPeople || 999)) {
            total = total * (1 - (eventInfo.groupDiscount.discountRate / 100));
        }

        setTotalPrice(Math.floor(total));
    }, [selectedDate, selectedTime, ticketType, ticketCount, eventInfo]);


    // 다음 단계로 이동
    const goToNextStep = () => {
        if (step === 1 && (!selectedDate || !selectedTime)) {
            alert("날짜와 시간을 선택해주세요.");
            return;
        }

        if (step === 2) {
            // Step2에서 다음 누르면 PaymentPage로 이동
            const queryParams = new URLSearchParams({
                id: params.id,
                selectedDate,
                selectedTime,
                ticketType,
                ticketCount,
                totalPrice,
            }).toString();
            window.location.href = `/payment?${queryParams}`;
            return;
        }

        setStep(step + 1);
    };

    // 이전 단계로 이동
    const goToPrevStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    // 장바구니에 담기
    // const addToCart = () => {
    //     if (!eventInfo || !selectedDate || !selectedTime) return
    //
    //     // 장바구니에 담을 정보
    //     const cartItem = {
    //         id: eventInfo.id,
    //         title: eventInfo.title,
    //         date: selectedDate,
    //         time: selectedTime,
    //         ticketType: ticketType,
    //         ticketCount: ticketCount,
    //         price: totalPrice,
    //         image: eventInfo.image,
    //     }
    //
    //     // 로컬 스토리지에 장바구니 정보 저장 (실제로는 서버에 저장할 수 있음)
    //     const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
    //     cartItems.push(cartItem)
    //     localStorage.setItem("cartItems", JSON.stringify(cartItems))
    //
    //     alert("장바구니에 담았습니다.")
    // }

    // 날짜를 YYYY-MM-DD 형식으로 포맷
    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        });
    }

    // 가격을 원화 형식으로 변환
    function formatPrice(price) {
        if (!price || isNaN(price)) return "0";
        return new Intl.NumberFormat("ko-KR").format(price);
    }


    if (isLoading) {
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

    if (!eventInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-xl font-semibold mb-4">공연 정보를 찾을 수 없습니다</p>
                    <Link to="/" className="text-primary hover:underline">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        <span>뒤로 가기</span>
                    </Link>

                    {/* Event header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                <div className="aspect-[3/4] overflow-hidden rounded-lg border border-gray-200">
                                    <img
                                        src={eventInfo.image || "/placeholder.svg"}
                                        alt={eventInfo.title}
                                        width={300}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-2/3">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-2">
                  {eventInfo.category}
                </span>
                                <h1 className="text-2xl font-bold mb-4">{eventInfo?.title || "공연 정보 로딩 중..."}</h1>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start">
                                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3"/>
                                        <div>
                                            <p className="font-medium">공연 기간</p>
                                            <p className="text-gray-600">
                                                {formatDate(eventInfo.dates[0])} ~ {formatDate(eventInfo.dates[eventInfo.dates.length - 1])}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3"/>
                                        <div>
                                            <p className="font-medium">공연 장소</p>
                                            <p className="text-gray-600">{eventInfo.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3"/>
                                        <div>
                                            <p className="font-medium">공연 시간</p>
                                            <p className="text-gray-600">{eventInfo.times.join(", ")}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Ticket className="w-5 h-5 text-gray-500 mt-0.5 mr-3"/>
                                        <div>
                                            <p className="font-medium">티켓 가격</p>
                                            <p className="text-gray-600">
                                                {eventInfo.price.vip && `VIP석: ${formatPrice(eventInfo.price.vip)}원 / `}
                                                일반석: {formatPrice(eventInfo.price.regular)}원
                                                {eventInfo.price.student && ` / 학생: ${formatPrice(eventInfo.price.student)}원`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{eventInfo.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking process */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        {/* Progress steps */}
                        <div className="flex items-center justify-between mb-8">
                            <div
                                className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
                                >
                                    1
                                </div>
                                <span className="text-xs">날짜/시간 선택</span>
                            </div>
                            <div
                                className={`flex-grow border-t ${step >= 2 ? "border-primary" : "border-gray-200"} mx-4`}></div>
                            <div
                                className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
                                >
                                    2
                                </div>
                                <span className="text-xs">좌석/티켓 선택</span>
                            </div>
                            <div
                                className={`flex-grow border-t ${step >= 3 ? "border-primary" : "border-gray-200"} mx-4`}></div>
                            <div
                                className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
                                >
                                    3
                                </div>
                                <span className="text-xs">결제 정보</span>
                            </div>
                        </div>

                        {/* Step 1: Date and time selection */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">날짜 및 시간 선택</h2>

                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">날짜 선택</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {eventInfo.dates.map((date) => (
                                            <button
                                                key={date || index}
                                                className={`p-3 border rounded-lg text-center ${
                                                    selectedDate === date
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setSelectedDate(date)}
                                            >
                                                <p className="font-medium">{formatDate(date)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">시간 선택</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {eventInfo.times.map((time) => (
                                            <button
                                                key={time}
                                                className={`p-3 border rounded-lg text-center ${
                                                    selectedTime === time
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                <p className="font-medium">{time}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Seat and ticket selection */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">좌석 및 티켓 선택</h2>

                                {/* 좌석 등급 선택 UI 부분 수정 */}
                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">좌석 등급</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                        {eventInfo.price.vip && (
                                            <button
                                                className={`p-3 border rounded-lg ${
                                                    ticketType === "vip"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setTicketType("vip")}
                                            >
                                                <p className="font-medium">VIP석</p>
                                                <p className="text-sm">{formatPrice(eventInfo.price.vip)}원</p>
                                            </button>
                                        )}
                                        <button
                                            className={`p-3 border rounded-lg ${
                                                ticketType === "regular"
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setTicketType("regular")}
                                        >
                                            <p className="font-medium">일반석</p>
                                            <p className="text-sm">{formatPrice(eventInfo.price.regular)}원</p>
                                        </button>
                                        {eventInfo.price.student && (
                                            <button
                                                className={`p-3 border rounded-lg ${
                                                    ticketType === "student"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setTicketType("student")}
                                            >
                                                <p className="font-medium">학생</p>
                                                <p className="text-sm">{formatPrice(eventInfo.price.student)}원</p>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {eventInfo.price.disabled && (
                                            <button
                                                className={`p-3 border rounded-lg ${
                                                    ticketType === "disabled"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setTicketType("disabled")}
                                            >
                                                <p className="font-medium">장애인</p>
                                                <p className="text-sm">{formatPrice(eventInfo.price.disabled)}원</p>
                                            </button>
                                        )}
                                        {eventInfo.price.veteran && (
                                            <button
                                                className={`p-3 border rounded-lg ${
                                                    ticketType === "veteran"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setTicketType("veteran")}
                                            >
                                                <p className="font-medium">국가유공자</p>
                                                <p className="text-sm">{formatPrice(eventInfo.price.veteran)}원</p>
                                            </button>
                                        )}
                                        {eventInfo.price.senior && (
                                            <button
                                                className={`p-3 border rounded-lg ${
                                                    ticketType === "senior"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setTicketType("senior")}
                                            >
                                                <p className="font-medium">경로석</p>
                                                <p className="text-sm">{formatPrice(eventInfo.price.senior)}원</p>
                                            </button>
                                        )}
                                    </div>

                                    {eventInfo.groupDiscount && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-700">
                                                <strong>단체관람 할인:</strong> {eventInfo.groupDiscount.minPeople}명 이상 예매
                                                시{" "}
                                                {eventInfo.groupDiscount.discountRate}% 할인
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">티켓 수량</h3>
                                    <div className="flex items-center border rounded-lg w-32">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                        >
                                            -
                                        </button>
                                        <div className="flex-grow text-center">{ticketCount}</div>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setTicketCount(Math.min(4, ticketCount + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">* 1인당 최대 4매까지 구매 가능합니다.</p>
                                </div>

                                {/* 선택 정보 표시 부분 수정 */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">선택 정보</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(selectedDate)} {selectedTime} /{" "}
                                                {ticketType === "vip"
                                                    ? "VIP석"
                                                    : ticketType === "student"
                                                        ? "학생"
                                                        : ticketType === "disabled"
                                                            ? "장애인"
                                                            : ticketType === "veteran"
                                                                ? "국가유공자"
                                                                : ticketType === "senior"
                                                                    ? "경로석"
                                                                    : "일반석"}{" "}
                                                {ticketCount}매
                                                {ticketCount >= (eventInfo.groupDiscount?.minPeople || 10) && (
                                                    <span className="ml-2 text-blue-600 font-medium">
                            (단체할인 {eventInfo.groupDiscount?.discountRate || 10}% 적용)
                          </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">총 결제 금액</p>
                                            <p className="text-xl font-bold text-primary">{formatPrice(totalPrice)}원</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment information */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">결제 정보</h2>

                                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                                    <h3 className="font-medium mb-2">예매 정보</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">공연명</span>
                                            <span>{eventInfo.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">공연 일시</span>
                                            <span>
                        {formatDate(selectedDate)} {selectedTime}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">공연 장소</span>
                                            <span>{eventInfo.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">좌석 등급</span>
                                            <span>{ticketType === "vip" ? "VIP석" : ticketType === "student" ? "학생" : "일반석"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">티켓 수량</span>
                                            <span>{ticketCount}매</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">예매자 정보</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name"
                                                   className="block text-sm font-medium text-gray-700 mb-1">
                                                이름
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                defaultValue={user?.name || ""}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone"
                                                   className="block text-sm font-medium text-gray-700 mb-1">
                                                연락처
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="010-0000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email"
                                                   className="block text-sm font-medium text-gray-700 mb-1">
                                                이메일
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                defaultValue={user?.email || ""}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3">결제 수단</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <button
                                            className={`p-3 border rounded-lg text-center ${
                                                paymentMethod === "card"
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setPaymentMethod("card")}
                                        >
                                            <CreditCard className="w-5 h-5 mx-auto mb-1"/>
                                            <p className="text-sm">신용카드</p>
                                        </button>
                                        <button
                                            className={`p-3 border rounded-lg text-center ${
                                                paymentMethod === "simple"
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setPaymentMethod("simple")}
                                        >
                                            <Users className="w-5 h-5 mx-auto mb-1"/>
                                            <p className="text-sm">간편결제</p>
                                        </button>
                                        <button
                                            className={`p-3 border rounded-lg text-center ${
                                                paymentMethod === "bank"
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setPaymentMethod("bank")}
                                        >
                                            <p className="text-sm">무통장입금</p>
                                        </button>
                                        <button
                                            className={`p-3 border rounded-lg text-center ${
                                                paymentMethod === "mobile"
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setPaymentMethod("mobile")}
                                        >
                                            <p className="text-sm">휴대폰결제</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">최종 결제 금액</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}원</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-medium mb-3">개인정보 확인 및 동의</h3>
                                    <div className="space-y-3">
                                        {/* 모두 동의 체크박스 추가 */}
                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="agree-all"
                                                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                onChange={(e) => {
                                                    // 모든 체크박스를 동일한 상태로 변경
                                                    const checkboxes = document.querySelectorAll(
                                                        'input[type="checkbox"][id^="agree"], input[type="checkbox"][id="confirm-info"]',
                                                    )
                                                    checkboxes.forEach((checkbox) => {
                                                        checkbox.checked = e.target.checked
                                                    })
                                                }}
                                            />
                                            <label htmlFor="agree-all"
                                                   className="ml-2 block text-sm font-medium text-gray-700">
                                                모두 동의합니다
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="confirm-info"
                                                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <label htmlFor="confirm-info" className="ml-2 block text-sm text-gray-700">
                                                위 예매자 정보를 확인하였으며, 정확히 입력하였음을 확인합니다.
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="agree-terms"
                                                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                                                <span className="font-medium">이용약관</span> 및{" "}
                                                <span className="font-medium">개인정보 처리방침</span>에 동의합니다.
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="agree-refund"
                                                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <label htmlFor="agree-refund" className="ml-2 block text-sm text-gray-700">
                                                <span className="font-medium">환불 규정</span>을 확인하였으며 이에 동의합니다.
                                                <p className="text-xs text-gray-500 mt-1">
                                                    공연 3일 전까지: 전액 환불 / 공연 1일 전까지: 50% 환불 / 공연 당일: 환불 불가
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-8">
                            {step > 1 ? (
                                <button
                                    onClick={goToPrevStep}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    이전
                                </button>
                            ) : (
                                <div></div>
                            )}

                            <div className="flex space-x-3">
                                {step === 3 && (
                                    <button
                                        onClick={addToCart}
                                        className="flex items-center px-6 py-2 border border-primary rounded-md text-primary hover:bg-primary/5"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2"/>
                                        담기
                                    </button>
                                )}
                                <button
                                    onClick={goToNextStep}
                                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                >
                                    {step === 3 ? "결제하기" : "다음"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 리뷰 섹션 - 예매 프로세스 중에는 표시하지 않음 */}
                    {step === 1 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">관람객 리뷰</h2>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${
                                                    (eventInfo.reviews?.reduce((acc, review) => acc + review.rating, 0) || 0) /
                                                    (eventInfo.reviews?.length || 1) >=
                                                    star
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium">
                    {eventInfo.reviews
                        ? (
                            eventInfo.reviews.reduce((acc, review) => acc + review.rating, 0) / eventInfo.reviews.length
                        ).toFixed(1)
                        : "0.0"}
                  </span>
                                    <span className="text-gray-500 ml-1">({eventInfo.reviews?.length || 0})</span>
                                </div>
                            </div>

                            {/* 리뷰 작성 버튼 */}
                            <div className="mb-6">
                                {user ? (
                                    <Link
                                        to={`/booking/${encodeURIComponent(eventInfo.id)}/review`}
                                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                    >
                                        <Star className="w-4 h-4 mr-2"/>
                                        리뷰 작성하기
                                    </Link>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">
                                            리뷰를 작성하려면{" "}
                                            <Link to="/login" className="text-primary hover:underline">
                                                로그인
                                            </Link>
                                            이 필요합니다.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 리뷰 목록 */}
                            {reviews && reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id || review.comment || Math.random()} className="border-b pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <div className="flex mr-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${
                                                                        review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="font-medium text-sm">{review.userName}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{review.date}</p>
                                                </div>

                                                {/* 리뷰 작성자인 경우 수정/삭제 버튼 표시 */}
                                                {user && review.userId === user.id && (
                                                    <div className="flex space-x-2 mt-2">
                                                        <Link
                                                            to={`/booking/${params.id}/review?edit=true&reviewId=${review.id}`}
                                                            className="text-xs text-blue-600 hover:underline"
                                                        >
                                                            수정
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
                                                                    // 리뷰 삭제 로직
                                                                    const updatedReviews = reviews.filter((r) => r.id !== review.id)
                                                                    localStorage.setItem(`reviews-${params.id}`, JSON.stringify(updatedReviews))
                                                                    setReviews(updatedReviews)
                                                                    alert("리뷰가 삭제되었습니다.")
                                                                }
                                                            }}
                                                            className="text-xs text-red-600 hover:underline"
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-2 text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                                </div>
                            )}
                        </div>
                    )}
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

