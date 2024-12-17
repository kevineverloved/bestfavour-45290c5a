import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServiceCategory from "./pages/ServiceCategory";
import BookingPage from "./pages/BookingPage";
import Profile from "./pages/Profile";
import BookingsPage from "./pages/BookingsPage";
import Location from "./pages/Location";
import Settings from "./pages/Settings";
import PersonalInformation from "./pages/PersonalInformation";
import NotificationsSettings from "./pages/NotificationsSettings";

const App: React.FC = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/category/:id" element={<ServiceCategory />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/personal-information" element={<PersonalInformation />} />
            <Route path="/settings/notifications" element={<NotificationsSettings />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;