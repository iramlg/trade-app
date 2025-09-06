"use client";

interface Trade {
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
}

interface Portfolio {
  name: string;
  amount: number;
  trades?: Trade[];
}

interface Data {
  portfolios: Portfolio[];
}

interface DataContextType {
  data: Data | null;
  createPortfolio: (name: string, amount: number) => void;
  activePortfolio: string | null;
  setActivePortfolio: (portfolio: string) => void;
  addTradeToPortfolio: (portfolioName: string, trade: Trade) => void;
}

interface DataProviderProps {
  children: ReactNode;
}

import React, { createContext, useContext, useState, ReactNode } from "react";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Data | null>({portfolios: []});
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);


  const createPortfolio = (name: string, amount: number) => {
    if (!name || !amount) {
      return;
    }

    const newPortfolio: Portfolio = {
      name,
      amount,
      trades: [],
    };

    setData({
      ...data,
      portfolios: [...data!.portfolios, newPortfolio],
    });
  };

  const addTradeToPortfolio = (portfolioName: string, trade: Trade) => {
    if (!portfolioName || !trade) {
      return;
    }

    const portfolioIndex = data!.portfolios.findIndex((portfolio) => portfolio.name === portfolioName);

    if (portfolioIndex === -1) {
      return;
    }

    const newPortfolio = {
      ...data!.portfolios[portfolioIndex],
      trades: [...data!.portfolios[portfolioIndex].trades!, trade],
    };

    const newPortfolios = [...data!.portfolios];
    newPortfolios[portfolioIndex] = newPortfolio;

    setData({
      ...data,
      portfolios: newPortfolios,
    });
  }

  return (
    <DataContext.Provider value={{ data, createPortfolio, activePortfolio, setActivePortfolio, addTradeToPortfolio }}>
      {children}
    </DataContext.Provider>
  );
};
