"use client";

import { useState, useEffect } from "react";
import {Link} from "react-router"
import Header from "/src/components/header";

export default function PaymentHistoryPage() {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // 초기 paymentHistory 데이터를 localStorage에 저장
    const initialPaymentHistory = [
      {
        id: "음악-1",
        title: "봄의 선율: 클래식 음악회",
        image: "/images/concert.jpg",
        date: "2024-03-15",
        time: "19:30",
        ticketType: "VIP",
        ticketCount: 2,
        totalPrice: 176000,
        isCancelled: false,
      },
    ];

    // localStorage에 해당 키가 없는 경우에만 초기 데이터 저장
    if (!localStorage.getItem("paymentHistory")) {
      localStorage.setItem("paymentHistory", JSON.stringify(initialPaymentHistory));
    }
  }, []);

  useEffect(() => {
    // 로컬 스토리지 또는 API에서 결제 내역을 불러오는 로직
    const storedHistory = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
    setPaymentHistory(storedHistory);
  }, []);

  const cancelPayment = (id) => {
    if (confirm("정말로 이 결제를 취소하시겠습니까?")) {
      const updatedHistory = paymentHistory.map((item) =>
        item.id === id ? { ...item, isCancelled: true } : item
      );
      setPaymentHistory(updatedHistory);
      localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory));
      alert("결제가 취소되었습니다.");
    }
  };

  if (paymentHistory.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">결제 내역이 없습니다.</p>
          <Link to="/" className="text-primary hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">결제 내역</h1>
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className={`border rounded-lg p-4 bg-white ${payment.isCancelled ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg border overflow-hidden">
                  <img src={payment.img} alt={payment.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{payment.title}</h2>
                  <p className="text-sm text-gray-600">
                    {payment.date} {payment.time} / {payment.ticketType} {payment.ticketCount}매
                  </p>
                  <p className="text-sm text-gray-600">총 금액: {payment.totalPrice.toLocaleString()}원</p>
                  {payment.isCancelled && <p className="text-sm text-red-500 mt-2">결제가 취소되었습니다.</p>}
                </div>
                <div className="flex flex-col gap-2">
                  {/* "리뷰 작성" 버튼 */}
                  {!payment.isCancelled && (
                    <Link
                      to={`/booking/${payment.id}/review`}
                      className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 text-center"
                    >
                      리뷰 작성
                    </Link>
                  )}
                  {/* "결제 취소" 버튼 */}
                  {!payment.isCancelled && (
                    <button
                      onClick={() => cancelPayment(payment.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      결제 취소
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

