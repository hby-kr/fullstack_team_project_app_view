import {Link, useNavigate} from "react-router"
import {useState} from "react";
import { ChevronRight } from "lucide-react"

export default function All() {
    const [categories] = useState(["전체", "음악", "미술", "춤", "연기", "뮤지컬"])
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("전체")
    const categoryObj={
            "미술":"art",
            "춤": "dance",
            "연기":"acting",
            "뮤지컬":"musical",
            "음악":"music"

    }

    // 더미 데이터 생성 함수
    const generateCategoryImages = (category, count) => {
        return Array.from({ length: count }, (_, i) => ({
            id: `${category}-${i + 1}`,
            src: `/placeholder.svg?height=300&width=400&text=${category}${i + 1}`,
            alt: `${category} 이미지 ${i + 1}`,
            title: `${category} 콘텐츠 ${i + 1}`,
            description: `${category} 관련 콘텐츠에 대한 간략한 설명입니다. 여기에는 ${category}에 관한 정보가 표시됩니다.`,
            bookable: i % 3 === 0, // Every third item will be bookable
        }))
    }

    // 위 더미데이터 생성함수를 실행시키고 있음.
    const categoryImages = {
        음악: generateCategoryImages("음악", 12),
        미술: generateCategoryImages("미술", 12),
        춤: generateCategoryImages("춤", 12),
        연기: generateCategoryImages("연기", 12),
        뮤지컬: generateCategoryImages("뮤지컬", 12),
    }

    const handleCategoryChange = (category) => {
        setActiveCategory(category)
        navigate("/cate/"+categoryObj[category])
    }

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            {/* All category selected - show representative images from all categories */}
            {activeCategory === "전체" && (
                <div>
                    <h1 className="text-2xl font-bold mb-6">전체 콘텐츠</h1>

                    {/* Display representative images for each category */}
                    {categories
                        .filter((cat) => cat !== "전체")
                        .map((category) => (
                            <section key={category} className="mb-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">{category}</h2>
                                    <button
                                        className="flex items-center text-sm text-primary hover:underline"
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        더보기 <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>

                                {/* Category representative image grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {categoryImages[category].slice(0, 4).map((image) => (
                                        <div key={image.id} className="group">
                                            <Link to={`/detail/${image.id}`} className="block cursor-pointer">
                                                <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                                    <img
                                                        src={image.src || "/placeholder.svg"}
                                                        alt={image.alt}
                                                        width={400}
                                                        height={300}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                            </Link>
                                            <div className="mt-2 flex justify-between items-start">
                                                <h3 className="text-base font-medium">
                                                    <Link to={`/detail/${image.id}`} className="hover:text-primary transition-colors">
                                                        {image.title}
                                                    </Link>
                                                </h3>
                                                {image.bookable && (
                                                    <Link
                                                        to={`/booking/${encodeURIComponent(image.id)}`}
                                                        className="text-xs px-2 py-1 bg-primary text-white rounded-full hover:bg-primary/90 inline-block"
                                                    >
                                                        예매하기
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                </div>
            )}
        </main>

    )
}

