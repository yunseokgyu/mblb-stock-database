import { Badge } from "@/components/ui/badge"
import { formatBilingual } from "@/lib/utils/format"

interface ReportHeaderProps {
    userName?: string;
    isPremium: boolean;
    date: string;
}

export function ReportHeader({ userName = "Guest", isPremium, date }: ReportHeaderProps) {
    return (
        <div className="bg-slate-900 text-white p-8 rounded-t-xl flex justify-between items-end print:rounded-none">
            <div>
                <h2 className="text-3xl font-bold font-serif mb-2 tracking-wide">
                    INVESTMENT REPORT
                </h2>
                <p className="text-slate-400 text-sm font-light">
                    {formatBilingual("수신", "Prepared for")}: <span className="text-white font-medium">{isPremium ? "PREMIUM MEMBER" : userName}</span> •
                    {formatBilingual("발행일", "Date")}: <span className="text-white font-medium">{date}</span>
                </p>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Portfolio Rating</div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                    A+
                </div>
            </div>
        </div>
    )
}
