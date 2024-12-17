import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onEditClick: () => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({ avatarUrl, fullName, onEditClick, onAvatarUpload }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>{fullName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarUpload}
              />
            </label>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{fullName || "Anonymous"}</h2>
          </div>
          <Button onClick={onEditClick} variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}