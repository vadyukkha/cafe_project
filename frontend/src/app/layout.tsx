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
            <body>
                <StoreProvider initialAuth={isAuthenticated}>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </StoreProvider>
            </body>
        </html>
    );
}
