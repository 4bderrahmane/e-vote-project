import {createContext} from "react";
import type {AuthContextValue} from "./types.ts";

export const AuthContext = createContext<AuthContextValue | null>(null);