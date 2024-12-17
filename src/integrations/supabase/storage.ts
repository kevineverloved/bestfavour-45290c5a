import { supabase } from "./client";

export async function createAvatarsBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'avatars')) {
    const { error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 1024 * 1024, // 1MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
    });
    
    if (error) {
      console.error('Error creating avatars bucket:', error);
    }
  }
}

// Call this function when the app starts
createAvatarsBucket();