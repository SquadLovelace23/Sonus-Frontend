import { useContext } from "react";
import { userContext } from "../context/UserContext";

export const useUserContext = () => useContext(userContext);