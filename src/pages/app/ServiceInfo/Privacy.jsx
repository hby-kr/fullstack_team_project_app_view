import {Link} from "react-router"
import { ArrowLeft } from "lucide-react"
import Header from "/src/components/header"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/public" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>홈으로 돌아가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>

                        <div className="prose max-w-none">
                            <p className="mb-4">
                                아트유(이하 '회사')는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」등 관련 법령을 준수하기 위하여
                                노력하고 있습니다. 회사는 개인정보처리방침을 통하여 회사가 이용자로부터 수집하는 개인정보의 항목,
                                개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 개인정보의 제3자 제공 등에 관한 사항을
                                이용자에게 안내하고 있습니다.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-3">1. 수집하는 개인정보의 항목 및 수집방법</h2>
                            <h3 className="text-lg font-medium mt-4 mb-2">가. 수집하는 개인정보의 항목</h3>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>
                                    <strong>회원가입 시 수집항목</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>필수항목: 이메일 주소, 비밀번호, 이름(닉네임)</li>
                                        <li>선택항목: 프로필 이미지, 생년월일, 성별, 연락처, 주소</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>서비스 이용 과정에서 생성되는 정보</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>서비스 이용 기록, 접속 로그, 쿠키, IP 정보, 불량 이용 기록</li>
                                        <li>예매 내역, 결제 기록, 관심 콘텐츠 정보</li>
                                    </ul>
                                </li>
                            </ol>

                            <h3 className="text-lg font-medium mt-4 mb-2">나. 개인정보 수집방법</h3>
                            <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
                            <ul className="list-disc pl-6 space-y-1 mt-1">
                                <li>홈페이지 회원가입, 서비스 이용, 이벤트 참여</li>
                                <li>제휴 서비스, 단체 예매 신청</li>
                                <li>고객센터를 통한 상담 과정에서 수집</li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-3">2. 개인정보의 수집 및 이용목적</h2>
                            <p>회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다.</p>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>
                                    <strong>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>예매 및 결제 서비스, 티켓 발송, 공연 정보 제공</li>
                                        <li>콘텐츠 제공, 맞춤 서비스 제공</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>회원 관리</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>회원제 서비스 이용에 따른 본인확인, 개인식별</li>
                                        <li>불량회원의 부정이용 방지와 비인가 사용 방지</li>
                                        <li>가입의사 확인, 가입 및 가입횟수 제한</li>
                                        <li>만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인</li>
                                        <li>추후 법정 대리인 본인확인</li>
                                        <li>분쟁 조정을 위한 기록보존, 불만처리 등 민원처리</li>
                                        <li>고지사항 전달</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>신규 서비스 개발 및 마케팅·광고에의 활용</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                                        <li>통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
                                        <li>서비스의 유효성 확인</li>
                                        <li>이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
                                        <li>접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
                                    </ul>
                                </li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">3. 개인정보의 보유 및 이용기간</h2>
                            <p>
                                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단,
                                관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안
                                회원정보를 보관합니다.
                            </p>

                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>
                                    <strong>계약 또는 청약철회 등에 관한 기록</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                        <li>보존 기간: 5년</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>대금결제 및 재화 등의 공급에 관한 기록</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                        <li>보존 기간: 5년</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>소비자의 불만 또는 분쟁처리에 관한 기록</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>보존 근거: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                        <li>보존 기간: 3년</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>웹사이트 방문기록</strong>
                                    <ul className="list-disc pl-6 space-y-1 mt-1">
                                        <li>보존 근거: 통신비밀보호법</li>
                                        <li>보존 기간: 3개월</li>
                                    </ul>
                                </li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-3">4. 개인정보의 파기절차 및 방법</h2>
                            <p>
                                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차
                                및 방법은 다음과 같습니다.
                            </p>
                            <ol className="list-decimal pl-6 space-y-2 mt-2">
                                <li>
                                    <strong>파기절차</strong>
                                    <p className="mt-1">
                                        이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련
                                        법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
                                    </p>
                                </li>
                                <li>
                                    <strong>파기방법</strong>
                                    <p className="mt-1">
                                        전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 종이에
                                        출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                                    </p>
                                </li>
                            </ol>

                            <h2 className="text-xl font-semibold mt-6 mb-3">5. 개인정보 제공</h2>
                            <p>
                                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
                            </p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>이용자들이 사전에 동의한 경우</li>
                                <li>
                                    법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                                </li>
                            </ul>

                            <p className="mt-8 text-gray-600">본 개인정보처리방침은 2024년 3월 1일부터 적용됩니다.</p>
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

