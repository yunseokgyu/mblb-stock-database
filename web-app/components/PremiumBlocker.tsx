import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function PremiumBlocker() {
    return (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/80 flex items-start justify-center z-50 backdrop-blur-md pt-[30vh]">
            <div className="text-center space-y-4 p-6 bg-slate-900/50 border border-slate-700 rounded-xl shadow-2xl max-w-md mx-4">
                <div className="flex justify-center">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">일일 무료 조회 한도 초과</h3>
                    <p className="text-slate-400 text-sm">
                        무료 회원은 하루 3개의 종목만 조회할 수 있습니다.<br />
                        프리미엄으로 업그레이드하고 무제한으로 이용하세요.
                    </p>
                </div>
                <div className="pt-2">
                    <Link href="/pricing">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                            프리미엄 시작하기 (월 9,900원)
                        </Button>
                    </Link>
                    <p className="text-xs text-slate-500 mt-3">
                        내일 다시 방문하면 무료로 조회할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    )
}
