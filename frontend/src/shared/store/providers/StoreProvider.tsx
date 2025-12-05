"use client";

import { Provider } from "react-redux";
import { store } from "@/src/shared/store/store";
import { useEffect } from "react";
import { setInitialAuth } from "@/src/entities/auth/model/authSlice";

export function StoreProvider({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: boolean;
}) {
  useEffect(() => {
    if (initialAuth !== undefined) {
      store.dispatch(setInitialAuth(initialAuth));
    }
  }, [initialAuth]);

  return <Provider store={store}>{children}</Provider>;
}
