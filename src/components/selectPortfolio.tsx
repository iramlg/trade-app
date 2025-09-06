"use client"
import * as React from "react"
import { useData } from "@/context/Data"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectPortfolio() {
  const { data, setActivePortfolio } = useData();
  const { portfolios } = data!;

  return (
    <Select onValueChange={(value) => setActivePortfolio(value)} disabled={portfolios.length === 0}>
      <SelectTrigger className="w-full md:w-[200px] h-[50px] inline-flex gap-2 p-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors">
        <SelectValue placeholder="Select a portfolio" />
      </SelectTrigger>
      <SelectContent>
        {portfolios.map((portfolio) => (
          <SelectItem key={portfolio.name} value={portfolio.name}>{portfolio.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
              