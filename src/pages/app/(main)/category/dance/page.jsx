import {Link} from "react-router"

// 춤 카테고리 이벤트 데이터
const danceEvents = [
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
        id: "d1",
        title: "발레 '백조의 호수'",
        category: "춤",
        date: "2024-06-25",
        venue: "예술의전당",
        image: "/placeholder.svg?height=300&width=500&text=Swan+Lake",
        description: "차이콥스키의 음악과 함께하는 클래식 발레 '백조의 호수'입니다.",
    },
    {
        id: "d2",
        title: "한국 전통 무용 공연",
        category: "춤",
        date: "2024-05-05",
        venue: "국립국악원",
        image: "/placeholder.svg?height=300&width=500&text=Korean+Dance",
        description: "한국의 아름다운 전통 무용을 감상할 수 있는 특별 공연입니다.",
    },
    {
        id: "d3",
        title: "스트릿 댄스 배틀",
        category: "춤",
        date: "2024-08-15",
        venue: "올림픽 공원",
        image: "/placeholder.svg?height=300&width=500&text=Street+Dance",
        description: "국내 최고의 스트릿 댄서들이 펼치는 화려한 배틀 공연입니다.",
    },
]

export default function DancePage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">춤 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {danceEvents.map((event) => (
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

