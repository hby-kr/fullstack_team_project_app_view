import {Link, useNavigate} from "react-router"
import {useState} from "react";
import {ChevronRight} from "lucide-react"
import {useQueries} from "@tanstack/react-query";
import {loadeventForMain} from "../../../utils/eventFetch.js";

export default function All() {
   const navigate = useNavigate();
   const [categories] = useState(["전체", "음악", "미술", "춤", "연기", "뮤지컬"])
   const [activeCategory, setActiveCategory] = useState("전체")


   const categoryObjKor = {
      "음악": "music",
      "미술": "art",
      "춤": "dance",
      "연기": "acting",
      "뮤지컬": "musical"
   }

   const categoryObjNum = {
      "음악": 1,
      "미술": 2,
      "춤": 3,
      "연기": 4,
      "뮤지컬": 5
      // categoryObjNum[category]; // "음악"으로 들어오면 1이 됨
   }

   const pageSize = 4;
   const commonOptions = {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      retry: 1
   };

   const categoryQueries = useQueries({
      queries:
         categories.filter(c => c !== "전체")
            .map(category => {
               const categoryId = categoryObjNum[category];
               return {
                  queryKey: ['categoryData', categoryId, pageSize],
                  queryFn: () => loadeventForMain(categoryId, pageSize),
                  ...commonOptions
               }
            })
   });

   const handleCategoryChange = (category) => {
      setActiveCategory(category)
      navigate("/cate/" + categoryObjKor[category])
   }

   return (
      <main className="flex-grow container mx-auto px-4 py-8">
         {activeCategory === "전체" && (
            <div>
               <h1 className="text-2xl font-bold mb-6">전체 콘텐츠</h1>

               {categories
                  .filter((cat) => cat !== "전체")
                  .map((category) => {
                     const index = categoryObjNum[category] - 1;
                     const query = categoryQueries[index]; // 각 쿼리 추출

                     // 로딩 또는 에러 상태일 경우 처리
                     if (!query || query.isLoading) {
                        return (
                           <section key={category} className="mb-12">
                              <h2 className="text-xl font-semibold">{category}</h2>
                              <p>로딩 중...</p>
                           </section>
                        );
                     }
                     if (query.isError) {
                        return (
                           <section key={category} className="mb-12">
                              <h2 className="text-xl font-semibold">{category}</h2>
                              <p className="text-red-500">에러 발생: {query.error.message}</p>
                           </section>
                        );
                     }


                     return (
                        <section key={category} className="mb-12">
                           <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold">{category}</h2>

                              <button className="flex items-center text-sm text-primary hover:underline"
                                 onClick={() => handleCategoryChange(category)} >
                                 더보기 <ChevronRight className="w-4 h-4 ml-1" />
                              </button>
                           </div>


                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                              {query.data.map((event) => (
                                 <div key={event.title + event.id} className="group">
                                    <Link to={`/event/${event.id}`} className="block cursor-pointer">
                                       <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                          <img
                                             src={event.eventImages.find(img => img.imgOrder === 0)?.imgUrl || "/placeholder.svg"}
                                             width={400}
                                             height={300}
                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                          />
                                       </div>
                                    </Link>
                                    <div className="mt-2 flex justify-between items-start">
                                       <h3 className="text-base font-medium">
                                          <Link
                                             to={`/event/${event.id}`}
                                             className="hover:text-primary transition-colors"
                                          >
                                             {event.title}
                                          </Link>
                                       </h3>
                                       {!(event.id % 3) && (
                                          <Link
                                             to={`/src/pages/app/ticket/booking/${encodeURIComponent(event.id)}`}
                                             className="text-xs px-2 py-1 bg-primary text-white rounded-full hover:bg-primary/90 inline-block"                                          >
                                             예매하기
                                          </Link>
                                       )}
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.company}</p>
                                 </div>
                              ))}
                           </div>
                        </section>
                     );
                  })}
            </div>
         )}
      </main>

   )
}

