import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans", subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono", subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Monanga Business", description: "Plateforme de gestion d'entreprise",
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (<html lang="fr" className="dark">
		<body
			className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-900 text-white min-h-screen`}
		>
		{children}
		<SpeedInsights/>
		</body>
		</html>);
}
