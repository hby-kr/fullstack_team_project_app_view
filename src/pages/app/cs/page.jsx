"use client"

import Header from "/src/components/header"

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">고객센터</h1>
        </div>

        <div className="space-y-8">
          {/* 결제 목록 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">결제 목록</h2>
            <div className="space-y-2">
              {/* 예시 결제 목록 데이터 */}
              {[
                { id: 1, name: "구독 서비스", date: "2024-03-01", amount: "15,000원" },
                { id: 2, name: "추가 크레딧", date: "2024-02-20", amount: "5,000원" },
              ].map((payment) => (
                <div key={payment.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="text-gray-700 font-medium">{payment.name}</p>
                    <p className="text-sm text-gray-500">{`결제일: ${payment.date}`}</p>
                  </div>
                  <div className="text-gray-800 font-semibold">{payment.amount}</div>
                  <button className="ml-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
                    문의하기
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 단순 문의하기 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">문의하기</h2>
            <p className="text-gray-600 mb-4">결제와 관련 없는 일반적인 문의가 필요하다면, 아래 버튼을 눌러 주세요.</p>
            <button className="px-6 py-3 bg-primary text-white rounded-md font-semibold text-lg hover:bg-primary/90">
              문의하기
            </button>
          </section>

          {/* 문의 내역 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">문의 내역</h2>

            <div className="space-y-4">
              {/* 예시 문의 내역 데이터 */}
              {[
                {
                  id: 1,
                  subject: "결제 환불 요청",
                  status: "처리 중",
                  date: "2024-03-02",
                },
                {
                  id: 2,
                  subject: "서비스 사용법 문의",
                  status: "완료",
                  date: "2024-02-28",
                },
              ].map((inquiry) => (
                <div key={inquiry.id} className="border rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-gray-700 font-medium">{inquiry.subject}</p>
                    <p className="text-sm text-gray-500">{`문의일: ${inquiry.date}`}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      inquiry.status === "처리 중" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

