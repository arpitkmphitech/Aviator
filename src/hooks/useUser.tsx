import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { IUser } from "@/types/auth";

export const useUser = () => {
  const { user, setUser, isLoading } = useContext(UserContext);
  return { user: user as unknown as IUser, setUser, isLoading };
};
  