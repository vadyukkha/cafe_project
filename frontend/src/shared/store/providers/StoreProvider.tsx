"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { makeStore, AppStore } from "../store";

interface StoreProviderProps {
    children: ReactNode;
    initialAuth: boolean;
}

export function StoreProvider({ children, initialAuth }: StoreProviderProps) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore({
            auth: {
                accessToken: initialAuth ? "SSR_TOKEN_PLACEHOLDER" : null,
                isAuthenticated: initialAuth,
            },
        });
    }

    return <Provider store={storeRef.current!}>{children}</Provider>;
}
