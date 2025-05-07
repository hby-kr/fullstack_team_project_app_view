import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        // 페이지 로드 시 TossPayments SDK 초기화
        const script = document.createElement("script");
        script.src = "https://js.tosspayments.com/v2/standard";
        script.async = true;
        script.onload = () => {
            initializePayment();
        };
        document.body.appendChild(script);
    }, []);

    const initializePayment = async () => {
        if (!window.TossPayments) return;

        const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
        const tossPayments = window.TossPayments(clientKey);

        const customerKey = "v4HF38tNs6J2oM3jioMfa"; // 유저 식별자
        const widgets = tossPayments.widgets({ customerKey });

        const amount = parseInt(searchParams.get("totalPrice") || "1000", 10);

        await widgets.setAmount({
            currency: "KRW",
            value: amount,
        });

        await Promise.all([
            widgets.renderPaymentMethods({
                selector: "#payment-method",
                variantKey: "DEFAULT",
            }),
            widgets.renderAgreement({
                selector: "#agreement",
                variantKey: "AGREEMENT",
            }),
        ]);

        // 결제하기 버튼 클릭 이벤트 등록
        const paymentButton = document.getElementById("payment-button");
        paymentButton.addEventListener("click", async () => {
            try {
                await widgets.requestPayment({
                    orderId: "Jf-ak7kCZb8uBBPQ0iUcE", // 주문 ID (고유해야 함)
                    orderName: "토스 티셔츠 외 2건",
                    successUrl: `${window.location.origin}/success`, // 결제 성공시 이동
                    failUrl: `${window.location.origin}/fail`, // 결제 실패시 이동
                    customerEmail: "customer123@gmail.com",
                    customerName: "김토스",
                    customerMobilePhone: "01012341234",
                });
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <div>
            {/* 결제 UI 영역 */}
            <div id="payment-method" style={{ marginBottom: "20px" }}></div>
            {/* 이용약관 UI 영역 */}
            <div id="agreement" style={{ marginBottom: "20px" }}></div>
            {/* 결제 버튼 */}
            <button id="payment-button" style={{ marginTop: "30px" }}>
                결제하기
            </button>
        </div>
    );
};
