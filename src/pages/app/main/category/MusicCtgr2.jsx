import {Link} from "react-router"

// 음악 카테고리 이벤트 데이터
const musicEvents = [
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
        id: "e6",
        title: "재즈 나이트",
        category: "음악",
        date: "2024-07-05",
        venue: "롤링홀",
        image: "/placeholder.svg?height=300&width=500&text=Jazz+Night",
        description: "다양한 재즈 아티스트들의 공연을 즐길 수 있는 특별한 밤입니다.",
    },
    {
        id: "e7",
        title: "K-POP 페스티벌",
        category: "음악",
        date: "2024-08-15",
        venue: "올림픽 공원",
        image: "/placeholder.svg?height=300&width=500&text=KPOP+Festival",
        description: "인기 K-POP 아티스트들이 총출동하는 여름 페스티벌입니다.",
    },
    {
        id: "e8",
        title: "오페라 '라 트라비아타'",
        category: "음악",
        date: "2024-09-10",
        venue: "예술의전당",
        image: "/placeholder.svg?height=300&width=500&text=La+Traviata",
        description: "베르디의 명작 오페라 '라 트라비아타'의 화려한 공연입니다.",
    },
]

export default function MusicPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">음악 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {musicEvents.map((event) => (
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

