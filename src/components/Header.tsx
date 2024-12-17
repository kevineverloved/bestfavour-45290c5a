import { Settings } from "lucide-react";
import { BurgerMenu } from "@/components/BurgerMenu";

export const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Left section - Logo */}
        <div className="w-16">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        
        {/* Center section - Text */}
        <div className="flex items-center">
          <span className="text-2xl font-bold">BestFavour</span>
        </div>
        
        {/* Right section - Burger Menu */}
        <div className="w-16 flex justify-end">
          <BurgerMenu />
        </div>
      </div>
    </div>
  );
};