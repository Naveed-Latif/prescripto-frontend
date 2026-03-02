import { createContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { doctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
// import axios from "axios";

const currencySymbol = "$";

const backendurl = import.meta.env.VITE_BACKEND_URL;

interface UserData {
  id: number;
  name: string;
  email: string;
  gender: string;
  role: string;
  profileColor: string;
  profileImage: string | null;
  profilePublicId: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  doctors: typeof doctors;
  currencySymbol: string;
  backendurl: string;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  loadUserData: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType>({
  doctors,
  currencySymbol,
  backendurl,
  token: "",
  setToken: () => {},
  userData: null,
  setUserData: () => {},
  loadUserData: async () => {},
});


interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState<UserData | null>(null);

  const loadUserData = async () => {
    try {
      const response = await axios.get(`${backendurl}/view-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status == 200) {
        setUserData(response.data.user);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error:", String(error));
      }
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (token && token.length > 0) {
      loadUserData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendurl,
    userData,
    setUserData,
    loadUserData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
