"use client"

import type React from "react"

import {useState, useEffect} from "react"
import Link from "next/link"
import Image from "next/image"
import {Save, X, GripVertical, ChevronRight} from "lucide-react"
import Header from "@/components/header"

// Generate category images function
const generateCategoryImages = (category: string, count: number) => {
    return Array.from({length: count}, (_, i) => ({
        id: `${category}-${i + 1}`,
        src: `/placeholder.svg?height=300&width=400&text=${category}${i + 1}`,
        alt: `${category} 이미지 ${i + 1}`,
        title: `${category} 콘텐츠 ${i + 1}`,
        description: `${category} 관련 콘텐츠에 대한 간략한 설명입니다. 여기에는 ${category}에 관한 정보가 표시됩니다.`,
        bookable: i % 3 === 0, // Every third item will be bookable
    }))
}

export default function HomePage() {
    // Category list state (including "All" category)
    const [categories, setCategories] = useState(["전체", "음악", "미술", "춤", "연기", "뮤지컬"])

    // Currently selected category (default: All)
    const [activeCategory, setActiveCategory] = useState("전체")

    // Reordering mode state
    const [isReordering, setIsReordering] = useState(false)

    // Temporary order (used during reordering)
    const [tempCategories, setTempCategories] = useState<string[]>([])

    // Dragged item and drop target item indices
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null)

    // Category images data
    const categoryImages = {
        음악: generateCategoryImages("음악", 12),
        미술: generateCategoryImages("미술", 12),
        춤: generateCategoryImages("춤", 12),
        연기: generateCategoryImages("연기", 12),
        뮤지컬: generateCategoryImages("뮤지컬", 12),
    }

    // Copy current category order to temporary state when entering reordering mode
    useEffect(() => {
        if (isReordering) {
            // Exclude "All" category from reordering
            setTempCategories([...categories.filter((cat) => cat !== "전체")])
        }
    }, [isReordering, categories])

    // Category change handler
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
    }

    // Toggle reordering mode
    const toggleReorderMode = () => {
        setIsReordering(!isReordering)
    }

    // Save reordering
    const saveReordering = () => {
        // "All" category is always at the first position
        setCategories(["전체", ...tempCategories])
        setIsReordering(false)
    }

    // Drag start handler
    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index)
    }

    // Drag over handler
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverItemIndex(index)
    }

    // Drag end handler
    const handleDragEnd = () => {
        if (draggedItemIndex !== null && dragOverItemIndex !== null) {
            const newCategories = [...tempCategories]
            const draggedItem = newCategories[draggedItemIndex]

            // Remove dragged item
            newCategories.splice(draggedItemIndex, 1)

            // Insert at drop position
            newCategories.splice(dragOverItemIndex, 0, draggedItem)

            setTempCategories(newCategories)
        }

        // Reset state
        setDraggedItemIndex(null)
        setDragOverItemIndex(null)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header/>

            {/* Main navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    {isReordering ? (
                        // Reordering mode UI
                        <div className="py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">카테고리 순서 변경</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveReordering}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90"
                                    >
                                        <Save className="w-4 h-4 mr-1"/>
                                        저장
                                    </button>
                                    <button
                                        onClick={toggleReorderMode}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                    >
                                        <X className="w-4 h-4 mr-1"/>
                                        취소
                                    </button>
                                </div>
                            </div>
                            <p className="mb-4 text-sm text-gray-500">
                                항목을 드래그하여 순서를 변경하세요 ("전체" 카테고리는 항상 첫 번째 위치에 고정됩니다)
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tempCategories.map((category, index) => (
                                    <li
                                        key={category}
                                        className={`flex items-center justify-between p-3 bg-white border rounded cursor-move ${
                                            draggedItemIndex === index ? "opacity-50 border-dashed" : ""
                                        }`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="flex items-center">
                                            <GripVertical className="w-5 h-5 mr-2 text-gray-400"/>
                                            <span className="text-base">{category}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        // Normal mode UI (category tabs)
                        <nav
                            className="flex items-center overflow-x-auto py-4 -mx-4 px-4 md:px-0 md:mx-0 md:justify-center z-[5]">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`px-4 py-2 mx-1 text-base font-medium rounded-full transition-colors ${
                                        activeCategory === category
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 mx-1 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-full ml-4"
                                onClick={toggleReorderMode}
                            >
                                순서변경
                            </button>
                        </nav>
                    )}
                </div>
            </div>

            {/* Main content */}
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
                                            더보기 <ChevronRight className="w-4 h-4 ml-1"/>
                                        </button>
                                    </div>

                                    {/* Category representative image grid */}
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {categoryImages[category as keyof typeof categoryImages].slice(0, 4).map((image) => (
                                            <div key={image.id} className="group">
                                                <Link href={`/detail/${image.id}`} className="block cursor-pointer">
                                                    <div
                                                        className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                                        <Image
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
                                                        <Link href={`/detail/${image.id}`}
                                                              className="hover:text-primary transition-colors">
                                                            {image.title}
                                                        </Link>
                                                    </h3>
                                                    {image.bookable && (
                                                        <Link
                                                            href={`/booking/${encodeURIComponent(image.id)}`}
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

                {/* Individual category selected - show all images for that category */}
                {activeCategory !== "전체" && categories.includes(activeCategory) && (
                    <div>
                        <h1 className="text-2xl font-bold mb-6">{activeCategory}</h1>

                        {/* Recommended content (2 large images) */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold mb-4">추천 {activeCategory} 콘텐츠</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categoryImages[activeCategory as keyof typeof categoryImages].slice(0, 2).map((image) => (
                                    <div key={image.id} className="group">
                                        <Link href={`/detail/${image.id}`} className="block cursor-pointer">
                                            <div
                                                className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                                <Image
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
                                                <Link href={`/detail/${image.id}`}
                                                      className="hover:text-primary transition-colors">
                                                    {image.title}
                                                </Link>
                                            </h3>
                                            {image.bookable && (
                                                <Link
                                                    href={`/booking/${encodeURIComponent(image.id)}`}
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
                                {categoryImages[activeCategory as keyof typeof categoryImages].slice(2).map((image) => (
                                    <div key={image.id} className="group">
                                        <Link href={`/detail/${image.id}`} className="block cursor-pointer">
                                            <div
                                                className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                                <Image
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
                                                <Link href={`/detail/${image.id}`}
                                                      className="hover:text-primary transition-colors">
                                                    {image.title}
                                                </Link>
                                            </h3>
                                            {image.bookable && (
                                                <Link
                                                    href={`/booking/${encodeURIComponent(image.id)}`}
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
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">art U</h3>
                            <p className="text-gray-400">다양한 예술 분야의 콘텐츠를 제공하는 커뮤니티 플랫폼입니다.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">카테고리</h3>
                            <ul className="space-y-2">
                                {categories
                                    .filter((cat) => cat !== "전체")
                                    .map((category) => (
                                        <li key={category}>
                                            <button className="text-gray-400 hover:text-white cursor-pointer"
                                                    onClick={() => handleCategoryChange(category)}>
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 cursor-pointer"
                                onClick={() => (window.location.href = '/cs')}>고객센터</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white cursor-pointer"
                                          onClick={() => (window.location.href = '/cs')}>
                                        자주 묻는 질문
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white cursor-pointer"
                                          onClick={() => (window.location.href = '/cs')}>
                                        문의하기
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white cursor-pointer"
                                          onClick={() => (window.location.href = '/cs')}>
                                        이용약관
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-400 hover:text-white cursor-pointer"
                                          onClick={() => (window.location.href = '/cs')}>
                                        개인정보처리방침
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white cursor-pointer">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; 2024 art U. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

