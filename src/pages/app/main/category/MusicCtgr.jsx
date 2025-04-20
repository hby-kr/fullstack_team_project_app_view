import {Link} from "react-router"

// 모든 이벤트 데이터 (실제로는 데이터베이스에서 가져올 것)
const allEvents = [
    // 음악 이벤트
    {
        id: "e1",
        title: "클래식 콘서트: 모차르트 스페셜",
        category: "음악",
        date: "2024-05-15",
        time: "19:30",
        venue: "예술의전당",
        address: "서울특별시 서초구 남부순환로 2406",
        image: "/placeholder.svg?height=500&width=800&text=Mozart+Concert",
        description:
            "모차르트의 대표 작품들을 한자리에서 감상할 수 있는 특별한 콘서트입니다. 교향곡, 협주곡, 오페라 아리아 등 다양한 장르의 작품을 선보입니다.",
        performers: ["서울시립교향악단", "지휘자: 정명훈", "피아노: 조성진"],
        price: "50,000원 ~ 150,000원",
    },
    {
        id: "e6",
        title: "재즈 나이트",
        category: "음악",
        date: "2024-07-05",
        time: "20:00",
        venue: "롤링홀",
        address: "서울특별시 마포구 어울마당로 35",
        image: "/placeholder.svg?height=500&width=800&text=Jazz+Night",
        description:
            "다양한 재즈 아티스트들의 공연을 즐길 수 있는 특별한 밤입니다. 클래식 재즈부터 현대 재즈까지 다양한 스타일의 음악을 만나보세요.",
        performers: ["재즈 트리오 '블루노트'", "싱어송라이터 '재즈캣'", "색소폰 연주자 '재즈맨'"],
        price: "30,000원",
    },

    // 미술 이벤트
    {
        id: "e2",
        title: "현대 미술 전시회",
        category: "미술",
        date: "2024-04-20 ~ 2024-06-30",
        time: "10:00 ~ 18:00",
        venue: "국립현대미술관",
        address: "서울특별시 종로구 삼청로 30",
        image: "/placeholder.svg?height=500&width=800&text=Modern+Art",
        description:
            "현대 미술의 다양한 작품들을 만나볼 수 있는 특별 전시회입니다. 국내외 유명 작가들의 회화, 조각, 설치 작품 등이 전시됩니다.",
        artists: ["김홍도", "이중섭", "백남준", "데미안 허스트"],
        price: "12,000원",
    },

    // 뮤지컬 이벤트
    {
        id: "e3",
        title: "뮤지컬 '레미제라블'",
        category: "뮤지컬",
        date: "2024-06-10 ~ 2024-08-31",
        time: "평일 19:30, 주말 14:00, 19:00",
        venue: "블루스퀘어",
        address: "서울특별시 용산구 이태원로 294",
        image: "/placeholder.svg?height=500&width=800&text=Les+Miserables",
        description:
            "세계적인 명작 뮤지컬 '레미제라블'의 한국 공연입니다. 빅토르 위고의 소설을 원작으로 한 이 작품은 19세기 프랑스를 배경으로 장발장의 이야기를 그립니다.",
        cast: ["장발장 역: 김준수/박은태", "자베르 역: 양준모/최재림", "코제트 역: 전나영/이지혜"],
        price: "70,000원 ~ 170,000원",
    },

    // 춤 이벤트
    {
        id: "e4",
        title: "현대무용 페스티벌",
        category: "춤",
        date: "2024-04-10 ~ 2024-04-15",
        time: "19:00",
        venue: "국립극장",
        address: "서울특별시 중구 장충단로 59",
        image: "/placeholder.svg?height=500&width=800&text=Dance+Festival",
        description:
            "국내외 유명 무용가들이 참여하는 현대무용 페스티벌입니다. 다양한 스타일의 현대무용을 한자리에서 감상할 수 있는 기회입니다.",
        performers: ["국립현대무용단", "네덜란드 댄스 시어터", "한국 현대무용 콜렉티브"],
        price: "40,000원 ~ 80,000원",
    },

    // 연기 이벤트
    {
        id: "e5",
        title: "연극 '햄릿'",
        category: "연기",
        date: "2024-07-15 ~ 2024-08-15",
        time: "평일 19:30, 주말 15:00, 19:00",
        venue: "예술의전당",
        address: "서울특별시 서초구 남부순환로 2406",
        image: "/placeholder.svg?height=500&width=800&text=Hamlet",
        description:
            "셰익스피어의 명작 '햄릿'을 현대적으로 재해석한 연극입니다. 복수와 광기, 사랑과 배신이 얽힌 이 비극은 인간의 본성에 대한 깊은 통찰을 제공합니다.",
        cast: ["햄릿 역: 황정민", "오필리어 역: 전도연", "클로디어스 역: 손석구"],
        price: "50,000원 ~ 120,000원",
    },
]

export default function EventDetailPage({ params }) {
    // 해당 ID의 이벤트 찾기
    const event = allEvents.find((e) => e.id === params.id)

    // 이벤트가 없는 경우
    if (!event) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">이벤트를 찾을 수 없습니다</h1>
                <p className="mb-8">요청하신 이벤트 정보를 찾을 수 없습니다.</p>
                <Link
                    to="/category"
                    className="bg-primary text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition"
                >
                    모든 이벤트 보기
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Link
                    to={`/explore/${event.category.toLowerCase()}`}
                    className="text-primary hover:underline flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {event.category} 이벤트 목록으로 돌아가기
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-80 w-full">
                    <img src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                        {event.category}
                    </div>
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">이벤트 정보</h2>
                            <div className="space-y-3">
                                <p className="flex items-start">
                                    <span className="font-medium w-20">날짜:</span>
                                    <span>{event.date}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-20">시간:</span>
                                    <span>{event.time}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-20">장소:</span>
                                    <span>{event.venue}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-20">주소:</span>
                                    <span>{event.address}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-20">가격:</span>
                                    <span>{event.price}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">출연진</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                {event.performers ? (
                                    event.performers.map((performer, index) => <li key={index}>{performer}</li>)
                                ) : event.cast ? (
                                    event.cast.map((actor, index) => <li key={index}>{actor}</li>)
                                ) : event.artists ? (
                                    event.artists.map((artist, index) => <li key={index}>{artist}</li>)
                                ) : (
                                    <li>정보가 없습니다</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">이벤트 설명</h2>
                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    </div>

                    <div className="flex justify-center">
                        <button className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition">
                            예매하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

