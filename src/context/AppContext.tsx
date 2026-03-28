import { createContext, useCallback, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { UserData, Doctor, Pagination, DoctorFilters } from "../Types";

const currencySymbol = "$";

const backendurl = import.meta.env.VITE_BACKEND_URL;

interface AppContextType {
  doctors: Doctor[];
  doctorsPagination: Pagination | null;
  loadDoctors: (page?: number, filters?: DoctorFilters) => Promise<void>;
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
  doctors: [],
  doctorsPagination: null,
  loadDoctors: async () => {},
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsPagination, setDoctorsPagination] = useState<Pagination | null>(
    null,
  );

  const loadUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendurl}/view-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status == 200) {
        const user = response.data.user;
        // Backend returns addresses as a JSON string — parse it into a real array
        if (typeof user.addresses === "string") {
          try {
            user.addresses = JSON.parse(user.addresses);
          } catch {
            user.addresses = [];
          }
        }
        setUserData(user);
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
  }, [token]);

  const loadDoctors = useCallback(
    async (page: number = 1, filters?: DoctorFilters) => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));

        if (filters) {
          if (filters.specialties && filters.specialties.length > 0) {
            params.set("specialties", filters.specialties.join(","));
          }
          if (filters.min_fee !== undefined) {
            params.set("min_fee", String(filters.min_fee));
          }
          if (filters.max_fee !== undefined) {
            params.set("max_fee", String(filters.max_fee));
          }
          if (filters.min_rating !== undefined) {
            params.set("min_rating", String(filters.min_rating));
          }
          if (filters.max_rating !== undefined) {
            params.set("max_rating", String(filters.max_rating));
          }
          if (filters.gender) {
            params.set("gender", filters.gender);
          }
          if (filters.sort_by) {
            params.set("sort_by", filters.sort_by);
          }
          if (filters.name) {
            params.set("name", filters.name);
          }
        }

        const response = await axios.get(
          `${backendurl}/doctors?${params.toString()}`,
        );
        if (response.data.status === 200) {
          setDoctors(response.data.doctors);
          if (response.data.pagination) {
            setDoctorsPagination(response.data.pagination);
          }
        } else {
          toast.error("Failed to load doctors");
          console.log(response);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Error:", String(error));
        }
        toast.error("Something went wrong. Please try again.");
      }
    },
    [],
  );

  useEffect(() => {
    if (token && token.length > 0) {
      const fetchUser = async () => {
        await loadUserData();
      };
      fetchUser();
    } else {
      const fetchUser = () => {
        setUserData(null);
      };
      fetchUser();
    }
  }, [token, loadUserData]);

  useEffect(() => {
    const fetchDoctors = async () => {
      await loadDoctors();
    };
    fetchDoctors();
  }, [loadDoctors]);

  const value = {
    doctors,
    doctorsPagination,
    loadDoctors,
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
