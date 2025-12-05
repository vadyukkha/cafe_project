'use client'

import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { RootState } from "@/src/shared/store/store";
import { fetchMe } from "@/src/entities/auth/lib/api";
import { UserProfile } from "@/src/entities/auth/ui/UserProfile";

export default async function MePage() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const token = useSelector((state: RootState) => state.auth.accessToken) as string;

    if (!isAuthenticated) {
        redirect("/login");
    }

    try {
        const user = await fetchMe(token);

        return <UserProfile user={user} />;
    } catch (error) {
        console.error(error);
        redirect("/login");
    }
}
