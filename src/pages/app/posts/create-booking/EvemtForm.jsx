import {useState} from "react";
import {MapPin} from "lucide-react";

export default function EventForm() {
    const [ticketPrice, setTicketPrice] = useState({
        disabled: '',
        veteran: '',
        senior: '',
    });
    const [groupDiscount, setGroupDiscount] = useState({
        minPeople: '',
        discountRate: '',
    });
    const [totalSeats, setTotalSeats] = useState('');
    const [bookingStartDate, setBookingStartDate] = useState('');
    const [bookingLink, setBookingLink] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [images, setImages] = useState([]);
    const [parkingInfo, setParkingInfo] = useState({
        available: 'unknown',
        fee: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e) => {
        const files = e.target.files;
        const newImages = [...images];
        for (let i = 0; i < files.length; i++) {
            newImages.push(URL.createObjectURL(files[i]));
        }
        setImages(newImages);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Handle form submission here
    };

    return (
        <div>
            <main>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Disabled Price */}
                            <div>
                                <label htmlFor="disabledPrice" className="block text-xs text-gray-500 mb-1">
                                    장애인
                                </label>
                                <div className="flex">
                                    <input
                                        id="disabledPrice"
                                        type="number"
                                        value={ticketPrice.disabled}
                                        onChange={(e) =>
                                            setTicketPrice({
                                                ...ticketPrice,
                                                disabled: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                    원
                  </span>
                                </div>
                            </div>

                            {/* Veteran Price */}
                            <div>
                                <label htmlFor="veteranPrice" className="block text-xs text-gray-500 mb-1">
                                    국가유공자
                                </label>
                                <div className="flex">
                                    <input
                                        id="veteranPrice"
                                        type="number"
                                        value={ticketPrice.veteran}
                                        onChange={(e) =>
                                            setTicketPrice({
                                                ...ticketPrice,
                                                veteran: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                    원
                  </span>
                                </div>
                            </div>

                            {/* Senior Price */}
                            <div>
                                <label htmlFor="seniorPrice" className="block text-xs text-gray-500 mb-1">
                                    경로석
                                </label>
                                <div className="flex">
                                    <input
                                        id="seniorPrice"
                                        type="number"
                                        value={ticketPrice.senior}
                                        onChange={(e) =>
                                            setTicketPrice({
                                                ...ticketPrice,
                                                senior: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                    원
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Group Discount */}
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
                                            onChange={(e) =>
                                                setGroupDiscount({
                                                    ...groupDiscount,
                                                    minPeople: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="10"
                                            min="1"
                                        />
                                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                      명 이상
                    </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="discountRate" className="block text-xs text-gray-500 mb-1">
                                        할인율
                                    </label>
                                    <div className="flex">
                                        <input
                                            id="discountRate"
                                            type="number"
                                            value={groupDiscount.discountRate}
                                            onChange={(e) =>
                                                setGroupDiscount({
                                                    ...groupDiscount,
                                                    discountRate: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="10"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                      %
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Seats and Booking Start Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="0"
                                    min="0"
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
                                />
                            </div>
                        </div>

                        {/* Booking Link */}
                        <div>
                            <label htmlFor="bookingLink" className="block text-sm font-medium text-gray-700 mb-1">
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

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                <Info className="w-4 h-4 inline mr-1" />
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

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                <Tag className="w-4 h-4 inline mr-1" />
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

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">포스터 및 이미지 업로드</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
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

                        {/* Parking Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                주차 정보
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="parkingAvailable" className="block text-xs text-gray-500 mb-1">
                                        주차 가능 여부
                                    </label>
                                    <select
                                        id="parkingAvailable"
                                        value={parkingInfo.available}
                                        onChange={(e) =>
                                            setParkingInfo({
                                                ...parkingInfo,
                                                available: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="yes">가능</option>
                                        <option value="no">불가능</option>
                                        <option value="unknown">확인 불가</option>
                                    </select>
                                </div>

                                {parkingInfo.available === 'yes' && (
                                    <div>
                                        <label htmlFor="parkingFee" className="block text-xs text-gray-500 mb-1">
                                            주차 요금
                                        </label>
                                        <input
                                            id="parkingFee"
                                            type="text"
                                            value={parkingInfo.fee}
                                            onChange={(e) =>
                                                setParkingInfo({
                                                    ...parkingInfo,
                                                    fee: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="예: 1시간당 5000원"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="parkingNotes" className="block text-xs text-gray-500 mb-1">
                                        주차 관련 주의사항
                                    </label>
                                    <textarea
                                        id="parkingNotes"
                                        value={parkingInfo.notes}
                                        onChange={(e) =>
                                            setParkingInfo({
                                                ...parkingInfo,
                                                notes: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="주차 관련 추가 사항을 입력하세요."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className={`w-full px-6 py-3 text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '등록 중...' : '등록하기'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

