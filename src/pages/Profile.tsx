import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileError } from "@/components/profile/ProfileError";
import { ReviewsList } from "@/components/profile/ReviewsList";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

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

  const { data: serviceProvider } = useQuery({
    queryKey: ["serviceProvider", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1);

      if (error) throw error;
      return data?.[0];
    },
    enabled: !!session?.user?.id,
  });

  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ["reviews", serviceProvider?.id],
    queryFn: async () => {
      if (!serviceProvider?.id) throw new Error("No provider ID");
      
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          provider:service_providers (
            business_name
          )
        `)
        .eq("provider_id", serviceProvider.id);

      if (error) throw error;
      return data;
    },
    enabled: !!serviceProvider?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: {
      first_name: string;
      last_name: string;
      show_personal_info: boolean;
    }) => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          ...data,
          full_name: `${data.first_name} ${data.last_name}`.trim(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/auth");
    }
  }, [session, navigate, sessionLoading]);

  if (sessionLoading || profileLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8">
        <ProfileError message="Failed to load profile. Please try refreshing the page." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-4xl">
      <div className="space-y-8">
        <ProfileHeader
          avatarUrl={profile?.avatar_url}
          firstName={profile?.first_name}
          lastName={profile?.last_name}
          showPersonalInfo={profile?.show_personal_info}
          onEditClick={() => setIsEditing(true)}
          onAvatarUpload={handleAvatarUpload}
        />

        {isEditing && (
          <ProfileForm
            initialData={{
              first_name: profile?.first_name || "",
              last_name: profile?.last_name || "",
              show_personal_info: profile?.show_personal_info || false,
            }}
            onSubmit={(data) => updateProfile.mutate(data)}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {serviceProvider && (
          <div className="mt-8">
            {reviewsError ? (
              <ProfileError message="Failed to load reviews. Please try refreshing the page." />
            ) : (
              <ReviewsList reviews={reviews || []} isLoading={reviewsLoading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;