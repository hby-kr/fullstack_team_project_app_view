import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from './pages/app/page.jsx'
import LoginPage from "./pages/app/login/page.jsx";
import AdminPage from "./pages/app/admin/page.jsx";
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
import SettingsBeforePage from "./pages/app/settings/before/page.jsx";
import SignupPage from "./pages/app/signup/page.jsx"; //회원가입 페이지
import MyPage from "./pages/app/mypage/page.jsx";
import Header from "./components/header.jsx";
import ContactPage from "./pages/app/contact/page.jsx";
import FaqPage from "./pages/app/faq/page.jsx";
import PrivacyPage from "./pages/app/privacy/page.jsx";
import TermsPage from "./pages/app/terms/page.jsx";
import All from "./pages/app/(main)/page.jsx";
import CategoryPage from "./pages/app/(main)/category/page.jsx";




function App() {

    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage></HomePage>}>
                        <Route path={""} element={<All/>}/>
                        <Route path="cate/:category" element={<CategoryPage/>}/>
                    </Route>
                    <Route path="/login" element={<LoginPage></LoginPage>}/>
                    <Route path="/admin" element={<AdminPage></AdminPage>}/>
                    <Route path="/booking/:id" element={<BookingPage></BookingPage>}/>
                    <Route path="/booking/:id/review" element={<ReviewPage></ReviewPage>}/>
                    <Route path="/cart" element={<CartPage></CartPage>}/>
                    <Route path="/coupon" element={<CouponPage></CouponPage>}/>
                    <Route path="/cs" element={<CsPage></CsPage>}/>
                    <Route path="/detail/:id" element={<DetailPage></DetailPage>}/>
                    <Route path="/messages" element={<MessagesPage></MessagesPage>}/>
                    <Route path="/messages/new" element={<MessagesNewPage></MessagesNewPage>}/>
                    <Route path="/messages/:id" element={<MessagesIdPage></MessagesIdPage>}/>
                    <Route path="/notifications" element={<NotificationsPage></NotificationsPage>}/>
                    <Route path="/point" element={<PointPage></PointPage>}/>
                    <Route path="/posts/create" element={<PostsCreatePage></PostsCreatePage>}/>
                    <Route path="/posts/create-booking" element={<PostsCreateBookingPage></PostsCreateBookingPage>}/>
                    <Route path="/posts/edit/:id" element={<PostsEditPage></PostsEditPage>}/>
                    <Route path="/posts/history" element={<PostsHistoryPage></PostsHistoryPage>}/>
                    <Route path="/profile/edit" element={<ProfilePage></ProfilePage>}/>
                    <Route path="/purchase" element={<PurchasePage></PurchasePage>}/>
                    <Route path="/settings" element={<SettingsPage></SettingsPage>}/>
                    <Route path="/signup" element={<SignupPage></SignupPage>}/>
                    <Route path="/mypage" element={<MyPage></MyPage>}/>
                    <Route path="/contact" element={<ContactPage></ContactPage>}/>
                    <Route path="/faq" element={<FaqPage></FaqPage>}/>
                    <Route path="/privacy" element={<PrivacyPage></PrivacyPage>}/>
                    <Route path="/terms" element={<TermsPage></TermsPage>}/>
                    <Route path="/settings" element={<SettingsPage></SettingsPage>}/>
                    <Route path="/settings/before" element={<SettingsBeforePage></SettingsBeforePage>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
