"use client";

import React, { useState, useEffect } from "react";
//import { useParams, useRouter } from "next/navigation";
import {Link, useParams, useNavigate} from "react-router"
// import Image from "next/image";
import { ArrowLeft, Upload, Tag } from "lucide-react";
import Header from "/src/components/header";
import { useAuth } from "/src/lib/auth-context";

export default function EditPostPage() {
  const params = useParams();
  //const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("음악");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postLoaded, setPostLoaded] = useState(false);
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      //router.push("/login");
      navigate("/login")
      return;
    }

    // 게시물 데이터 초기화 (실제 앱에서는 필요 없을 수 있음)
    if (!localStorage.getItem("posts")) {
      // 샘플 게시물 데이터 생성
      const samplePosts = [
        {
          id: "post1",
          title: "첫 번째 공연 후기",
          content:
            "지난 주말에 다녀온 클래식 공연은 정말 인상적이었습니다. 특히 바이올린 솔로 부분에서는 감동의 눈물을 흘렸습니다.",
          category: "음악",
          tags: ["클래식", "공연", "바이올린"],
          date: "2024-03-01",
          images: ["/placeholder.svg?height=300&width=400&text=Concert1"],
          userId: user?.id,
          userName: user?.name,
        },
        {
          id: "post2",
          title: "미술관 전시회 방문",
          content:
            "현대 미술관에서 열린 특별 전시회를 다녀왔습니다. 다양한 작품들이 인상적이었고, 특히 미디어 아트 섹션이 기억에 남습니다.",
          category: "미술",
          tags: ["전시회", "현대미술", "미디어아트"],
          date: "2024-02-15",
          images: ["/placeholder.svg?height=300&width=400&text=Exhibition"],
          userId: user?.id,
          userName: user?.name,
        },
        {
          id: "post3",
          title: "춤 워크샵 참여 후기",
          content:
            "주말에 참여한 현대무용 워크샵은 정말 유익했습니다. 새로운 동작과 표현 방법을 배울 수 있었고, 다른 참가자들과의 교류도 즐거웠습니다.",
          category: "춤",
          tags: ["현대무용", "워크샵", "댄스"],
          date: "2024-01-20",
          images: ["/placeholder.svg?height=300&width=400&text=Dance"],
          userId: user?.id,
          userName: user?.name,
        },
      ];
      localStorage.setItem("posts", JSON.stringify(samplePosts));
    }

    // Load post data
    const postId = params.id;
    if (postId) {
      // In a real app, this would be an API call
      // For demo purposes, we'll use localStorage
      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      const post = existingPosts.find((p) => p.id === postId);

      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setTags(post.tags.join(", "));
        setImages(post.images || []);
        setPostLoaded(true);
      } else {
        // Post not found - 샘플 데이터로 초기화
        if (postId === "post1" || postId === "post2" || postId === "post3") {
          const samplePosts = JSON.parse(localStorage.getItem("posts") || "[]");
          const samplePost = samplePosts.find((p) => p.id === postId);

          if (samplePost) {
            setTitle(samplePost.title);
            setContent(samplePost.content);
            setCategory(samplePost.category);
            setTags(samplePost.tags.join(", "));
            setImages(samplePost.images || []);
            setPostLoaded(true);
          } else {
            alert("게시물을 찾을 수 없습니다.");
            navigate("/mypage");
          }
        } else {
          alert("게시물을 찾을 수 없습니다.");
          navigate("/mypage");
        }
      }
    }
  }, [user, isLoading, navigate, params.id]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 구현에서는 API 호출로 데이터를 저장합니다
      // 여기서는 간단히 로컬 스토리지에 저장하는 예시를 보여줍니다
      const postId = params.id;
      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");

      const updatedPosts = existingPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            title,
            content,
            category,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            images,
            updatedAt: new Date().toISOString(),
          };
        }
        return post;
      });

      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      alert("게시물이 성공적으로 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render until post is loaded
  if (!postLoaded && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">게시물 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/mypage" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>마이페이지로 돌아가기</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">게시물 수정</h1>

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
                            <img
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
                  <Link
                    to="/mypage"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </Link>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "수정 중..." : "게시물 수정"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

