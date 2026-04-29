import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "원주 신림 전원주택 | 8세대 한정 분양",
  description: "강원특별자치도 원주시 신림면 연봉정길 59-6 전원주택 분양 상담 및 방문 예약",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
