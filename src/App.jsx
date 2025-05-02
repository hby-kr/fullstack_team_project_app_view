import './styles/App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SettingsProvider} from './lib/settings-context.jsx';

import MainPage from './pages/app/main/MainPage.jsx'
import LoginPage from "./pages/app/base/Login.jsx";
import BookingPage from "./pages/app/ticket/booking/[id]/page.jsx";
import ReviewPage from "./pages/app/ticket/booking/[id]/review/page.jsx";
import CartPage from "./pages/app/ticket/Cart.jsx";
import CouponPage from "./pages/app/ticket/Coupon.jsx";
import CsPage from "./pages/app/personal/CsPage.jsx";
import DetailPage from "./pages/app/Events/EventDetailPage.jsx";
import MessagesPage from "./pages/app/base/messages/page.jsx";
import MessagesNewPage from "./pages/app/base/messages/new/page.jsx";
import MessagesIdPage from "./pages/app/base/messages/[id]/page.jsx";
import NotificationsPage from "./pages/app/base/Notifications.jsx";
import PointPage from "./pages/app/ticket/Point.jsx";
import PostsCreatePage from "./pages/app/personal/posts/create/page.jsx";
import PostsCreateBookingPage from "./pages/app/personal/posts/create-booking/page.jsx";
import PostsEditPage from "./pages/app/personal/posts/edit/[id]/page.jsx";
import PostsHistoryPage from "./pages/app/personal/posts/history/page.jsx";
import ProfilePage from "./pages/app/personal/profile/edit/page.jsx";
import PurchasePage from "./pages/app/ticket/Purchase.jsx";
import SettingsPage from "./pages/app/personal/Settings.jsx";
import SignupPage from "./pages/app/base/Signup.jsx"; //회원가입 페이지
import MyPage from "./pages/app/personal/mypage/page.jsx";
import Header from "./components/header.jsx";
import ContactPage from "./pages/app/ServiceInfo/Contact.jsx";
import FaqPage from "./pages/app/ServiceInfo/FAQ.jsx";
import PrivacyPage from "./pages/app/ServiceInfo/Privacy.jsx";
import TermsPage from "./pages/app/ServiceInfo/Terms.jsx";
import All from "./pages/app/main/AllEvents.jsx";
import CategoryPage from "./pages/app/Events/CategoryPage.jsx";
import WidgetEdit from "./pages/app/widget/edit/page.jsx";
import WidgetAdd from "./pages/app/widget/add/page.jsx";
import FolloweePage from "./pages/app/personal/mypage/followee/page.jsx";
import FollowerPage from "./pages/app/personal/mypage/follower/page.jsx";
import PaymentPage from "./pages/app/booking/payments/page.jsx";

function App() {

   return (
      <SettingsProvider>
         <BrowserRouter>
            <Header/>

            <Routes>

               {/* 기본 */}
               <Route path="/" element={<MainPage></MainPage>}> {/* 중첩 라우팅(Nested Routing)  */}
                  <Route path={""} element={<All/>}/> {/*  path 그 안에 아무 서브 경로가 없으면 <All />이 보여지고 */}
                  <Route path="cate/:category"
                         element={<CategoryPage/>}/> {/* /cate/abc 이런 식으로 들어오면 <CategoryPage />가 보여짐.  */}
               </Route>

               <Route path="/login" element={<LoginPage></LoginPage>}/>
               <Route path="/signup" element={<SignupPage></SignupPage>}/>

               {/* 개인 패이지, 포스팅, 개인설정 */}
               <Route path="/posts/create" element={<PostsCreatePage></PostsCreatePage>}/>
               <Route path="/posts/create-booking" element={<PostsCreateBookingPage></PostsCreateBookingPage>}/>
               <Route path="/posts/edit/:id" element={<PostsEditPage></PostsEditPage>}/>
               <Route path="/posts/history" element={<PostsHistoryPage></PostsHistoryPage>}/>
               <Route path="/profile/edit" element={<ProfilePage></ProfilePage>}/>
               <Route path="/mypage" element={<MyPage></MyPage>}/>
               <Route path="/widget/edit" element={<WidgetEdit/>}/>
               <Route path="/widget/add" element={<WidgetAdd/>}/>
               <Route path="/settings" element={<SettingsPage></SettingsPage>}/>
               <Route path="/cs" element={<CsPage></CsPage>}/> {/* 이 페이지 연결 안되어 있음  */}
               <Route path="/follower" element={<FollowerPage></FollowerPage>}/>
               <Route path="/followee" element={<FolloweePage></FolloweePage>}/>

               <Route path="/settings" element={<SettingsPage></SettingsPage>}/>

               {/* 메세지, 알림 */}
               <Route path="/messages" element={<MessagesPage></MessagesPage>}/>
               <Route path="/messages/new" element={<MessagesNewPage></MessagesNewPage>}/>
               <Route path="/messages/:id" element={<MessagesIdPage></MessagesIdPage>}/>
               <Route path="/notifications" element={<NotificationsPage></NotificationsPage>}/>

               {/* 공연 관련 */}
               <Route path="/event/:id" element={<DetailPage></DetailPage>}/>
               <Route path="/booking/:id" element={<BookingPage></BookingPage>}/>
               <Route path="/booking/:id/review" element={<ReviewPage></ReviewPage>}/>

               {/* 결제 관련 */}
               <Route path="/cart" element={<CartPage></CartPage>}/>
               <Route path="/coupon" element={<CouponPage></CouponPage>}/>
               <Route path="/point" element={<PointPage></PointPage>}/>
               <Route path="/purchase" element={<PurchasePage></PurchasePage>}/>
               <Route path="/payment" element={<PaymentPage/>}/>

               {/* 고객센터 관련 */}
               <Route path="/faq" element={<FaqPage></FaqPage>}/>
               <Route path="/contact" element={<ContactPage></ContactPage>}/>
               <Route path="/terms" element={<TermsPage></TermsPage>}/>
               <Route path="/privacy" element={<PrivacyPage></PrivacyPage>}/>

            </Routes>


         </BrowserRouter>
      </SettingsProvider>
   )
}

export default App
