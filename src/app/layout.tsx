import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://starttambola.in"),
  title: {
    default: "StartTambola — #1 Platform for Online Tambola Organizers",
    template: "%s | StartTambola",
  },
  description:
    "Get your own fully branded Tambola game website up and running in 24 hours. Sell tickets, manage agents, and announce winners automatically.",
  keywords: ["StartTambola", "Online Tambola", "Tambola Game Organizer", "Housie Website Builder", "Tambola Ticket Booking"],
  openGraph: {
    title: "StartTambola — Run Your Own Tambola Game Like a Pro",
    description: "Get your own fully branded Tambola game website up and running in 24 hours. No code, no hassle.",
    url: "https://starttambola.in",
    siteName: "StartTambola",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartTambola — Run Your Own Tambola Game",
    description: "The ultimate platform for Tambola organizers to sell tickets and manage automated games.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject
          attributes like cz-shortcut-listen onto <body> after SSR, which causes
          a React hydration mismatch. This suppresses that warning on <body> only. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
