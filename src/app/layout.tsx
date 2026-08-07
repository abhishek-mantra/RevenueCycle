import React from "react";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MantraCare RCM — Revenue Cycle Management",
  description: "Light monochrome neumorphism + glassmorphism RCM prototype for MantraCare ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[var(--accent)] selection:text-white">
        {/* Ambient background depth blobs for glass backdrop-blur */}
        <div className="ambient-bg">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
        </div>
        {children}
      </body>
    </html>
  );
}
