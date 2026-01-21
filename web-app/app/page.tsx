"use client"

import { useState } from 'react';
import { SearchBar } from "@/components/SearchBar";
import Link from 'next/link';
import StockTreeMap from "@/components/StockTreeMap";
import StockRankingTable from "@/components/StockRankingTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [currentTab, setCurrentTab] = useState("all");

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
      {/* Header removed (moved to layout) */}

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-8">

        {/* Section: Market Map & Controls */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold whitespace-nowrap">S&P 500 시장 지도 (Market Map)</h2>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
              {/* Moved Tabs Here */}
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList>
                  <TabsTrigger value="all">Check All</TabsTrigger>
                  <TabsTrigger value="dividend">Dividend Kings</TabsTrigger>
                  <TabsTrigger value="etf">Major ETFs</TabsTrigger>
                </TabsList>
              </Tabs>

              <Link href="/retirement">
                <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-md whitespace-nowrap">
                  👑 은퇴상국 포트폴리오 짜기
                </Button>
              </Link>
            </div>
          </div>
          <StockTreeMap />
        </section>

        {/* Section: Ranking Table */}
        <section className="space-y-4 pt-8">
          {/* Pass currentTab filter to table */}
          <StockRankingTable fixedFilter={currentTab} />
        </section>

      </div>
    </main>
  );
}
