import {createContext} from "react";
import type {ToastContextType} from "../types/types.ts";

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
