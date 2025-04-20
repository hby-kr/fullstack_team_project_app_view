import {Link} from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import Header from "/src/components/header"

export default function FAQPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/public" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>홈으로 돌아가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">자주 묻는 질문</h1>

                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-lg font-medium mb-2">Q: 아트유는 어떤 서비스인가요?</h2>
                                <p className="text-gray-700">
                                    A: 아트유는 음악, 미술, 춤, 연기, 뮤지컬 등 다양한 예술 분야의 콘텐츠를 제공하고 예매할 수 있는
                                    플랫폼입니다. 예술 관련 정보를 쉽게 찾고, 공연이나 전시를 예매하며, 다른 예술 애호가들과 소통할 수
                                    있습니다.
                                </p>
                            </div>

                            <div className="border-b pb-4">
                                <h2 className="text-lg font-medium mb-2">Q: 회원가입은 어떻게 하나요?</h2>
                                <p className="text-gray-700">
                                    A: 홈페이지 우측 상단의 '회원가입' 버튼을 클릭하여 간단한 정보 입력 후 가입할 수 있습니다. 이메일 인증
                                    후 모든 서비스를 이용하실 수 있습니다.
                                </p>
                            </div>

                            <div className="border-b pb-4">
                                <h2 className="text-lg font-medium mb-2">Q: 예매한 티켓은 어떻게 확인하나요?</h2>
                                <p className="text-gray-700">
                                    A: 로그인 후 '마이페이지'에서 예매 내역을 확인할 수 있습니다. 예매 완료 시 등록된 이메일로도 예매
                                    정보가 발송됩니다.
                                </p>
                            </div>

                            <div className="border-b pb-4">
                                <h2 className="text-lg font-medium mb-2">Q: 예매 취소 및 환불 정책은 어떻게 되나요?</h2>
                                <p className="text-gray-700">
                                    A: 공연 3일 전까지는 전액 환불, 공연 1일 전까지는 50% 환불이 가능하며, 공연 당일에는 환불이
                                    불가합니다. 일부 공연은 별도의 환불 정책이 적용될 수 있으니 예매 전 확인해주세요.
                                </p>
                            </div>

                            <div className="border-b pb-4">
                                <h2 className="text-lg font-medium mb-2">Q: 단체 예매는 어떻게 하나요?</h2>
                                <p className="text-gray-700">
                                    A: 10명 이상 단체 예매 시 할인 혜택이 제공됩니다. 예매 페이지에서 인원 수를 선택하면 자동으로 할인이
                                    적용되며, 20명 이상의 대규모 단체는 고객센터로 문의해주세요.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium mb-2">Q: 마이페이지에서 어떤 기능을 이용할 수 있나요?</h2>
                                <p className="text-gray-700">
                                    A: 마이페이지에서는 예매 내역 확인, 프로필 관리, 관심 공연 저장, 리뷰 작성, 메시지 확인 등 다양한
                                    개인화 서비스를 이용하실 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">&copy; 2024 art U. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

