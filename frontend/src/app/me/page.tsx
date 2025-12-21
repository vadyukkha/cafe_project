"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/shared/store/store";
import { fetchMe } from "@/src/entities/auth/lib/api";
import { UserProfile } from "@/src/entities/auth/ui/UserProfile";
import { LoyaltyCard, User } from "@/src/entities/auth/model/types";

export default function MePage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const [user, setUser] = useState<User | null>(null);
    const [card, setCard] = useState<LoyaltyCard | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const loadUser = async () => {
            try {
                const me = await fetchMe();
                setUser(me.user);
                setCard(me.loyaltyCard);
            } catch (error) {
                console.error(error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [isAuthenticated, router]);

    if (loading) return <div>Загрузка...</div>;
    if (!user) return <div>Пользователь не найден</div>;

    return <UserProfile user={user} card={card} />;
}
