"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import {Link, useNavigate} from "react-router"
import { ArrowLeft, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Header from "/src/components/header";
import { useAuth } from "/src/lib/auth-context";

export default function PostsCreateBookingPostPage() {
  //const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("음악");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Parking info state
  const [parkingInfo, setParkingInfo] = useState({
    available: "unknown", // "yes", "no", "unknown"
    fee: "", // parking fee input
    notes: "", // parking notes
  });

  // Event schedules
  const [eventSchedules, setEventSchedules] = useState([{ date: "", times: [""] }]);

  const [location, setLocation] = useState("");
  const [ticketPrice, setTicketPrice] = useState({
    regular: "",
    vip: "",
    student: "",
    disabled: "", // Disabled price
    veteran: "", // Veteran price
    senior: "", // Senior price
  });
  const [totalSeats, setTotalSeats] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");

  const [groupDiscount, setGroupDiscount] = useState({
    minPeople: "10", // default 10 people
    discountRate: "10", // default 10%
  });

  if (!isLoading && !user) {
    navigate("/login");
    return null;
  }

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      id: `booking-${Date.now()}`,
      title,
      content,
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      images,
      author: user.name,
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
      parkingInfo, // added parking info
      bookable: true,
    };

    if (
      !title.trim() ||
      !content.trim() ||
      eventSchedules.length === 0 ||
      !eventSchedules[0].date ||
      eventSchedules[0].times.length === 0 ||
      !eventSchedules[0].times[0] ||
      !location
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      localStorage.setItem("posts", JSON.stringify([post, ...existingPosts]));

      alert("예매 게시물이 성공적으로 등록되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("게시물 등록 실패:", error);
      alert("게시물 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    공연/전시 일정
                  </label>

                  <div className="space-y-6 border border-gray-200 rounded-md p-4">
                    {eventSchedules.map((schedule, scheduleIndex) => (
                      <div key={scheduleIndex} className="p-4 bg-gray-50 rounded-lg relative">
                        {/* Date input */}
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
                              const newSchedules = [...eventSchedules];
                              newSchedules[scheduleIndex].date = e.target.value;
                              setEventSchedules(newSchedules);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>

                        {/* Time input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Clock className="w-4 h-4 inline mr-1" />
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
                                    const newSchedules = [...eventSchedules];
                                    newSchedules[scheduleIndex].times[timeIndex] = e.target.value;
                                    setEventSchedules(newSchedules);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                  required={timeIndex === 0} // First time is mandatory
                                />
                                {schedule.times.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSchedules = [...eventSchedules];
                                      newSchedules[scheduleIndex].times = newSchedules[scheduleIndex].times.filter(
                                        (_, i) => i !== timeIndex
                                      );
                                      setEventSchedules(newSchedules);
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
                                const newSchedules = [...eventSchedules];
                                newSchedules[scheduleIndex].times.push("");
                                setEventSchedules(newSchedules);
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

                        {/* Schedule delete button */}
                        {eventSchedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEventSchedules(eventSchedules.filter((_, i) => i !== scheduleIndex));
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
                    {/* Add Before schedule button */}
                    <button
                      type="button"
                      onClick={() =>
                        setEventSchedules([
                          ...eventSchedules,
                          {
                            date: "",
                            times: [""],
                          },
                        ])
                      }
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
                    <MapPin className="w-4 h-4 inline mr-1" />
                    장소
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="공연/전시 장소를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    <Ticket className="w-4 h-4 inline mr-1" />
                    티켓 가격
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="일반"
                      value={ticketPrice.regular}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, regular: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="VIP"
                      value={ticketPrice.vip}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, vip: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="학생"
                      value={ticketPrice.student}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, student: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="장애인"
                      value={ticketPrice.disabled}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, disabled: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="군인"
                      value={ticketPrice.veteran}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, veteran: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="노인"
                      value={ticketPrice.senior}
                      onChange={(e) => setTicketPrice({ ...ticketPrice, senior: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-1">
                    총 좌석 수
                  </label>
                  <input
                    id="totalSeats"
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="총 좌석 수를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bookingLink" className="block text-sm font-medium text-gray-700 mb-1">
                    예매 링크
                  </label>
                  <input
                    id="bookingLink"
                    type="url"
                    value={bookingLink}
                    onChange={(e) => setBookingLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="예매 링크를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bookingStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                    예매 시작일
                  </label>
                  <input
                    id="bookingStartDate"
                    type="date"
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Parking information */}
                <div>
                  <label htmlFor="parkingInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    주차 정보
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        주차 여부
                      </label>
                      <select
                        value={parkingInfo.available}
                        onChange={(e) =>
                          setParkingInfo({ ...parkingInfo, available: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="yes">가능</option>
                        <option value="no">불가</option>
                        <option value="unknown">미정</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">주차 요금</label>
                      <input
                        type="text"
                        value={parkingInfo.fee}
                        onChange={(e) => setParkingInfo({ ...parkingInfo, fee: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="주차 요금을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">주차 비고</label>
                      <input
                        type="text"
                        value={parkingInfo.notes}
                        onChange={(e) => setParkingInfo({ ...parkingInfo, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="주차 비고를 입력하세요"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`w-full px-6 py-3 text-white bg-primary rounded-lg font-semibold disabled:bg-gray-300`}
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
  );
}
