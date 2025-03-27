import {Link} from "react-router"
import { ArrowLeft } from "lucide-react"
import Header from "/src/components/header"

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>홈으로 돌아가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">이용약관</h1>

                        <div className="prose max-w-none">
                            <h2 className="text-xl font-semibold mt-6 mb-3">제 1 조 (목적)</h2>
                            <p>
                                이 약관은 아트유(이하 "회사"라 함)가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및
                                책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3">제 2 조 (정의)</h2>
                            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>
                                    "서비스"라 함은 회사가 제공하는 예술 관련 콘텐츠 제공, 예매 서비스, 커뮤니티 서비스 등을 의미합니다.
                                </li>
                                <li>
                                    "이용자"라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및
                                    비회원을 말합니다.
                                </li>
                                <li>
                                    "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며
                                    회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                                </li>
                                <li>"비회원"이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">제 3 조 (약관의 게시와 개정)</h2>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                                <li>회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                                <li>
                                    회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그
                                    적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                                </li>
                                <li>
                                    이용자는 개정된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 개정된 약관의 효력 발생일
                                    이후에도 서비스를 계속 사용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.
                                </li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">제 4 조 (서비스의 제공 및 변경)</h2>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>
                                    회사는 다음과 같은 서비스를 제공합니다.
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>예술 관련 콘텐츠 제공 서비스</li>
                                        <li>공연, 전시 등의 예매 서비스</li>
                                        <li>예술 관련 커뮤니티 서비스</li>
                                        <li>기타 회사가 정하는 서비스</li>
                                    </ul>
                                </li>
                                <li>
                                    회사는 서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용
                                    및 제공일자 등을 그 변경 전에 해당 서비스 초기화면에 게시합니다.
                                </li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">제 5 조 (서비스 이용계약의 성립)</h2>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>
                                    이용계약은 이용자가 약관의 내용에 대하여 동의를 하고 회사가 정한 가입 양식에 따라 회원정보를 기입한 후
                                    이용신청을 하고 회사가 이를 승낙함으로써 성립됩니다.
                                </li>
                                <li>
                                    회사는 다음 각 호에 해당하는 이용신청에 대하여는 이를 승낙하지 아니할 수 있습니다.
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>실명이 아니거나 타인의 명의를 이용하여 신청한 경우</li>
                                        <li>이용신청 시 필요한 정보를 허위로 기재한 경우</li>
                                        <li>사회의 안녕과 질서, 미풍양속을 저해할 목적으로 신청한 경우</li>
                                        <li>기타 회사가 정한 이용신청 요건이 미비된 경우</li>
                                    </ul>
                                </li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">제 6 조 (개인정보보호)</h2>
                            <p>
                                회사는 이용자의 개인정보 보호를 위하여 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의
                                개인정보처리방침이 적용됩니다. 단, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의
                                개인정보처리방침이 적용되지 않습니다.
                            </p>

                            <p className="mt-8 text-gray-600">본 이용약관은 2024년 3월 1일부터 시행됩니다.</p>
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

