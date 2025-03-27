import {Link} from "react-router"

// 샘플 이벤트 데이터
const events = [
    {
        id: "e1",
        title: "클래식 콘서트: 모차르트 스페셜",
        category: "음악",
        date: "2024-05-15",
        venue: "예술의전당",
        image: "/placeholder.svg?height=300&width=500&text=Mozart+Concert",
        description: "모차르트의 대표 작품들을 한자리에서 감상할 수 있는 특별한 콘서트입니다.",
    },
    {
        id: "e2",
        title: "현대 미술 전시회",
        category: "미술",
        date: "2024-04-20",
        venue: "국립현대미술관",
        image: "/placeholder.svg?height=300&width=500&text=Modern+Art",
        description: "현대 미술의 다양한 작품들을 만나볼 수 있는 특별 전시회입니다.",
    },
    {
        id: "e3",
        title: "뮤지컬 '레미제라블'",
        category: "뮤지컬",
        date: "2024-06-10",
        venue: "블루스퀘어",
        image: "/placeholder.svg?height=300&width=500&text=Les+Miserables",
        description: "세계적인 명작 뮤지컬 '레미제라블'의 한국 공연입니다.",
    },
    {
        id: "e4",
        title: "현대무용 페스티벌",
        category: "춤",
        date: "2024-04-10",
        venue: "국립극장",
        image: "/placeholder.svg?height=300&width=500&text=Dance+Festival",
        description: "국내외 유명 무용가들이 참여하는 현대무용 페스티벌입니다.",
    },
    {
        id: "e5",
        title: "연극 '햄릿'",
        category: "연기",
        date: "2024-07-15",
        venue: "예술의전당",
        image: "/placeholder.svg?height=300&width=500&text=Hamlet",
        description: "셰익스피어의 명작 '햄릿'을 현대적으로 재해석한 연극입니다.",
    },
    {
        id: "e6",
        title: "재즈 나이트",
        category: "음악",
        date: "2024-07-05",
        venue: "롤링홀",
        image: "/placeholder.svg?height=300&width=500&text=Jazz+Night",
        description: "다양한 재즈 아티스트들의 공연을 즐길 수 있는 특별한 밤입니다.",
    },
]

export default function ExplorePage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">모든 예술 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-48 w-full">
                            <img src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs">
                                {event.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-2">
                                {event.date} | {event.venue}
                            </p>
                            <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
                            <Link
                                to={`/explore/event/${event.id}`}
                                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition"
                            >
                                자세히 보기
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

