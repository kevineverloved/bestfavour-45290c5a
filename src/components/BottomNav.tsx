
import { Home, User, Calendar, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-background border-t border-gray-200 flex items-center justify-around">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center justify-center h-full w-full ${
          isActive("/") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs mt-1">Home</span>
      </button>

      {session ? (
        <>
          <button
            onClick={() => navigate("/bookings")}
            className={`flex flex-col items-center justify-center h-full w-full ${
              isActive("/bookings") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Bookings</span>
          </button>
          
          <button
            onClick={() => navigate("/profile")}
            className={`flex flex-col items-center justify-center h-full w-full ${
              isActive("/profile") ? "text-primary" : "text-gray-500"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
          
          <button
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center justify-center h-full w-full ${
              isActive("/settings") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className={`flex flex-col items-center justify-center h-full w-full ${
            isActive("/auth") ? "text-primary" : "text-gray-500"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Sign In</span>
        </button>
      )}
    </div>
  );
}
