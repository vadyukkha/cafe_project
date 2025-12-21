"use client";

import { Provider } from "react-redux";
import { ReactNode, useState } from "react";
import { makeStore, AppStore } from "../store";

interface StoreProviderProps {
    children: ReactNode;
    isAuthenticated: boolean;
}

export function StoreProvider({ children, isAuthenticated }: StoreProviderProps) {
    const [store] = useState<AppStore>(() =>
        makeStore({
            auth: {
                isAuthenticated,
            },
        })
    );

    return <Provider store={store}>{children}</Provider>;
}
