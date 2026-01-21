"use client"

import * as PortOne from "@portone/browser-sdk/v2";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// NOTE: In production, these should be environment variables
const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-4ff4af41-85e3-4573-956c-03290680654b";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

interface PaymentButtonProps {
    userEmail?: string;
    userId?: string;
    amount: number;
    planName: string;
    targetTier: string;
}

export default function PaymentButton({ userEmail, userId, amount, planName, targetTier }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

        setLoading(true);

        const paymentId = `ORD-${new Date().getTime()}-${Math.random().toString(36).slice(2, 9)}`;

        try {
            const response = await PortOne.requestPayment({
                storeId: STORE_ID,
                channelKey: CHANNEL_KEY,
                paymentId: paymentId,
                orderName: planName,
                totalAmount: amount,
                currency: "CURRENCY_KRW",
                payMethod: "CARD",
                customer: {
                    fullName: "Customer",
                    phoneNumber: "010-1234-5678",
                    email: userEmail,
                },
                redirectUrl: window.location.origin + "/payment/redirect",
            });

            if (response?.code != null) {
                console.error("Payment Error:", response);
                alert(`결제 실패: ${response.message}`);
                return;
            }

            // Send to server to verify
            const verifyRes = await axios.post("/api/payment/complete", {
                paymentId: response?.paymentId || paymentId,
                userId: userId,
                targetTier: targetTier, // Send tier info
                amount: amount // Send amount for verification
            });

            if (verifyRes.data.success) {
                alert(`결제가 완료되었습니다! ${planName} 회원이 되신 것을 환영합니다.`);
                router.refresh();
                router.push("/");
            } else {
                alert("결제 검증에 실패했습니다. 관리자에게 문의해주세요.");
            }

        } catch (error) {
            console.error(error);
            alert("결제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-12 text-lg shadow-lg"
        >
            {loading ? "결제창 호출 중..." : `${planName} 시작하기`}
        </Button>
    )
}
