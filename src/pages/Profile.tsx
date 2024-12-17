import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileError } from "@/components/profile/ProfileError";
import { ReviewsList } from "@/components/profile/ReviewsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${session.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Avatar updated",
        description: "Your avatar has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      console.error("Error uploading avatar:", error);
    }
  };

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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            {isEditing ? (
              <ProfileForm
                initialData={{
                  first_name: profile?.first_name || "",
                  last_name: profile?.last_name || "",
                  show_personal_info: profile?.show_personal_info || false,
                }}
                onSubmit={(data) => updateProfile.mutate(data)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">About Me</h3>
                <p className="text-muted-foreground">
                  {profile?.first_name
                    ? `Hi, I'm ${profile.first_name}!`
                    : "No profile information available yet. Click 'Edit Profile' to add your details."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            {reviewsError ? (
              <ProfileError message="Failed to load reviews. Please try refreshing the page." />
            ) : (
              <ReviewsList reviews={reviews || []} isLoading={reviewsLoading} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;