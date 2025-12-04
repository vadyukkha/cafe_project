import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/src/widgets/header/Header";
import { Footer } from "@/src/widgets/footer/Footer";

export const metadata: Metadata = {
    title: "Coffee Shop",
    description: "Simple coffee shop application built with Next.js",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body>
                <Header />
                <main className="container">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
