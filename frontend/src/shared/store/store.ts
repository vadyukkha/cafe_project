import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/src/entities/auth/model/authSlice";

const rootReducer = combineReducers({
    auth: authReducer,
});

export function makeStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
