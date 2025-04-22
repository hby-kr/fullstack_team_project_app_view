import {Link, useParams} from "react-router"
import {useQuery} from "@tanstack/react-query";
import {loadEventOne, loadeventsByCtgr} from "../../../utils/eventFetch.js";

export default function CategoryPage() {


   const {category} = useParams(); // URL 파라미터 (동적 라우팅에서) 값을 가져올 때 사용

   const categoryObj = {
      "music": 1,
      "art": 2,
      "dance": 3,
      "acting": 4,
      "musical": 5
   }
   const activeCategory = categoryObj[category]; // "music"으로 들어오면 1이 됨

   // 실제 API 호출 (useQuery 사용)
   const {
      data: categoryAllData, isLoading, isError, error,
   } = useQuery({
      queryKey: ['categoryAllData', activeCategory], // params.id라는 이름은 app에서 id로 정의해놨음.
      queryFn: () => loadeventsByCtgr(activeCategory),
      staleTime: 1000 * 60 * 5, // 데이터 캐싱 시간 (5분)
      cacheTime: 1000 * 60 * 10,
      retry: 1
   })


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
      <div>
         <h1 className="text-2xl font-bold mb-6">{category}</h1>

         <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">추천 {category} 콘텐츠</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

               {categoryAllData &&
                  categoryAllData
                     .slice(0, 2)
                     .map((event) => (
                        <div key={event.id} className="group">

                           <Link to={`/event/${event.id}`} className="block cursor-pointer">
                              <div
                                 className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                 <img
                                    src={event?.eventImages.find(img => img.imgOrder === 0)?.imgUrl || "/placeholder.svg"}
                                    alt={event.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                 />
                              </div>
                           </Link>

                           <div className="mt-3 flex justify-between items-start">
                              <h3 className="text-lg font-medium">
                                 <Link to={`/event/${event.id}`} className="hover:text-primary transition-colors">
                                    {event.title}
                                 </Link>
                              </h3>
                              {/*{event.bookable && (*/}
                              {/*   <Link*/}
                              {/*      to={`/src/pages/app/ticket/booking/${encodeURIComponent(event.id)}`}*/}
                              {/*      className="text-xs px-2 py-1 bg-primary text-white rounded-full hover:bg-primary/90 inline-block"*/}
                              {/*   >*/}
                              {/*      예매하기*/}
                              {/*   </Link>*/}
                              {/*)}*/}
                           </div>
                           {/*<p className="text-sm text-gray-600">{event.description}</p>*/}
                        </div>
                     ))}

            </div>

         </section>

         {/* Latest content (remaining images grid) */}
         <section>
            <h2 className="text-xl font-semibold mb-4">최신 {category} 콘텐츠</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

               {categoryAllData &&
                  categoryAllData
                     .slice(2)
                     .map((event) => (
                        <div key={event.id} className="group">
                           <Link to={`/event/${event.id}`} className="block cursor-pointer">
                              <div
                                 className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                 <img
                                    src={event?.eventImages.find(img => img.imgOrder === 0)?.imgUrl || "/placeholder.svg"}
                                    alt={event.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                 />
                              </div>
                           </Link>
                           <div className="mt-2 flex justify-between items-start">
                              <h3 className="text-base font-medium">
                                 <Link to={`/event/${event.id}`} className="hover:text-primary transition-colors">
                                    {event.title}
                                 </Link>
                              </h3>
                              {/*{event.bookable && (*/}
                              {/*   <Link*/}
                              {/*      to={`/src/pages/app/ticket/booking/${encodeURIComponent(event.id)}`}*/}
                              {/*      className="text-xs px-2 py-1 bg-primary text-white rounded-full hover:bg-primary/90 inline-block"*/}
                              {/*   >*/}
                              {/*      예매하기*/}
                              {/*   </Link>*/}
                              {/*)}*/}
                           </div>
                           {/*<p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>*/}
                        </div>
                     ))}

            </div>

         </section>
      </div>
   )
}

