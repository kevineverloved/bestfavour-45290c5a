import { Session } from "@supabase/supabase-js";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { ReviewsList } from "./ReviewsList";
import { ProfileError } from "./ProfileError";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AvatarCropDialog } from "./AvatarCropDialog";
import { useNavigate } from "react-router-dom";

interface ProfileContentProps {
  session: Session;
  profile: any;
  reviews: any[];
  reviewsLoading: boolean;
  reviewsError: Error | null;
}

export function ProfileContent({
  session,
  profile,
  reviews,
  reviewsLoading,
  reviewsError,
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateProfile = useMutation({
    mutationFn: async (data: {
      first_name: string;
      last_name: string;
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
    if (!file) return;

    // Create a temporary URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setCropDialogOpen(true);
  };

  const handleCroppedImage = async (croppedBlob: Blob) => {
    if (!session?.user?.id) return;

    try {
      // Create a new file from the cropped blob
      const fileExt = 'jpg';
      const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Invalidate the profile query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCropDialogOpen(false);
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
        setSelectedImage(null);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-4xl relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent"
        onClick={() => navigate('/settings')}
      >
        <Settings2 className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Button>

      <div className="space-y-8">
        <ProfileHeader
          avatarUrl={profile?.avatar_url}
          firstName={profile?.first_name}
          lastName={profile?.last_name}
          showPersonalInfo={profile?.show_personal_info}
          onEditClick={() => setIsEditing(true)}
          onAvatarUpload={handleAvatarUpload}
        />

        {selectedImage && (
          <AvatarCropDialog
            imageUrl={selectedImage}
            isOpen={cropDialogOpen}
            onClose={() => {
              setCropDialogOpen(false);
              setSelectedImage(null);
            }}
            onCropComplete={handleCroppedImage}
          />
        )}

        {isEditing && (
          <ProfileForm
            initialData={{
              first_name: profile?.first_name || "",
              last_name: profile?.last_name || "",
            }}
            onSubmit={(data) => updateProfile.mutate(data)}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {reviewsError ? (
          <ProfileError message="Failed to load reviews. Please try refreshing the page." />
        ) : (
          <ReviewsList 
            reviews={reviews || []} 
            isLoading={reviewsLoading} 
            showReviews={profile?.show_personal_info}
          />
        )}
      </div>
    </div>
  );
}