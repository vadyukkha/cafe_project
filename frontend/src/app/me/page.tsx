"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/shared/store/store";
import { fetchMe } from "@/src/entities/auth/lib/api";
import { UserProfile } from "@/src/entities/auth/ui/UserProfile";
import { UserResponse } from "@/src/entities/auth/model/types";

export default function MePage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const token = useSelector((state: RootState) => state.auth.accessToken) as string;

    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push("/login");
            return;
        }

        const loadUser = async () => {
            try {
                const me = await fetchMe(token);
                setUser(me);
            } catch (error) {
                console.error(error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [isAuthenticated, token, router]);

    if (loading) return <div>Загрузка...</div>;
    if (!user) return <div>Пользователь не найден</div>;

    return <UserProfile user={user} />;
}
