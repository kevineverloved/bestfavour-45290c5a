import { User, Bookmark, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const BottomNav = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
      return;
    }
    toast({
      title: "Signed out successfully",
      description: "See you soon!",
    });
    navigate("/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>
      </Link>
      <Link to="/bookings">
        <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
          <Bookmark className="h-5 w-5" />
          <span className="text-xs">Bookings</span>
        </Button>
      </Link>
      <Link to="/profile">
        <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </Link>
    </div>
  );
};