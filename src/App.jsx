import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from './pages/app/page.jsx'
import LoginPage from "./pages/app/login/page.jsx";
import BookingPage from "./pages/app/booking/[id]/page.jsx";
import ReviewPage from "./pages/app/booking/[id]/review/page.jsx";
import CartPage from "./pages/app/cart/page.jsx";
import CouponPage from "./pages/app/coupon/page.jsx";
import CsPage from "./pages/app/cs/page.jsx";
import DetailPage from "./pages/app/detail/[id]/page.jsx";
import MessagesPage from "./pages/app/messages/page.jsx";
import MessagesNewPage from "./pages/app/messages/new/page.jsx";
import MessagesIdPage from "./pages/app/messages/[id]/page.jsx";
import NotificationsPage from "./pages/app/notifications/page.jsx";
import PointPage from "./pages/app/point/page.jsx";
import PostsCreatePage from "./pages/app/posts/create/page.jsx";
import PostsCreateBookingPage from "./pages/app/posts/create-booking/page.jsx";
import PostsEditPage from "./pages/app/posts/edit/[id]/page.jsx";
import PostsHistoryPage from "./pages/app/posts/history/page.jsx";
import ProfilePage from "./pages/app/profile/edit/page.jsx";
import PurchasePage from "./pages/app/purchase/page.jsx";
import SettingsPage from "./pages/app/settings/page.jsx";
import SignupPage from "./pages/app/signup/page.jsx"; //회원가입 페이지
import MyPage from "./pages/app/mypage/page.jsx";
import Header from "./components/header.jsx";
import ContactPage from "./pages/app/contact/page.jsx";
import FaqPage from "./pages/app/faq/page.jsx";
import PrivacyPage from "./pages/app/privacy/page.jsx";
import TermsPage from "./pages/app/terms/page.jsx";
import All from "./pages/app/(main)/page.jsx";
import CategoryPage from "./pages/app/(main)/category/page.jsx";
import WidgetPage from "./pages/app/mypage/widget/page.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>

                    {/* 기본 */}
                    <Route path="/" element={<HomePage></HomePage>}>
                        <Route path={""} element={<All/>}/>
                        <Route path="cate/:category" element={<CategoryPage/>}/>
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
                    <Route path="/mypage/widget" element={<WidgetPage></WidgetPage>}/>
                    <Route path="/settings" element={<SettingsPage></SettingsPage>}/>

                    {/* 메세지, 알림 */}
                    <Route path="/messages" element={<MessagesPage></MessagesPage>}/>
                    <Route path="/messages/new" element={<MessagesNewPage></MessagesNewPage>}/>
                    <Route path="/messages/:id" element={<MessagesIdPage></MessagesIdPage>}/>
                    <Route path="/notifications" element={<NotificationsPage></NotificationsPage>}/>

                    {/* 공연 관련 */}
                    <Route path="/detail/:id" element={<DetailPage></DetailPage>}/>
                    <Route path="/booking/:id" element={<BookingPage></BookingPage>}/>
                    <Route path="/booking/:id/review" element={<ReviewPage></ReviewPage>}/>

                    {/* 결제 관련 */}
                    <Route path="/cart" element={<CartPage></CartPage>}/>
                    <Route path="/coupon" element={<CouponPage></CouponPage>}/>
                    <Route path="/point" element={<PointPage></PointPage>}/>
                    <Route path="/purchase" element={<PurchasePage></PurchasePage>}/>

                    {/* 고객센터 관련 */}
                    <Route path="/cs" element={<CsPage></CsPage>}/> {/* 이 페이지 연결 안되어 있음  */}
                    <Route path="/faq" element={<FaqPage></FaqPage>}/>
                    <Route path="/contact" element={<ContactPage></ContactPage>}/>
                    <Route path="/terms" element={<TermsPage></TermsPage>}/>
                    <Route path="/privacy" element={<PrivacyPage></PrivacyPage>}/>

                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
