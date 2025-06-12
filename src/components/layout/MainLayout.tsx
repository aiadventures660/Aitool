
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AdBanner from "../ads/AdBanner";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <AdBanner/>
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
      <AdBanner/>
      <Footer />
    </div>
  );
};
