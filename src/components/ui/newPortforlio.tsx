"use client"

import * as React from "react"
import { PlusCircle } from 'lucide-react';
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewPortfolio() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors">
            <PlusCircle className="w-4 h-4" />
            Create Portfolio
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Portfolio</DialogTitle>
            <DialogDescription>
              Add a name and initial alocated ammount to create a new portfolio.
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
        <Button variant="outline">Create Portfolio</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Portfolio</DrawerTitle>
          <DrawerDescription>
            Add a name and initial allocated ammount to create a new portfolio.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm onFinish={() => setOpen(false)} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
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
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [showError, setShowerror] = React.useState(false);
  const { data, createPortfolio } = useData();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowerror(false);
    
    if (!name || !amount) {
      setShowerror(true);
      return;
    }

    const { portfolios } = data!;
    const portfolioExists = portfolios.some((portfolio) => portfolio.name === name);

    if (portfolioExists) {
      setShowerror(true);
      return;
    }

    try {
      const parsedAmount = parseFloat(amount);

      if (!parsedAmount) {
        setShowerror(true);
        return;
      }

      createPortfolio(name, parsedAmount);
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" onChange={(a) => setName(a.target.value)} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="amount">Initial Allocated Amount</Label>
        <Input id="amount" onChange={(a) => setAmount(a.target.value)} />
      </div>
      <Button type="submit" onClick={handleSubmit} >Save changes</Button>
      {showError && <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          - Please fill all fields.<br />
          - Please use only numbers on amount field.<br />
          - Portfolio name already exists.
        </AlertDescription>
      </Alert>}
    </form>
  )
}
