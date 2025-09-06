"use client"

import { DollarSign } from 'lucide-react';
import { NewTrade } from "@/components/ui/newTrade"
import { useData } from "@/context/Data"

export function PortfolioWealth() {
  const { data, activePortfolio } = useData();
  const { portfolios } = data!;

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  if (!activePortfolio) {
    return null;
  }

  const portfolio = portfolios.find((portfolio) => portfolio.name === activePortfolio);
  const { trades } = portfolio!;

  const totalWealth = trades && trades.length > 0 ? portfolio!.amount + trades.reduce((acc, trade) => acc + (trade.exitPrice - trade.entryPrice) * trade.quantity, 0) : portfolio!.amount;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-semibold text-slate-900">{activePortfolio} Total Wealth</h3>
      </div>
      <p className={`text-2xl font-bold  ${
                totalWealth > 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>{usdFormatter.format(totalWealth)}</p>
      <p className="text-sm text-slate-500 mt-1 mb-4">Portfolio value</p>
      <NewTrade />
    </div>
  )
}
