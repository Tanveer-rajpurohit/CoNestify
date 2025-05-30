import type { Metadata } from "next";
import localFont from "next/font/local";
import { Permanent_Marker, Nothing_You_Could_Do,Balthazar,Poppins } from "next/font/google"; // Import Google Font
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// Add Permanent Marker font
const permanentMarker = Permanent_Marker({
  weight: "400", // Specify the weight if needed
  subsets: ["latin"], // Specify the subset
  variable: "--font-permanent-marker", // Add a CSS variable for the font
});

const NothingYouCouldDo = Nothing_You_Could_Do({
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-nothing-you-could-do",
});

const balthazarFont = Balthazar({
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-balthazar", 
});

const poppinsFont = Poppins({
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-poppins", 
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} ${NothingYouCouldDo.variable}  ${balthazarFont.variable} ${poppinsFont.variable} `}
      >
     
          {children}
      </body>
    </html>
  );
}
