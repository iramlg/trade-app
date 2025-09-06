"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useData } from "@/context/Data"
import { usdFormatter } from "@/lib/utils"

const thClass = 'px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider';
const tdClass = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900';

export function TradeList() {
  const { data, activePortfolio } = useData();
  const { portfolios } = data!;

  if (!activePortfolio) {
    return null;
  }

  const portfolio = portfolios.find((portfolio) => portfolio.name === activePortfolio);
  const { trades } = portfolio!;

  if (!trades || trades.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Recent Trades</h2>
        <p className="text-sm text-slate-500 mt-1">A list of your recent trades</p>
      </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={thClass}>Ticker</TableHead>
          <TableHead className={thClass}>Date</TableHead>
          <TableHead className={thClass}>Entry Price</TableHead>
          <TableHead className={thClass}>Exit Price</TableHead>
          <TableHead className={thClass}>Quantity</TableHead>
          <TableHead className={thClass}>PnL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-200">
        {trades.map((trade) => (
          <TableRow key={trade.ticker + trade.date}  className="hover:bg-slate-50 transition-colors">
            <TableCell className={`${tdClass} text-lg`}>{trade.ticker}</TableCell>
            <TableCell className={tdClass}>{trade.date}</TableCell>
            <TableCell className={tdClass}>{usdFormatter.format(trade.entryPrice)}</TableCell>
            <TableCell className={tdClass}>{usdFormatter.format(trade.exitPrice)}</TableCell>
            <TableCell className={tdClass}>{trade.quantity}</TableCell>
            <TableCell className={tdClass}>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                trade.entryPrice < trade.exitPrice 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>{ usdFormatter.format((trade.exitPrice - trade.entryPrice) * trade.quantity)}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}
