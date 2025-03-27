import {Link} from "react-router"

// 뮤지컬 카테고리 이벤트 데이터
const musicalEvents = [
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
        id: "m1",
        title: "뮤지컬 '오페라의 유령'",
        category: "뮤지컬",
        date: "2024-07-20",
        venue: "샤롯데씨어터",
        image: "/placeholder.svg?height=300&width=500&text=Phantom+of+the+Opera",
        description: "앤드류 로이드 웨버의 명작 '오페라의 유령' 월드투어 공연입니다.",
    },
    {
        id: "m2",
        title: "뮤지컬 '위키드'",
        category: "뮤지컬",
        date: "2024-08-15",
        venue: "블루스퀘어",
        image: "/placeholder.svg?height=300&width=500&text=Wicked",
        description: "브로드웨이 히트 뮤지컬 '위키드'의 한국 공연입니다.",
    },
    {
        id: "m3",
        title: "뮤지컬 '라이온 킹'",
        category: "뮤지컬",
        date: "2024-09-05",
        venue: "예술의전당",
        image: "/placeholder.svg?height=300&width=500&text=Lion+King",
        description: "디즈니의 명작 '라이온 킹'을 무대에서 만나볼 수 있는 뮤지컬입니다.",
    },
]

export default function MusicalPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">뮤지컬 이벤트</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {musicalEvents.map((event) => (
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

