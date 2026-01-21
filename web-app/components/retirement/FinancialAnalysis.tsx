import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatBilingual } from "@/lib/utils/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Table2, TrendingUp } from "lucide-react"

interface FinancialAnalysisProps {
    stock: any;
}

// Helper to generate 5 years of simulated financial history
// proportional to the current values with some variation
const generateFinancialHistory = (currentFinancials: any) => {
    const years = [2021, 2022, 2023, 2024, "LTM"];
    const growthRates = [0.85, 0.92, 0.95, 1.0, 1.05]; // Simulated trend

    // Base values (fallback to 0 if missing)
    const revenue = currentFinancials?.revenue || 0;
    const netIncome = currentFinancials?.netIncome || 0;
    const grossProfit = currentFinancials?.grossProfits || 0;

    return years.map((year, i) => {
        // Add some random variance to make it look realistic
        const variance = 0.95 + Math.random() * 0.1;
        const factor = growthRates[i] * variance;

        // For LTM, use the actual current values
        if (year === "LTM") {
            return {
                year: "LTM",
                revenue,
                netIncome,
                grossProfit,
                profitMargin: revenue ? (netIncome / revenue) * 100 : 0
            };
        }

        // For past years, scale down
        return {
            year: year.toString(),
            revenue: revenue * factor * 0.8, // Assuming growth over time
            netIncome: netIncome * factor * 0.75,
            grossProfit: grossProfit * factor * 0.8,
            profitMargin: revenue ? (netIncome / revenue) * 100 : 0
        };
    });
};

export function FinancialAnalysis({ stock }: FinancialAnalysisProps) {
    const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
    const data = generateFinancialHistory(stock.financials);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs">
                    <p className="font-bold mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name === "revenue" ? "Revenue" : "Net Income"}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    {formatBilingual("5년 재무 성장 추이", "5-Year Financial Growth")}
                </h5>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-7 p-0 ${viewMode === "chart" ? "bg-white shadow-sm" : "hover:bg-slate-200"}`}
                        onClick={() => setViewMode("chart")}
                    >
                        <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-7 p-0 ${viewMode === "table" ? "bg-white shadow-sm" : "hover:bg-slate-200"}`}
                        onClick={() => setViewMode("table")}
                    >
                        <Table2 className="w-3.5 h-3.5 text-slate-600" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                {viewMode === "chart" ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${(value / 1e9).toFixed(0)}B`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="netIncome" name="Net Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[60px] text-[10px] h-8 text-slate-400 font-medium">Year</TableHead>
                                    <TableHead className="text-right text-[10px] h-8 text-slate-400 font-medium">Revenue</TableHead>
                                    <TableHead className="text-right text-[10px] h-8 text-slate-400 font-medium">Net Inc</TableHead>
                                    <TableHead className="text-right text-[10px] h-8 text-slate-400 font-medium hidden sm:table-cell">Margin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.year} className="hover:bg-transparent border-slate-50">
                                        <TableCell className="font-medium text-xs py-2 text-slate-700">{row.year}</TableCell>
                                        <TableCell className="text-right text-xs py-2 text-slate-600">{formatCurrency(row.revenue).split('.')[0]}</TableCell>
                                        <TableCell className="text-right text-xs py-2 text-green-600 font-medium">{formatCurrency(row.netIncome).split('.')[0]}</TableCell>
                                        <TableCell className="text-right text-xs py-2 text-slate-500 hidden sm:table-cell">{row.profitMargin.toFixed(1)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <p className="text-[10px] text-slate-400 mt-3 text-center">
                * {formatBilingual("과거 데이터는 추정치이며 실제와 다를 수 있습니다.", "Historical data is simulated and may differ from actuals.")}
            </p>
        </div>
    )
}
