import {Link, useParams} from "react-router"
import {useState} from "react";

export default function CategoryPage() {
    const{category}=useParams();
    const categoryObj={
        "art": "미술",
        "dance": "춤",
        "acting": "연기",
        "musical": "뮤지컬",
        "music": "음악"

    }
    const activeCategory=categoryObj[category];
    const categoryImages = {
        [activeCategory]: generateCategoryImages(activeCategory, 12),
    }
    function generateCategoryImages(category, count) {
        return Array.from({ length: count }, (_, i) => ({
            id: `${category}-${i + 1}`,
            src: `/placeholder.svg?height=300&width=400&text=${category}${i + 1}`,
            alt: `${category} 이미지 ${i + 1}`,
            title: `${category} 콘텐츠 ${i + 1}`,
            description: `${category} 관련 콘텐츠에 대한 간략한 설명입니다. 여기에는 ${category}에 관한 정보가 표시됩니다.`,
            bookable: i % 3 === 0, // Every third item will be bookable
        }))
    }

    console.log(category);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">{activeCategory}</h1>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">추천 {activeCategory} 콘텐츠</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryImages && categoryImages[activeCategory].slice(0, 2).map((image) => (
                        <div key={image.id} className="group">
                            <Link to={`/detail/${image.id}`} className="block cursor-pointer">
                                <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                    <img
                                        src={image.src || "/placeholder.svg"}
                                        alt={image.alt}
                                        width={600}
                                        height={400}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            </Link>
                            <div className="mt-3 flex justify-between items-start">
                                <h3 className="text-lg font-medium">
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
                            <p className="text-sm text-gray-600">{image.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest content (remaining images grid) */}
            <section>
                <h2 className="text-xl font-semibold mb-4">최신 {activeCategory} 콘텐츠</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryImages[activeCategory].slice(2).map((image) => (
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
        </div>
    )
}

