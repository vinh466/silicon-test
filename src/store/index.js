import { createContext, useReducer } from "react"
import reducer, { initialState } from "./reducer";

export const StoreContext = createContext();
