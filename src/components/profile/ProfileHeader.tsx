
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  showPersonalInfo?: boolean | null;
  onEditClick: () => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({
  avatarUrl,
  firstName,
  lastName,
  showPersonalInfo,
  onEditClick,
  onAvatarUpload,
}: ProfileHeaderProps) {
  const displayName = showPersonalInfo
    ? [firstName, lastName].filter(Boolean).join(" ")
    : firstName || "Anonymous User";

  const initials = firstName?.[0] || "U";

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none shadow-md">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-2 ring-background shadow-xl">
              <AvatarImage src={avatarUrl || undefined} className="object-cover" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer 
                       shadow-lg transition-transform group-hover:scale-110"
            >
              <Camera className="h-4 w-4 text-primary-foreground" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarUpload}
              />
            </label>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2">{displayName}</h2>
            <p className="text-muted-foreground text-sm">
              {showPersonalInfo ? "Sharing full profile" : "Sharing limited profile"}
            </p>
          </div>
          
          <Button onClick={onEditClick} variant="outline" className="shadow-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
