"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, Tag } from "lucide-react"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"

export default function CreatePostPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("음악")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to login page if not logged in
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출로 데이터를 저장합니다
      // 여기서는 간단히 로컬 스토리지에 저장하는 예시를 보여줍니다
      const newPost = {
        id: `post-${Date.now()}`,
        title,
        content,
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        images,
        date: new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\. /g, "-")
          .replace(/\.$/, ""),
        userId: user?.id,
        userName: user?.name,
        createdAt: new Date().toISOString(),
      }

      // 기존 게시물 가져오기
      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]")

      // 새 게시물 추가
      localStorage.setItem("posts", JSON.stringify([newPost, ...existingPosts]))

      alert("게시물이 성공적으로 등록되었습니다.")
      router.push("/mypage")
    } catch (error) {
      console.error("게시물 등록 실패:", error)
      alert("게시물 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>뒤로 가기</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">일반 게시물 작성</h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="게시물 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="음악">음악</option>
                    <option value="미술">미술</option>
                    <option value="춤">춤</option>
                    <option value="연기">연기</option>
                    <option value="뮤지컬">뮤지컬</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="게시물 내용을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="예: 클래식, 피아노, 공연"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지 업로드</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                        >
                          <span>이미지 파일 선택</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">또는 드래그 앤 드롭</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업로드된 이미지 ({images.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`업로드 이미지 ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    취소
                  </Link>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "등록 중..." : "게시물 등록"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

