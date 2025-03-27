import {Link} from "react-router"

export default function Home() {
    return (
        <div>
            {/* 히어로 섹션 */}
            <section className="bg-gradient-to-r from-primary/20 to-primary/5 py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                예술의 모든 것, <span className="text-primary">아트유</span>
                            </h1>
                            <p className="text-lg mb-6">음악, 미술, 춤, 연기, 뮤지컬까지 - 당신의 예술적 여정을 함께합니다.</p>
                            <div className="flex space-x-4">
                                <Link
                                    to="/category"
                                    className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition"
                                >
                                    탐색하기
                                </Link>
                                <Link
                                    to="/mypage"
                                    className="bg-white text-primary px-6 py-3 rounded-md font-medium border border-primary hover:bg-gray-50 transition"
                                >
                                    마이페이지
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="relative h-64 md:h-96 w-full">
                                <img
                                    src="/placeholder.svg?height=400&width=600&text=Art+Community"
                                    alt="예술 커뮤니티"
                                    fill
                                    className="object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 카테고리 섹션 */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center">예술 카테고리</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: "음악", path: "/music", image: "/placeholder.svg?height=200&width=200&text=Music" },
                            { name: "미술", path: "/art", image: "/placeholder.svg?height=200&width=200&text=Art" },
                            { name: "춤", path: "/dance", image: "/placeholder.svg?height=200&width=200&text=Dance" },
                            { name: "연기", path: "/acting", image: "/placeholder.svg?height=200&width=200&text=Acting" },
                            { name: "뮤지컬", path: "/musical", image: "/placeholder.svg?height=200&width=200&text=Musical" },
                            { name: "전체보기", path: "/", image: "/placeholder.svg?height=200&width=200&text=All" },
                        ].map((category) => (
                            <Link key={category.path} to={category.path} className="group">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform group-hover:scale-105">
                                    <div className="relative h-40 w-full">
                                        <img
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-medium">{category.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 추천 이벤트 섹션 */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center">추천 이벤트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "클래식 콘서트: 모차르트 스페셜",
                                date: "2024-05-15",
                                venue: "예술의전당",
                                image: "/placeholder.svg?height=300&width=500&text=Mozart+Concert",
                            },
                            {
                                title: "현대 미술 전시회",
                                date: "2024-04-20",
                                venue: "국립현대미술관",
                                image: "/placeholder.svg?height=300&width=500&text=Modern+Art",
                            },
                            {
                                title: "뮤지컬 '레미제라블'",
                                date: "2024-06-10",
                                venue: "블루스퀘어",
                                image: "/placeholder.svg?height=300&width=500&text=Les+Miserables",
                            },
                        ].map((event, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-48 w-full">
                                    <img src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {event.date} | {event.venue}
                                    </p>
                                    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition">
                                        자세히 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

