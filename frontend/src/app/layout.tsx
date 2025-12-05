import "./globals.css";
import { StoreProvider } from "@/src/shared/store/providers/StoreProvider";
import { Header } from "@/src/widgets/header/Header";
import { Footer } from "@/src/widgets/footer/Footer";
import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");
    const isAuthenticated = !!authToken;

    return (
        <html lang="ru">
            <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <StoreProvider initialAuth={isAuthenticated}>
                    <Header />
                    <main style={{ flex: 1 }}>{children}</main>
                    <Footer />
                </StoreProvider>
            </body>
        </html>
    );
}
