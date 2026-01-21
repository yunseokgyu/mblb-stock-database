"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"

export function SearchBar() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any[]>([])
    const router = useRouter()

    React.useEffect(() => {
        const fetchStocks = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            const { data, error } = await supabase
                .from('stock_data')
                .select('symbol, name')
                .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
                .limit(10)

            if (data) {
                setResults(data)
            }
        }

        const timeoutId = setTimeout(() => {
            fetchStocks()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    onClick={() => setOpen(!open)}
                >
                    {value ? results.find((stock) => stock.symbol === value)?.symbol : "Search Ticker (e.g. AAPL)..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Search stocks..." onValueChange={setQuery} />
                    <CommandList>
                        <CommandEmpty>No stock found.</CommandEmpty>
                        <CommandGroup heading="Stocks">
                            {results.map((stock) => (
                                <CommandItem
                                    key={stock.symbol}
                                    value={stock.symbol}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        router.push(`/stock/${stock.symbol}`)
                                    }}
                                >
                                    {/* <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === stock.symbol ? "opacity-100" : "opacity-0"
                        )}
                        /> */}
                                    <div className="flex flex-col">
                                        <span className="font-bold">{stock.symbol}</span>
                                        <span className="text-xs text-muted-foreground">{stock.name}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
