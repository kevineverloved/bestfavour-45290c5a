import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ReviewsList } from "@/components/profile/ReviewsList";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
  });

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
        .eq("id", session.user.id);

      if (error) throw error;
      
      // If no profile exists, create one
      if (!data || data.length === 0) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: session.user.id }])
          .select()
          .single();
          
        if (createError) throw createError;
        return newProfile;
      }
      
      return data[0];
    },
    enabled: !!session?.user?.id,
    retry: 1,
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
    retry: 1,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", session.user.id);

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
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
      });
    }
  }, [session, profile, navigate, sessionLoading]);

  if (sessionLoading || profileLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load profile. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <ProfileHeader
          avatarUrl={profile?.avatar_url}
          fullName={profile?.full_name}
          onEditClick={() => setIsEditing(true)}
          onAvatarUpload={handleAvatarUpload}
        />

        {isEditing ? (
          <Card>
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfile.mutate(formData);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {reviewsError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load reviews. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <ReviewsList reviews={reviews || []} isLoading={reviewsLoading} />
        )}
      </div>
    </div>
  );
};

export default Profile;
