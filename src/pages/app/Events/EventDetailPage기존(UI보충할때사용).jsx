import {useEffect, useState} from "react"
import {Link, useParams, useNavigate} from "react-router"
import {useAuth} from "/src/lib/auth-context"
import {ArrowLeft, Heart, Share2, MessageSquare} from "lucide-react"
import {loadEventOne} from "../../../utils/eventFetch.js";
import {useQuery} from "@tanstack/react-query";
import isError from "next/dist/lib/is-error.js"; // 깔끔한 아이콘 라이브러리임


export default function DetailPage() {

   const params = useParams() // useParams → “URL에서 전달된 값”을 꺼내는 도구
   const navigate = useNavigate()
   const {user} = useAuth()

   const [content, setContent] = useState(null)
   const [isLoading, setIsLoading] = useState(true)
   const [isLiked, setIsLiked] = useState(false)
   const [relatedItems, setRelatedItems] = useState([])


   useEffect(async () => {
      // Extract category from ID (e.g., "음악-1" -> "음악")
      const encodedId = params.id  // app에서 id로 정의해놨음.

      const id = decodeURIComponent(encodedId) //  (예: %EC%9D%8C%EC%95%85 → 음악)
      const parts = id.split("-") // "음악-1"을 ["음악", "1"]로 분리
      const category = decodeURIComponent(parts[0]) // 콘텐츠의 카테고리 ("음악")
      const itemNumber = parts[1] || "1" // 콘텐츠 번호. 없으면 기본값 "1" 사용

      // 실제 API 호출
      const data = await loadEventOne(id)
      const {data: currentContent, isLoading, isError, error,
      } = useQuery({
         queryKey: ['eventDetail', id],
         queryFn: () => loadEventOne(id),
         staleTime: 1000 * 60 * 5, // 데이터 캐싱 시간 (5분)
         cacheTime: 1000 * 60 * 10,
         retry: 1
      })

      //
      // // Create current content data
      // const currentContent = {
      //    id: id,
      //    src: `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(category)}-${itemNumber}`,
      //    alt: `${category} 이미지`,
      //    title: `${category} 콘텐츠 ${itemNumber} - 상세 페이지`,
      //    description: `이것은 ${category} 관련 콘텐츠에 대한 상세 설명입니다. 여기에는 ${category}에 관한 자세한 정보가 표시됩니다. 이 콘텐츠는 ${category} 분야의 전문가들이 만들었으며, 다양한 정보와 인사이트를 제공합니다. 사용자들은 이 콘텐츠를 통해 ${category}에 대한 이해를 높일 수 있습니다.`,
      //    category: category,
      //    author: "artU",
      //    date: "2024년 3월 6일",
      //    views: Math.floor(Math.random() * 1000) + 100,
      //    likes: Math.floor(Math.random() * 100) + 10,
      //    comments: Math.floor(Math.random() * 20) + 1,
      //    bookable:
      //       category === "음악" || category === "춤" || category === "연기" || category === "뮤지컬" || Math.random() > 0.5, // Make performance-related categories bookable
      // }

/*
      // Create related content (other items in the same category)
      const related = Array.from({length: 4}, (_, i) => {
         const relatedId = `${category}-${Number(itemNumber) + i + 1}`
         return {
            id: relatedId,
            src: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(relatedId)}`,
            alt: `${category} 관련 이미지 ${i + 1}`,
            title: `${category} 관련 콘텐츠 ${i + 1}`,
            description: `${category} 관련 콘텐츠에 대한 간략한 설명입니다.`,
            category: category,
            bookable: Math.random() > 0.5, // Randomly make some items bookable
         }
      })
 */

      setContent(currentContent) // 현재 콘텐츠 정보 저장.
      setRelatedItems(related) // 관련 콘텐츠 4개 저장.
      setIsLoading(false) // 로딩 상태 해제.
   }, [params.id])


   const handleLike = () => {
      if (!user) {
         // Redirect to login page if not logged in
         navigate("/login")
         return
      }
      setIsLiked(!isLiked)
   }

   const handleShare = async () => {
      // Share functionality (currently copies URL to clipboard)
      if (navigator.clipboard) {
         try {
            await navigator.clipboard.writeText(window.location.href);
            alert("URL이 클립보드에 복사되었습니다.");
         } catch (error) {
            console.error("클립보드 복사 오류:", error);
         }
      }
   };


   // 여기서 코딩이 걸려서 바로 로딩중을 return하게 만들어 버리는 것.
   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <div
                  className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-600">로딩 중...</p>
            </div>
         </div>
      )
   }

   if (isError) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <p className="text-xl font-semibold mb-4">콘텐츠를 찾을 수 없습니다</p>
               <Link to="/public" className="text-primary hover:underline">
                  홈으로 돌아가기
               </Link>
            </div>
         </div>
      )
   }


   return (
      <div className="min-h-screen flex flex-col bg-gray-50">


         {/*/!* Main content *!/*/}
         {/*<main className="flex-grow container mx-auto px-4 py-8">*/}

         {/*   <div className="max-w-4xl mx-auto">*/}
         {/*      /!* Back button *!/*/}
         {/*      <Link to="/public" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">*/}
         {/*         <ArrowLeft className="w-4 h-4 mr-2"/>*/}
         {/*         <span>뒤로 가기</span>*/}
         {/*      </Link>*/}

         {/*      /!* Content header *!/*/}
         {/*      <div className="mb-8">*/}
         {/*         <h1 className="text-3xl font-bold mb-2">{content.title}</h1>*/}
         {/*         <div className="flex items-center text-sm text-gray-500 mb-4">*/}
         {/*            <span className="mr-4">{content.author}</span>*/}
         {/*            <span className="mr-4">{content.date}</span>*/}
         {/*            <span>조회수 {content.views}</span>*/}
         {/*         </div>*/}
         {/*         <div className="flex items-center space-x-4">*/}
         {/*            <span*/}
         {/*               className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{content.category}</span>*/}
         {/*         </div>*/}
         {/*      </div>*/}

         {/*      /!* Content image *!/*/}
         {/*      <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 bg-white">*/}
         {/*         {content.bookable ? (*/}
         {/*            <Link to={`/booking/${encodeURIComponent(content.id)}`}>*/}
         {/*               <img*/}
         {/*                  src={content.src || "/placeholder.svg"}*/}
         {/*                  alt={content.alt}*/}
         {/*                  width={800}*/}
         {/*                  height={600}*/}
         {/*                  className="w-full h-auto object-cover hover:opacity-90 transition-opacity"*/}
         {/*               />*/}
         {/*            </Link>*/}
         {/*         ) : (*/}
         {/*            <img*/}
         {/*               src={content.src || "/placeholder.svg"}*/}
         {/*               alt={content.alt}*/}
         {/*               width={800}*/}
         {/*               height={600}*/}
         {/*               className="w-full h-auto object-cover"*/}
         {/*            />*/}
         {/*         )}*/}
         {/*      </div>*/}

         {/*      /!* Content description *!/*/}
         {/*      <div className="mb-8">*/}
         {/*         <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.description}</p>*/}
         {/*         {content.bookable && (*/}
         {/*            <div className="mt-4">*/}
         {/*               <Link*/}
         {/*                  to={`/booking/${encodeURIComponent(content.id)}`}*/}
         {/*                  className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"*/}
         {/*               >*/}
         {/*                  예매하기*/}
         {/*               </Link>*/}
         {/*            </div>*/}
         {/*         )}*/}
         {/*      </div>*/}

         {/*      /!* Interaction buttons *!/*/}
         {/*      <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">*/}
         {/*         <div className="flex items-center space-x-6">*/}
         {/*            <button*/}
         {/*               onClick={handleLike}*/}
         {/*               className={`flex items-center ${isLiked ? "text-red-500" : "text-gray-600"} hover:text-red-500`}*/}
         {/*            >*/}
         {/*               <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`}/>*/}
         {/*               <span>{isLiked ? content.likes + 1 : content.likes}</span>*/}
         {/*            </button>*/}
         {/*            <button className="flex items-center text-gray-600">*/}
         {/*               <MessageSquare className="w-5 h-5 mr-2"/>*/}
         {/*               <span>{content.comments}</span>*/}
         {/*            </button>*/}
         {/*         </div>*/}
         {/*         <button onClick={handleShare} className="flex items-center text-gray-600 hover:text-primary">*/}
         {/*            <Share2 className="w-5 h-5 mr-2"/>*/}
         {/*            <span>공유하기</span>*/}
         {/*         </button>*/}
         {/*      </div>*/}



               {/* Related content */}
               {/*<div>*/}
               {/*   <h2 className="text-xl font-semibold mb-4">관련 콘텐츠</h2>*/}
               {/*   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">*/}
               {/*      {relatedItems.map((item) => (*/}
               {/*         <div key={item.id} className="group">*/}
               {/*            <Link*/}
               {/*               to={*/}
               {/*                  item.bookable*/}
               {/*                     ? `/booking/${encodeURIComponent(item.id)}`*/}
               {/*                     : `/detail/${encodeURIComponent(item.id)}`*/}
               {/*               }*/}
               {/*               className="block"*/}
               {/*            >*/}
               {/*               <div*/}
               {/*                  className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">*/}
               {/*                  <img*/}
               {/*                     src={item.src || "/placeholder.svg"}*/}
               {/*                     alt={item.alt}*/}
               {/*                     width={300}*/}
               {/*                     height={200}*/}
               {/*                     className="w-full h-full object-cover group-hover:scale-105 transition-transform"*/}
               {/*                  />*/}
               {/*               </div>*/}
               {/*               <h3 className="mt-2 text-sm font-medium group-hover:text-primary">{item.title}</h3>*/}
               {/*            </Link>*/}
               {/*            {item.bookable && (*/}
               {/*               <div className="mt-1">*/}
               {/*                  <Link*/}
               {/*                     to={`/booking/${encodeURIComponent(item.id)}`}*/}
               {/*                     className="text-xs px-2 py-1 bg-primary text-white rounded-full hover:bg-primary/90 inline-block"*/}
               {/*                  >*/}
               {/*                     예매하기*/}
               {/*                  </Link>*/}
               {/*               </div>*/}
               {/*            )}*/}
               {/*         </div>*/}
               {/*      ))}*/}
               {/*   </div>*/}
               {/*</div>*/}

      </div>
   )
}

