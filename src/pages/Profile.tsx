import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProfileError } from "@/components/profile/ProfileError";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .limit(1);

      if (error) throw error;
      
      return data?.[0];
    },
    enabled: !!session?.user?.id,
  });

  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ["reviews", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          provider:service_providers (
            business_name
          )
        `)
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (sessionLoading || profileLoading) {
    return (
      <>
        {!isMobile && <BurgerMenu />}
        <ProfileLoading />
        {isMobile && <BottomNav />}
      </>
    );
  }

  if (!session) {
    navigate("/auth");
    return null;
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8">
        {!isMobile && <BurgerMenu />}
        <ProfileError message="Failed to load profile. Please try refreshing the page." />
        {isMobile && <BottomNav />}
      </div>
    );
  }

  return (
    <>
      {!isMobile && <BurgerMenu />}
      <ProfileContent
        session={session}
        profile={profile}
        reviews={reviews || []}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
      />
      {isMobile && <BottomNav />}
    </>
  );
};

export default Profile;