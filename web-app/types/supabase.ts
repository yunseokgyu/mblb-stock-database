export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            stock_data: {
                Row: {
                    symbol: string
                    name: string | null
                    sector: string | null
                    industry: string | null
                    market_cap: number | null
                    price: number | null
                    changes_percentage: number | null
                    financials: Json | null
                    valuation_metrics: Json | null
                    updated_at: string | null
                }
                Insert: {
                    symbol: string
                    name?: string | null
                    sector?: string | null
                    industry?: string | null
                    market_cap?: number | null
                    price?: number | null
                    changes_percentage?: number | null
                    financials?: Json | null
                    valuation_metrics?: Json | null
                    updated_at?: string | null
                }
                Update: {
                    symbol?: string
                    name?: string | null
                    sector?: string | null
                    industry?: string | null
                    market_cap?: number | null
                    price?: number | null
                    changes_percentage?: number | null
                    financials?: Json | null
                    valuation_metrics?: Json | null
                    updated_at?: string | null
                }
            }
            insider_trading: {
                Row: {
                    id: string
                    symbol: string | null
                    transaction_date: string | null
                    reporting_date: string | null
                    company: string | null
                    insider_name: string | null
                    transaction_type: string | null
                    securities_transacted: number | null
                    price: number | null
                    securities_owned: number | null
                    filing_url: string | null
                }
                Insert: {
                    id?: string
                    symbol?: string | null
                    transaction_date?: string | null
                    reporting_date?: string | null
                    company?: string | null
                    insider_name?: string | null
                    transaction_type?: string | null
                    securities_transacted?: number | null
                    price?: number | null
                    securities_owned?: number | null
                    filing_url?: string | null
                }
                Update: {
                    id?: string
                    symbol?: string | null
                    transaction_date?: string | null
                    reporting_date?: string | null
                    company?: string | null
                    insider_name?: string | null
                    transaction_type?: string | null
                    securities_transacted?: number | null
                    price?: number | null
                    securities_owned?: number | null
                    filing_url?: string | null
                }
            }
        }
    }
}
