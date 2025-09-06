"use client"

import * as React from "react"
import { TrendingUp, ChevronDownIcon } from 'lucide-react';
import { useData } from "@/context/Data"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Trade {
  ticker: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  date: string;
}

export function NewTrade() {
  const [open, setOpen] = React.useState(false)
  const { activePortfolio } = useData();
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
            <TrendingUp className="w-4 h-4" />
            New Trade
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Trade</DialogTitle>
            <DialogDescription>
              Add a new trade to the <b>{activePortfolio}</b> portfolio.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onFinish={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
          <TrendingUp className="w-4 h-4" />
          New Trade
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Trade</DrawerTitle>
          <DrawerDescription>
            Add a new trade to the <b>{activePortfolio}</b> portfolio.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm onFinish={() => setOpen(false)} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface ProfileFormProps extends React.ComponentProps<"form"> {
  onFinish?: () => void;
}

function ProfileForm({ className, onFinish }: ProfileFormProps) {
  const [tradeData, setTradeData] = React.useState<Trade>({
    ticker: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    date: "",
  });
  const [showError, setShowerror] = React.useState(false);
  const { activePortfolio, addTradeToPortfolio } = useData();
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowerror(false);

    if (!tradeData.ticker.length || !tradeData.entryPrice.length || !tradeData.exitPrice.length || !tradeData.quantity.length || !tradeData.date.length) {
      setShowerror(true);
      return;
    }

    try {
      const parseEntryPrice = parseFloat(tradeData.entryPrice);
      const parsedEXitPrice = parseFloat(tradeData.exitPrice);
      const parsedQuantity = parseFloat(tradeData.quantity);

      if (!parseEntryPrice || !parsedEXitPrice || !parsedQuantity) {
        setShowerror(true);
        return;
      }

      addTradeToPortfolio(activePortfolio!, {
        ticker: tradeData.ticker,
        entryPrice: parseEntryPrice,
        exitPrice: parsedEXitPrice,
        quantity: parsedQuantity,
        date: tradeData.date,
      });
      onFinish?.();
    } catch (error) {
      console.log(error);
      setShowerror(true);
      return;
    }
  }

  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="ticker">Ticker</Label>
        <Input id="ticker" onChange={(a) => setTradeData({ ...tradeData, ticker: a.target.value})} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="date">Date</Label>
        {/* <Input id="date" onChange={(a) => setTradeData({ ...tradeData, date: a.target.value})} /> */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className=" justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setTradeData({ ...tradeData, date: new Date(selectedDate).toISOString().split('T')[0]});
                  setDate(selectedDate);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="entryPrice">Entry Price</Label>
        <Input id="entryPrice" onChange={(a) => setTradeData({ ...tradeData, entryPrice: a.target.value})} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="exitPrice">Exit Price</Label>
        <Input id="exitPrice" onChange={(a) => setTradeData({ ...tradeData, exitPrice: a.target.value})} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" onChange={(a) => setTradeData({ ...tradeData, quantity: a.target.value})} />
      </div>
      <Button type="submit" onClick={handleSubmit} >Save changes</Button>
      {showError && <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          - Please fill all fields.<br />
          - Please use only numbers on Entry Price, Exit Price and Quantity fields.<br />
        </AlertDescription>
      </Alert>}
    </form>
  )
}
