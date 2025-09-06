import { NewPortfolio } from "@/components/ui/newPortforlio"
import { PortfolioWealth } from "@/components/ui/porfolioWealth"
import { SelectPortfolio } from "@/components/ui/selectPortfolio"
import { TradeList } from "@/components/ui/tradeList"

export default function Home() {

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <main className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Trading Portfolio</h1>
              <p className="text-slate-600">Track and manage your trading performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <NewPortfolio />
              <SelectPortfolio />
            </div>
          </div>
        </div>
        <PortfolioWealth />
        <TradeList />
      </main>
    </div>
  );
}
