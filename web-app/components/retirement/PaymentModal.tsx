import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
    if (!isOpen) return null;

    const handleOneTimePayment = () => {
        // Mock Payment Process
        const confirmed = window.confirm("20,000원을 결제하시겠습니까? (테스트 결제)")
        if (confirmed) {
            onPaymentSuccess()
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-lg shadow-2xl border-2 border-primary">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/5">
                        <Crown className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">프리미엄 리포트 생성</CardTitle>
                    <CardDescription>전문가 수준의 포트폴리오 분석을 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Option 1: One-time */}
                        <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-primary cursor-pointer transition-all bg-white hover:bg-slate-50" onClick={handleOneTimePayment}>
                            <div className="text-center space-y-2">
                                <Badge variant="outline" className="mb-2">추천</Badge>
                                <h3 className="font-bold text-lg">1회 리포트 구매</h3>
                                <div className="text-2xl font-bold text-slate-800">₩20,000</div>
                                <p className="text-xs text-muted-foreground">건당 결제 / 영구 소장</p>
                            </div>
                        </div>

                        {/* Option 2: Subscription */}
                        <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-4 cursor-pointer transition-all" onClick={() => alert("구독 기능은 준비 중입니다.")}>
                            <div className="text-center space-y-2">
                                <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-pink-500">BEST</Badge>
                                <h3 className="font-bold text-lg">월 구독 멤버십</h3>
                                <div className="text-2xl font-bold text-slate-800">₩19,900<span className="text-sm font-normal text-muted-foreground">/월</span></div>
                                <p className="text-xs text-muted-foreground">월 10회 생성 무료</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-muted-foreground pt-4">
                        * 구독 회원은 월 10회의 프리미엄 리포트를 무료로 생성할 수 있습니다.<br />
                        * 1회 구매 시 해당 리포트는 PDF로 저장 가능합니다.
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-center">
                    <Button variant="ghost" onClick={onClose}>닫기</Button>
                </div>
            </Card>
        </div>
    )
}
