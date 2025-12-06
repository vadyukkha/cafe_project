"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { makeStore, AppStore } from "../store";

interface StoreProviderProps {
    children: ReactNode;
    initialToken: string | null;
}

export function StoreProvider({ children, initialToken }: StoreProviderProps) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore({
            auth: {
                accessToken: initialToken,
                isAuthenticated: !!initialToken,
            },
        });
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}