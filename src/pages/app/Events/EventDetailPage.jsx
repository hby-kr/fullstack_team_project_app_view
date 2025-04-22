import {useEffect, useState} from "react"
import {Link, useParams, useNavigate, data} from "react-router"
import {useAuth} from "/src/lib/auth-context"
import {ArrowLeft, Heart, Share2, MessageSquare} from "lucide-react"
import {loadEventOne} from "../../../utils/eventFetch.js";
import {useQuery} from "@tanstack/react-query";
import isError from "next/dist/lib/is-error.js"; // 깔끔한 아이콘 라이브러리임


export default function DetailPage() {

   const navigate = useNavigate()
   const {user} = useAuth()
   const params = useParams() // useParams → “URL에서 전달된 값”을 꺼내는 도구

   const [content, setContent] = useState(null)
   // const [isLoading, setIsLoading] = useState(true)
   // const [isLiked, setIsLiked] = useState(false)
   // const [relatedItems, setRelatedItems] = useState([])

   // 실제 API 호출 (useQuery 사용)
   const {
      data: currentContent, isLoading, isError, error,
   } = useQuery({
      queryKey: ['eventDetail', params.id], // params.id라는 이름은 app에서 id로 정의해놨음.
      queryFn: () => loadEventOne(params.id),
      staleTime: 1000 * 60 * 5, // 데이터 캐싱 시간 (5분)
      cacheTime: 1000 * 60 * 10,
      retry: 1
   })
   // useQuery 자체가 상태 역할을 하니까 별도의 useState로 감싸지 않아도 됨.

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
               <p className="text-xl font-semibold mb-4">{error.message}</p>
               <Link to="/public" className="text-primary hover:underline">
                  홈으로 돌아가기
               </Link>
            </div>
         </div>
      )
   }
   // 성공하면 아래를 반환.
   return (
      <div className="min-h-screen flex flex-col bg-gray-50">


         {/* Main content */}
         <main className="flex-grow container mx-auto px-4 py-8">

            <div className="max-w-4xl mx-auto">
               {/* Back button */}
               <Link to="/public" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2"/>
                  <span>뒤로 가기</span>
               </Link>

               {/* Content header */}
               <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">{currentContent.title}</h1>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                     <span className="mr-4">{currentContent.userId}</span>
                     {/*<span className="mr-4">{content.date}</span>*/}
                     {/*<span>조회수 {content.views}</span>*/}
                  </div>
                  <div className="flex items-center space-x-4">
                     {/*<span*/}
                     {/*   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{content.category}</span>*/}
                  </div>
               </div>

               {/* Content image */}
               <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  {currentContent.eventImages ? (
                     <Link to={`/booking/${encodeURIComponent(currentContent.id)}`}>
                        <img
                           src={currentContent?.eventImages.find(img => img.imgOrder === 0)?.imgUrl || "/placeholder.svg"}
                           width={800}
                           height={600}
                           className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                        />
                     </Link>
                  ) : (
                     <img
                        src={currentContent?.eventImages.find(img => img.imgOrder === 0)?.imgUrl || "/placeholder.svg"}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                     />
                  )}
               </div>
            </div>
         </main>


         {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  */}


         <div className="event-detail">
            {/* 공연 제목 및 기본 정보 */}
            <h1>{currentContent.title}</h1>
            <img src={currentContent?.eventImages.find(img => img.imgOrder === 0)?.imgUrl}
                 alt={`${currentContent.title} 대표 이미지`}/>

            <p><strong>작성자:</strong> {currentContent.userId}</p>
            <p><strong>지역:</strong> {currentContent.location}</p>
            <p><strong>주소:</strong> {currentContent.address}</p>
            <p><strong>소속:</strong> {currentContent.company}</p>
            <p><strong>소요 시간:</strong> {currentContent.howLong}분</p>
            <p><strong>관람 가능 연령:</strong> {currentContent.ageLimit}세 이상</p>
            <hr/>

            {/* 공연 이미지 */}
            <h2>공연 이미지</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
               {currentContent.eventImages.map((img) => (
                  <img key={img.eventId + img.imgOrder} src={img.imgUrl} alt="상세 이미지" style={{height: '300px'}}/>
               ))}
            </div>
            <hr/>


            {/* 공연 상세 정보 이미지 */}
            <h2>상세 이미지</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
               {currentContent.eventDetailImages.map((img) => (
                  <img key={img.eventId + img.imgOrder} src={img.imgUrl} alt="상세 이미지"
                       style={{height: '300px'}}/>
               ))}
            </div>
            <hr/>


            {/* 출연진 */}
            <h2>출연진 & 제작진</h2>
            <div className="cast-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
               {currentContent.eventCast.map(({id, role, actor}) => (
                  <div key={id} style={{textAlign: 'center'}}>
                     <img src={actor.actorsImages[0]?.imgUrl} alt={actor.name}
                          style={{borderRadius: '50%', width: '100px', height: '100px'}}/>
                     <p><strong>{actor.name}</strong> ({role})</p>
                  </div>
               ))}
            </div>

            <hr/>

            {/* 리뷰 */}
            <h2>리뷰 ({currentContent.eventReview.length})</h2>
            {currentContent.eventReview.length === 0 ? (<p> 아직 등록된 리뷰가 없습니다. </p>)
               : (currentContent.eventReview.map((review) => (
                     <div key={review.id} style={{marginBottom: '1.5rem'}}>
                        <div>
                           <p>⭐ {review.rate}점</p>
                           <p>{review.contents}</p>
                        </div>
                        {review.eventReviewImages.length > 0 && (
                           <div style={{display: 'flex', gap: '0.5rem'}}>
                              {review.eventReviewImages.map((img) => (
                                 <img key={img.id} src={img.imgUrl} alt="리뷰 이미지" style={{width: '100px'}}/>
                              ))}
                           </div>
                        )}
                     </div>
                  ))
               )}
         </div>




      </div>
   )
}

