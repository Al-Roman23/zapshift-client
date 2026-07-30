// Custom Hook To Access Authentication Context
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth Must Be Used Within An AuthProvider!");
  }
  return context;
};

export default useAuth;
