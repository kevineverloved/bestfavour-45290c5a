import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServiceCategory from "./pages/ServiceCategory";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import Profile from "./pages/Profile";
import Location from "./pages/Location";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services/:categoryId" element={<ServiceCategory />} />
          <Route path="/book/:providerId" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/location" element={<Location />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;