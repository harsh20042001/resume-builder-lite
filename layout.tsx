// app/(app)/layout.tsx
import Script from "next/script";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Loaded once for the whole authenticated app — UpgradeModal expects window.Razorpay */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      {children}
    </>
  );
}
