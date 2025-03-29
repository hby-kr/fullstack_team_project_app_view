import {Link} from "react-router"

// 연기 카테고리 이벤트 데이터
const actingEvents = [
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
        id: "ac1",
        title: "연극 '리어왕'",
        category: "연기",
        date: "2024-08-20",
        venue: "국립극장",
        image: "/placeholder.svg?height=300&width=500&text=King+Lear",
        description: "셰익스피어의 비극 '리어왕'을 현대적인 무대에서 만나볼 수 있는 공연입니다.",
    },
    {
        id: "ac2",
        title: "연극 '벚꽃동산'",
        category: "연기",
        date: "2024-05-25",
        venue: "대학로 예술극장",
        image: "/placeholder.svg?height=300&width=500&text=Cherry+Orchard",
        description: "체홉의 명작 '벚꽃동산'을 한국적 정서로 재해석한 연극입니다.",
    },
    {
        id: "ac3",
        title: "독백 페스티벌",
        category: "연기",
        date: "2024-09-10",
        venue: "아르코예술극장",
        image: "/placeholder.svg?height=300&width=500&text=Monologue+Festival",
        description: "다양한 배우들의 독백 연기를 감상할 수 있는 특별한 페스티벌입니다.",
    },
]

export default function ActingPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">연기 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {actingEvents.map((event) => (
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

