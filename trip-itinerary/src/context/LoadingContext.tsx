import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import SplashScreen from "../components/global/SplashScreen";

interface LoadingContextValue {
    isLoading: boolean;
    track: <T>(promise: Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [count, setCount] = useState(0);
    
    const track = useCallback(async <T,>(promise: Promise<T>) => {
        setCount(c => c + 1);
        try {
            return await promise;
        } finally {
            setCount(c => c - 1);
        }
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading: count > 0, track }}>
            {children}
            {count > 0 && <SplashScreen />}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
    return ctx;
}