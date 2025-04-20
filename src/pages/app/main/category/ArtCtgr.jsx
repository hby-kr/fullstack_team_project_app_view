import {Link} from "react-router"

// 미술 카테고리 이벤트 데이터
const artEvents = [
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
        id: "a1",
        title: "반 고흐 특별전",
        category: "미술",
        date: "2024-06-15",
        venue: "세종문화회관",
        image: "/placeholder.svg?height=300&width=500&text=Van+Gogh",
        description: "반 고흐의 대표 작품들을 한자리에서 만나볼 수 있는 특별전입니다.",
    },
    {
        id: "a2",
        title: "한국 전통 미술전",
        category: "미술",
        date: "2024-05-10",
        venue: "국립중앙박물관",
        image: "/placeholder.svg?height=300&width=500&text=Korean+Art",
        description: "한국의 전통 미술 작품들을 소개하는 특별 전시회입니다.",
    },
    {
        id: "a3",
        title: "현대 사진전: 도시의 풍경",
        category: "미술",
        date: "2024-07-20",
        venue: "서울시립미술관",
        image: "/placeholder.svg?height=300&width=500&text=Urban+Photography",
        description: "현대 도시의 다양한 모습을 담은 사진 작품들을 전시합니다.",
    },
]

export default function ArtPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">미술 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artEvents.map((event) => (
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

