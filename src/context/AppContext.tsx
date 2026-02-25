import { createContext } from "react";
import { doctors } from "../assets/assets";
import type { ReactNode } from "react";

const currencySymbol = "$";
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext({
  doctors,
  currencySymbol,
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  
  const value = {
    doctors,
    currencySymbol,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
